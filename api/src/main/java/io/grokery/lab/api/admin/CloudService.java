package io.grokery.lab.api.admin;

import java.util.Map;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.grokery.lab.api.admin.dao.DynamoDAOUtil;
import io.grokery.lab.api.admin.models.Cloud;
import io.grokery.lab.api.admin.models.User;
import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.admin.types.AccountRole;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.DefaultClaims;

public class CloudService {

	private static final Logger logger = LoggerFactory.getLogger(CloudService.class);
	private static volatile CloudService instance;
	private static final long JWT_TIMEOUT = 28800000;

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

	public JsonObj create(String auth, JsonObj requestBody) throws Exception {
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
		cloud.getUsers().put(user.getUserId(), new UserRef(user.getUserId(), "admin"));

		CloudAccess adminAccess = mapper.convertValue(requestBody.get("adminAccess"), CloudAccess.class);
		adminAccess.setCloudId(cloud.getCloudId());
		user.getClouds().put(cloud.getCloudId(), adminAccess);

		cloud.assertIsValidForCreate();

		logger.info("Saving new cloud and cloud references for account and user");
		dao.save(cloud);
		dao.save(user);
		logger.info("Finished saving");

		Cloud created = dao.load(Cloud.class, Cloud.hashKey, cloud.getCloudId());
		if (created == null) {
			throw new Error("Error creating or saving cloud");
		}

		Claims cloudClaims = new DefaultClaims();
		cloudClaims.put("cloudId", created.getCloudId());
		cloudClaims.put("cloudType", created.getCloudType());
		cloudClaims.put("cloudName", created.getName());
		cloudClaims.put("cloudRole", created.getUsers().get(user.getUserId()).getCloudRole());
		cloudClaims.put("daoType", "DYNAMODB");

		adminAccess.setCloudToken(DigitalPiglet.makeJWT(cloudClaims, JWT_TIMEOUT, cloud.getJwtPrivateKey()));
		adminAccess.setCloudInfo(mapper.convertValue(created, JsonObj.class));

		return mapper.convertValue(adminAccess, JsonObj.class);
	}

	public JsonObj retrieve(String auth, String cloudId) throws NotFoundException, NotAuthorizedException {
		Cloud cloud = null;
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			cloud = dao.load(Cloud.class, Cloud.hashKey, cloudId);
			if (cloud == null) {
				throw new NotFoundException();
			}
			if (!cloud.getUsers().containsKey(claims.get("userId").toString())) {
				throw new NotAuthorizedException("You do not have adminAccess to this cloud. Please request adminAccess from an admin for this cloud.");
			}
		} catch (NotAuthorizedException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		return mapper.convertValue(cloud, JsonObj.class);
	}

	public JsonObj update(String auth, String cloudId, JsonObj requestBody) throws NotFoundException, NotAuthorizedException, InvalidInputException {
		Cloud cloud = null;
		User user = null;
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			cloud = dao.load(Cloud.class, Cloud.hashKey, cloudId);
			if (cloud == null) {
				throw new NotFoundException("Cloud not found");
			}
			user = dao.load(User.class, User.hashKey, claims.get("userId").toString());
			if (user == null) {
				throw new NotFoundException("User not found");
			}
			Map<String, UserRef> cloudUsers = cloud.getUsers();
			if (cloudUsers != null && !cloudUsers.containsKey(claims.get("userId").toString())) {
				throw new NotAuthorizedException("You do not have adminAccess to this cloud. Please request adminAccess from an admin.");
			}
			String accountRole = claims.get("accountRole").toString();
			if (AccountRole.valueOf(accountRole) != AccountRole.ADMIN) {
				throw new NotAuthorizedException("Admin role required to update cloud");
			}
		} catch (NotAuthorizedException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		Cloud cloudUpdateInfo = mapper.convertValue(requestBody, Cloud.class);
		
		if (cloudUpdateInfo.getUrl() != null) {
			cloud.setUrl(cloudUpdateInfo.getUrl());
		}
		if (cloudUpdateInfo.getJwtPrivateKey() != null) {
			cloud.setJwtPrivateKey(cloudUpdateInfo.getJwtPrivateKey());
		}

		if (cloudUpdateInfo.getName() != null && cloudUpdateInfo.getTitle() != null) {
			cloud.setName(cloudUpdateInfo.getName());
			cloud.setTitle(cloudUpdateInfo.getTitle());
		}
		if (cloudUpdateInfo.getDescription() != null) {
			cloud.setDescription(cloudUpdateInfo.getDescription());
		}
		if (cloudUpdateInfo.getStatus() != null) {
			cloud.setStatus(cloudUpdateInfo.getStatus());
		}

		dao.save(cloud);

		return mapper.convertValue(cloud, JsonObj.class);
	}

	public JsonObj delete(String auth, String cloudId) throws NotAuthorizedException, NotFoundException {
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
			Map<String, UserRef> cloudUsers = cloud.getUsers();
			if (cloudUsers != null && !cloudUsers.containsKey(claims.get("userId").toString())) {
				throw new NotAuthorizedException("You do not have adminAccess to this cloud. Please request adminAccess from an admin.");
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

		for (UserRef userRef : cloud.getUsers().values()) {
			user = dao.load(User.class, User.hashKey, userRef.getUserId());
			user.getClouds().remove(cloud.getCloudId());
			dao.save(user);
		}

		dao.delete(cloud);

		return mapper.convertValue(cloud, JsonObj.class);
	}

	public JsonObj getOptions(String auth, String cloudId) {
		return new JsonObj();
	}

}
