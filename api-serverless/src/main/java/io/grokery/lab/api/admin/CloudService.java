package io.grokery.lab.api.admin;

import java.util.Map;

import io.grokery.lab.api.admin.models.Account;
import io.grokery.lab.api.admin.models.Cloud;
import io.grokery.lab.api.admin.models.User;
import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.admin.models.submodels.CloudCredentials;
import io.grokery.lab.api.admin.models.submodels.CloudRef;
import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;

public class CloudService extends ServiceBaseClass {

	private static final Logger logger = LoggerFactory.getLogger(CloudService.class);
	private static volatile CloudService instance;

	public CloudService () {
		super(Cloud.class);
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
			user = dynamo.load(User.class, User.hashKey, claims.get("userId").toString());
			if (!user.getAccountId().equals(requestBody.get("accountId").toString())) {
				throw new NotAuthorizedException("You do not have permission to create a cloud for this account. Please contact an account admin to request access.");
			}
        } catch (NotAuthorizedException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		Cloud cloud = objectMapper.convertValue(requestBody, Cloud.class);
		cloud.getUsers().add(new UserRef(user.getUserId()));
		cloud.assertIsValidForCreate();

		Account account = dynamo.load(Account.class, Account.hashKey, cloud.getAccountId());
		account.getClouds().add(new CloudRef(cloud.getCloudId()));

		CloudAccess access = objectMapper.convertValue(requestBody.get("adminAccess"), CloudAccess.class);
		access.setCloudId(cloud.getCloudId());
		access.setTitle(cloud.getTitle());
		CloudCredentials creds = access.getCredentials();
		creds.setCloudRole("admin");
		String rawPass = requestBody.get("password").toString();
		creds.setAwsAccessKeyId(DigitalPiglet.makePiglet(creds.getAwsAccessKeyId(), rawPass));
		creds.setAwsSecretKey(DigitalPiglet.makePiglet(creds.getAwsSecretKey(), rawPass));
		user.getClouds().put(cloud.getName(), access);

		dynamo.save(cloud);
		dynamo.save(account);
		dynamo.save(user);

		Cloud created = dynamo.load(Cloud.class, Cloud.hashKey, cloud.getCloudId());
		if (created == null) {
			throw new Error("Error creating or saving cloud");
		}
		@SuppressWarnings("unchecked")
		Map<String, Object> response = objectMapper.convertValue(created, Map.class);
		return response;
	}

	public Map<String, Object> retrieve(String auth, String cloudId) throws NotFoundException, NotAuthorizedException {
		Cloud cloud = null;
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			cloud = dynamo.load(Cloud.class, Cloud.hashKey, cloudId);
			if (cloud == null) {
				throw new NotFoundException();
			}
			if (!cloud.getUsers().contains(new UserRef(claims.getSubject()))) {
                throw new NotAuthorizedException("You do not have read access to this cloud. Please request access from an admin for this cloud.");
            }
        } catch (NotAuthorizedException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
        
		@SuppressWarnings("unchecked")
		Map<String, Object> response = objectMapper.convertValue(cloud, Map.class);
		return response;
	}

    public Map<String, Object> update(String auth, String cloudId, Map<String, Object> requestBody) {
		throw new NotImplementedError();
	}
	
	public Map<String, Object> delete(String auth, String cloudId) {
		throw new NotImplementedError();
	}
	
}
