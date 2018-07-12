package io.grokery.lab.api.admin;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.admin.models.submodels.CloudCredentials;
import io.grokery.lab.api.admin.dao.DynamoDAOUtil;
import io.grokery.lab.api.admin.models.Account;
import io.grokery.lab.api.admin.models.User;
import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.admin.types.AccountRole;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.CommonUtils;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.DefaultClaims;

import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	private static volatile UserService instance;

	private static final long JWT_TIMEOUT = 28800000;

	private DynamoDBMapper dao;
	public final ObjectMapper mapper;

	public UserService() {
		dao = new DynamoDAOUtil(User.class).getDAO();
		mapper = MapperUtil.getInstance();
	}

	public static UserService getInstance() {
        synchronized (UserService.class) {
            if (instance == null) {
                instance = new UserService();
            }
        }
        return instance;
    }

	public JsonObj create(String auth, JsonObj requestBody) throws Exception {

		User user = mapper.convertValue(requestBody, User.class);

		if (auth == null && AccountRole.valueOf(requestBody.get("accountRole").toString()) == AccountRole.SUPERADMIN) {
			// make sure there aren't any users/accounts yet and throw exception if there are
			int userCount = dao.count(User.class, new DynamoDBQueryExpression<User>().withHashKeyValues(new User()));
			if (userCount != 0) {
				throw new NotAuthorizedException("SuperAdmin user/account may only be created during system initialization");
			}
			AccountService provider = AccountService.getInstance();
			JsonObj acct = new JsonObj();
			acct.put("accountType", "SUPERADMIN");
			JsonObj result = provider.create(null, acct);
			user.setAccountId(result.get("accountId").toString());
		} else {
			try {
				Claims claims = DigitalPiglet.parseJWT(auth);
				String accountRole = claims.get("accountRole").toString();
				if (AccountRole.valueOf(accountRole) != AccountRole.SUPERADMIN) {
					if (AccountRole.valueOf(accountRole) != AccountRole.ADMIN) {
						throw new NotAuthorizedException("Admin role required to create new user");
					}
					if (!claims.get("accountId").toString().equals(requestBody.get("accountId").toString())) {
						throw new NotAuthorizedException("Invalid accountId");
					}
				}
			} catch (NotAuthorizedException e) {
				throw e;
			} catch (Throwable e) {
				throw new NotAuthorizedException();
			}
		}

		if (dao.load(User.class, User.hashKey, user.getUsername()) != null) {
			throw new InvalidInputException("Invalid username");
		}

		user.assertIsValidForCreate();

		Account account = dao.load(Account.class, Account.hashKey, user.getAccountId());
		if (account == null) {
			throw new InvalidInputException("Invalid accountId");
		}
		account.getUsers().add(new UserRef(user.getUserId()));

		// Hash password
		// TODO handle salt generation properly
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12)));

		// Save and verify
		dao.save(user);
		dao.save(account);

        User created = dao.load(User.class, User.hashKey, user.getUserId());
		if (created == null) {
			throw new Error("Error creating user");
		}

		// Redact password hash and piglets
		created = redact(created);

		// Map and return
		JsonObj response = mapper.convertValue(created, JsonObj.class);
		return response;
	}

	public JsonObj retrieve(String auth, String username) throws NotFoundException, NotAuthorizedException {

		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			if (!claims.getSubject().equals(username)) {
				throw new NotAuthorizedException();
			}
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		User user = dao.load(User.class, User.hashKey, username);
		if (user == null) {
			throw new NotFoundException();
		}

		user = redact(user);

		JsonObj response = mapper.convertValue(user, JsonObj.class);
		return response;
	}

	public JsonObj update(String auth, String username, JsonObj requestBody) {
		// TODO check that user name not changing and/or handle
		// TODO check if password updating and handle (update cloud credential)
		throw new NotImplementedError();
	}

	public JsonObj delete(String auth, String username) {
		throw new NotImplementedError();
	}

	public JsonObj authenticate(JsonObj request) throws InvalidInputException, NotAuthorizedException {
		User user = null;
		try {
			String username = request.get("username").toString();
			String password = request.get("password").toString();
			if (CommonUtils.isNullOrEmpty(username) || CommonUtils.isNullOrEmpty(password)) {
				throw new InvalidInputException("Please submit a valid username and password");
			}
			user = getUserByUsername(username);
			String passFromDb = user.getPassword();
			if (!BCrypt.checkpw(password, passFromDb)) {
				throw new NotAuthorizedException("User not found or password not match");
			}
		} catch (InvalidInputException | NotAuthorizedException e) {
			throw e;
		} catch (Throwable t) {
			logger.error(t.getMessage());
			throw new NotAuthorizedException("Error authorizing user");
		}

		// Make and set account access token
		Claims accountClaims = new DefaultClaims();
		accountClaims.setSubject(user.getUsername());
		accountClaims.put("userId", user.getUserId());
		accountClaims.put("username", user.getUsername());
		accountClaims.put("accountId", user.getAccountId());
		accountClaims.put("accountRole", user.getAccountRole());
		String jwt = DigitalPiglet.makeJWT(accountClaims, JWT_TIMEOUT);
		user.setAccountToken(jwt);
		user.setPassword(null);

		// Decrypt cloud credentials with raw password and wrap in jwt tokens
		Iterator<Entry<String, CloudAccess>> it = user.getClouds().entrySet().iterator();
		while (it.hasNext()) {
			CloudAccess cloudAccess = it.next().getValue();
			CloudCredentials creds = cloudAccess.getCredentials();
			Claims cloudClaims = new DefaultClaims();
			String rawPass = request.get("password").toString();
			cloudClaims.put("awsAccessKeyId", DigitalPiglet.parsePiglet(creds.getAwsAccessKeyId(), rawPass));
			cloudClaims.put("awsSecretKey", DigitalPiglet.parsePiglet(creds.getAwsSecretKey(), rawPass));
			cloudClaims.put("awsRegion", creds.getAwsRegion());
			cloudClaims.put("cloudName", cloudAccess.getName());
			cloudClaims.put("cloudRole", creds.getCloudRole());
			cloudClaims.put("cloudType", cloudAccess.getCloudType());
			cloudAccess.setCloudToken(DigitalPiglet.makeJWT(cloudClaims, JWT_TIMEOUT));
			cloudAccess.setCredentials(null);
		}

		JsonObj response = mapper.convertValue(user, JsonObj.class);
		return response;
	}

	private User getUserByUsername(String username) throws NotAuthorizedException {
		HashMap<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":hk", new AttributeValue().withS("USER"));
		eav.put(":v1",  new AttributeValue().withS(username));

		DynamoDBQueryExpression<User> queryExpression = new DynamoDBQueryExpression<User>()
			.withIndexName("username")
			.withConsistentRead(false)
			.withKeyConditionExpression("hashKey = :hk and username = :v1")
			.withExpressionAttributeValues(eav);

		List<User> results =  dao.query(User.class, queryExpression);
		if (results == null || results.size() == 0) {
			throw new NotAuthorizedException("User not found or password not match");
		}
		if (results.size() > 1) {
			throw new NotAuthorizedException("User in error State");
		}
		User user = results.get(0);
		user = dao.load(User.class, User.hashKey, user.getUserId());
		return user;
	}

	private User redact(User user) {
		user.setPassword(null);
		Iterator<Entry<String, CloudAccess>> it = user.getClouds().entrySet().iterator();
	    while (it.hasNext()) {
			it.next().getValue().setCredentials(null);
		}
		return user;
	}

}
