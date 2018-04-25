package io.grokery.lab.api.admin;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.admin.models.User;
import io.grokery.lab.api.admin.models.submodels.CloudCredentials;
import io.grokery.lab.api.common.Common;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.DefaultClaims;

public class Auth extends BaseController {

	private static final Logger logger = LoggerFactory.getLogger(Auth.class);
	private static final long JWT_TIMEOUT = 28800000;
	
	private static volatile Auth instance;
	
	public static Auth getInstance() {
        synchronized (Auth.class) {
            if (instance == null) {
                instance = new Auth();
            }
        }
        return instance;
    }
	
	public Map<String, Object> signin(Map<String, Object> request) throws InvalidInputException, NotAuthorizedException {
		// Get and validate user
		User user = null;
		try {
			user = getAndValidateUser(request);
		} catch (InvalidInputException | NotAuthorizedException e) {
			throw e;
		} catch (Throwable t) {
			logger.error(t.getMessage());
			throw new NotAuthorizedException("Error authorizing user");
		}

		// Make and set account access token
		Claims accountClaims = new DefaultClaims();
		accountClaims.setSubject(user.getUsername());
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
			cloudClaims.put("cloudRole", creds.getCloudRole());
			cloudAccess.setCloudToken(DigitalPiglet.makeJWT(cloudClaims, JWT_TIMEOUT));
			cloudAccess.setCredentials(null);
		}
		
		@SuppressWarnings("unchecked")
		Map<String, Object> response = objectMapper.convertValue(user, Map.class);
		return response;
	}

	private User getAndValidateUser(Map<String, Object> request) throws InvalidInputException, NotAuthorizedException {
		String username = request.get("username").toString();
		String password = request.get("password").toString();
		if (Common.isNullOrEmpty(username) || Common.isNullOrEmpty(password)) {
			throw new InvalidInputException("Please submit a valid username and password");
		}
		User user = dynamo.load(User.class, username);
		if (user == null ) {
			throw new NotAuthorizedException("User not found or password not match");
		}
		String passFromDb = user.getPassword();
		if (!BCrypt.checkpw(password, passFromDb)) { 
			throw new NotAuthorizedException("User not found or password not match");
		}
		return user;
	}

}