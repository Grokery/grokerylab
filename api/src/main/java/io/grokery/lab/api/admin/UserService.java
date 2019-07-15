package io.grokery.lab.api.admin;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.admin.models.submodels.CloudCredentials;
import io.grokery.lab.api.admin.dao.DynamoDAOUtil;
import io.grokery.lab.api.admin.models.Cloud;
import io.grokery.lab.api.admin.models.User;
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
		
		if (auth == null && AccountRole.valueOf(user.getAccountRole()) == AccountRole.ADMIN) {
			int userCount = dao.count(User.class, new DynamoDBQueryExpression<User>().withHashKeyValues(new User()));
			if (userCount != 0) {
				throw new NotAuthorizedException("Valid authentication token required");
			}
		} else {
			try {
				Claims claims = DigitalPiglet.parseJWT(auth);
				AccountRole accountRole = AccountRole.valueOf(claims.get("accountRole").toString());
				if (accountRole != AccountRole.ADMIN) {
					throw new NotAuthorizedException("Admin role required to create new user");
				}
			} catch (NotAuthorizedException e) {
				throw e;
			} catch (Throwable e) {
				throw new NotAuthorizedException();
			}

			if (dao.load(User.class, User.hashKey, user.getUsername()) != null) {
				throw new InvalidInputException("Invalid username");
			}
		}

		// TODO handle salt generation
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12)));

		user.assertIsValidForCreate();
		dao.save(user);

		User created = dao.load(User.class, User.hashKey, user.getUserId());
		if (created == null) {
			throw new Error("Error creating user");
		}

		return mapper.convertValue(redact(created), JsonObj.class);
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

		return mapper.convertValue(redact(user), JsonObj.class);
	}

	public JsonObj retrieveAll(String auth) throws NotAuthorizedException {
		try {
			DigitalPiglet.parseJWT(auth);
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		PaginatedScanList<User> users = dao.scan(User.class, new DynamoDBScanExpression());
		List<User> redactedUsers = new ArrayList<User>();
		for (User user : users) {
			redactedUsers.add(this.redact(user));
		}
		redactedUsers.sort(Comparator.comparing(User::getCreated).reversed());
		JsonObj result = new JsonObj();
		result.put("data", redactedUsers);
		return mapper.convertValue(result, JsonObj.class);
	}

	public JsonObj update(String auth, String username, JsonObj requestBody) {
		throw new NotImplementedError();
	}

	public JsonObj delete(String auth, String username) {
		throw new NotImplementedError();
	}

	public JsonObj authenticate(JsonObj request) throws InvalidInputException, NotAuthorizedException {
		User user = null;
		try {
			String username = request.getString("username");
			String password = request.getString("password");
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
		accountClaims.put("accountRole", user.getAccountRole());
		String jwt = DigitalPiglet.makeJWT(accountClaims, JWT_TIMEOUT);
		user.setAccountToken(jwt);
		user.setPassword(null);

		// Make and set cloud access tokens
		HashMap<String, CloudAccess> cloudNameMap = new HashMap<>();
		Iterator<Entry<String, CloudAccess>> it = user.getClouds().entrySet().iterator();
		while (it.hasNext()) {
			try {
				Entry<String, CloudAccess> item = it.next();
				CloudAccess cloudAccess = item.getValue();
				cloudAccess.setCloudId(item.getKey());
	
				Cloud cloudInfo = dao.load(Cloud.class, Cloud.hashKey, cloudAccess.getCloudId());
				cloudAccess.setCloudInfo(mapper.convertValue(cloudInfo, JsonObj.class));
	
				Claims cloudClaims = new DefaultClaims();
				cloudClaims.put("cloudId", cloudInfo.getCloudId());
				cloudClaims.put("cloudType", cloudInfo.getCloudType());
				cloudClaims.put("daoType", cloudInfo.getDaoType());
				cloudClaims.put("cloudName", cloudInfo.getName());
				cloudClaims.put("cloudRole", cloudInfo.getUsers().get(user.getUserId()).getCloudRole());

				CloudCredentials creds = cloudAccess.getCredentials();
				cloudClaims.put("awsAccessKeyId", creds.getAwsAccessKeyId());
				cloudClaims.put("awsSecretKey", creds.getAwsSecretKey());
				cloudClaims.put("awsRegion", creds.getAwsRegion());
	
				cloudAccess.setCloudToken(DigitalPiglet.makeJWT(cloudClaims, JWT_TIMEOUT, cloudInfo.getJwtPrivateKey()));
				cloudAccess.setCredentials(null);
				cloudNameMap.put(cloudInfo.getName(), cloudAccess);
			} catch (Exception e) {
				logger.error("Error reading user cloud access", e);
			}
		}
		user.setClouds(cloudNameMap);

		return mapper.convertValue(user, JsonObj.class);
	}

	private User getUserByUsername(String username) throws NotAuthorizedException {
		HashMap<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":hk", new AttributeValue().withS("USER"));
		eav.put(":v1", new AttributeValue().withS(username));

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
		
		return dao.load(User.class, User.hashKey, results.get(0).getUserId());
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
