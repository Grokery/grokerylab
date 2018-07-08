package io.grokery.lab.api.admin;

import java.util.List;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.grokery.lab.api.admin.dao.DynamoDAOUtil;
import io.grokery.lab.api.admin.models.Account;
import io.grokery.lab.api.admin.models.Cloud;
import io.grokery.lab.api.admin.models.User;
import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.admin.models.submodels.CloudCredentials;
import io.grokery.lab.api.admin.models.submodels.CloudRef;
import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.admin.types.AccountRole;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;

public class CloudService {

	private static final Logger logger = LoggerFactory.getLogger(CloudService.class);
	private static volatile CloudService instance;

	private DynamoDBMapper dao;
	public final ObjectMapper mapper;

	public CloudService () {
		dao = new DynamoDAOUtil(Cloud.class).getDAO();
		mapper = MapperUtil.getInstance();
	}

	public static CloudService getInstance() {
        synchronized (CloudService.class) {
            if (instance == null) {
                instance = new CloudService();
            }
        }
        return instance;
    }

	public Map<String, Object> create(String auth, Map<String, Object> requestBody) throws Exception {
		User user = null;
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			String accountRole = claims.get("accountRole").toString();
			if (AccountRole.valueOf(accountRole) != AccountRole.ADMIN) {
				throw new NotAuthorizedException("Admin role required to create new cloud");
			}
			user = dao.load(User.class, User.hashKey, claims.get("userId").toString());
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		Cloud cloud = mapper.convertValue(requestBody, Cloud.class);
		cloud.setAccountId(user.getAccountId());
		cloud.getUsers().add(new UserRef(user.getUserId()));
		cloud.assertIsValidForCreate();

		Cloud existing = dao.load(Cloud.class, Cloud.hashKey, cloud.getName());
		if (existing != null) {
			throw new InvalidInputException("Duplicate cloud name");
		}

		Account account = dao.load(Account.class, Account.hashKey, cloud.getAccountId());
		account.getClouds().add(new CloudRef(cloud.getCloudId()));

		CloudAccess access = mapper.convertValue(requestBody.get("adminAccess"), CloudAccess.class);
		access.setCloudId(cloud.getCloudId());
		access.setCloudType(cloud.getCloudType());
		access.setTitle(cloud.getTitle());
		access.setName(cloud.getName());
		CloudCredentials creds = access.getCredentials();
		creds.setCloudRole("admin");
		String rawPass = requestBody.get("password").toString();
		creds.setAwsAccessKeyId(DigitalPiglet.makePiglet(creds.getAwsAccessKeyId(), rawPass));
		creds.setAwsSecretKey(DigitalPiglet.makePiglet(creds.getAwsSecretKey(), rawPass));
		user.getClouds().put(cloud.getName(), access);

		logger.info("Saving new cloud and cloud references for account and user");
		dao.save(cloud);
		dao.save(account);
		dao.save(user);
		logger.info("Finished saving");

		Cloud created = dao.load(Cloud.class, Cloud.hashKey, cloud.getCloudId());
		if (created == null) {
			throw new Error("Error creating or saving cloud");
		}
		@SuppressWarnings("unchecked")
		Map<String, Object> response = mapper.convertValue(created, Map.class);
		return response;
	}

	public Map<String, Object> retrieve(String auth, String cloudId) throws NotFoundException, NotAuthorizedException {
		Cloud cloud = null;
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			cloud = dao.load(Cloud.class, Cloud.hashKey, cloudId);
			if (cloud == null) {
				throw new NotFoundException();
			}
			if (!cloud.getUsers().contains(new UserRef(claims.get("userId").toString()))) {
                throw new NotAuthorizedException("You do not have read access to this cloud. Please request access from an admin for this cloud.");
            }
        } catch (NotAuthorizedException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		@SuppressWarnings("unchecked")
		Map<String, Object> response = mapper.convertValue(cloud, Map.class);

        // Map<String, Object> subTypes = new HashMap<>();
        // for (JobType type : JobType.values()) {
        //     subTypes.put(type.name(), type.getTypeName());
        // }
        // for (SourceType type : SourceType.values()) {
        //     subTypes.put(type.name(), type.getTypeName());
        // }
        // response.put("subTypes", subTypes);

		return response;
	}

    public Map<String, Object> update(String auth, String cloudId, Map<String, Object> requestBody) {
		throw new NotImplementedError();
	}

	public Map<String, Object> delete(String auth, String cloudId) throws NotAuthorizedException, NotFoundException {
		User user = null;
		Cloud cloud = null;
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			user = dao.load(User.class, User.hashKey, claims.get("userId").toString());
			if (user == null) {
				throw new NotFoundException("User not found");
			}
			cloud = dao.load(Cloud.class, Cloud.hashKey, cloudId);
			if (cloud == null) {
				throw new NotFoundException("Cloud not found");
			}
			List<UserRef> cloudUsers = cloud.getUsers();
			if (cloudUsers != null && !cloudUsers.contains(new UserRef(claims.get("userId").toString()))) {
				throw new NotAuthorizedException("You do not have access to this cloud. Please request access from an admin.");
			}
			String accountRole = claims.get("accountRole").toString();
			if (AccountRole.valueOf(accountRole) != AccountRole.ADMIN) {
				throw new NotAuthorizedException("Admin role required to delete cloud");
			}
        } catch (NotAuthorizedException e) {
			throw e;
		} catch (NotFoundException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		Account account = dao.load(Account.class, Account.hashKey, cloud.getAccountId());
		account.getClouds().remove(new CloudRef(cloudId));
		dao.save(account);

		for (UserRef userRef : cloud.getUsers()) {
			user = dao.load(User.class, User.hashKey, userRef.getUserId());
			user.getClouds().remove(cloud.getName());
			dao.save(user);
		}

		dao.delete(cloud);

		@SuppressWarnings("unchecked")
		Map<String, Object> response = mapper.convertValue(cloud, Map.class);
		return response;
	}

}
