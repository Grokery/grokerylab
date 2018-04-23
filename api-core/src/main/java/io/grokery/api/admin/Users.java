package io.grokery.api.admin;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import io.grokery.api.admin.models.submodels.CloudAccess;
import io.grokery.api.admin.models.Account;
import io.grokery.api.admin.models.User;
import io.grokery.api.admin.models.submodels.UserRef;
import io.grokery.api.common.DigitalPiglet;
import io.grokery.api.common.errors.NotImplementedError;
import io.grokery.api.common.exceptions.InvalidInputException;
import io.grokery.api.common.exceptions.NotAuthorizedException;
import io.grokery.api.common.exceptions.NotFoundException;

import io.jsonwebtoken.Claims;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.bcrypt.BCrypt;

public class Users extends BaseController {

	private static final Logger logger = LogManager.getLogger(Users.class);
	private static volatile Users instance;
	
	public static Users getInstance() {
        synchronized (Users.class) {
            if (instance == null) {
                instance = new Users();
            }
        }
        return instance;
    }
	
	public Map<String, Object> create(String auth, Map<String, Object> requestBody) throws Exception {

		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			if (!claims.getSubject().equals("chmod740@gmail.com")) {
				if (!claims.get("accountId").toString().equals(requestBody.get("accountId").toString())) {
					throw new NotAuthorizedException("Invalid accountId");
				}
			}
			if (!claims.get("accountRole").toString().equals("admin")) {
				throw new NotAuthorizedException("Admin role required to create new user");
			}
		} catch (NotAuthorizedException e) {
			throw e;
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
		
		User user = objectMapper.convertValue(requestBody, User.class);
		user.assertIsValidForCreate();
		
		if (dynamo.load(User.class, user.getUsername()) != null) {
			throw new InvalidInputException("Invalid username");
		}

		Account account = dynamo.load(Account.class, user.getAccountId());
		if (account == null) {
			throw new InvalidInputException("Invalid accountId");
		}
		account.getUsers().add(new UserRef(user.getUsername()));
		
		// Hash password
		// TODO handle salt generation properly
		user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12)));
		
		// Save and verify
		dynamo.save(user);
		dynamo.save(account);

        User created = dynamo.load(User.class, user.getUsername());
		if (created == null) {
			throw new Error("Error creating user");
		}

		// Redact password hash and piglets
		created = redact(created);

		// Map and return
		@SuppressWarnings("unchecked")
		Map<String, Object> response = objectMapper.convertValue(created, Map.class);
		return response;
	}
	
	public Map<String, Object> retrieve(String auth, String username) throws NotFoundException, NotAuthorizedException {

		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			if (!claims.getSubject().equals(username)) {
				throw new NotAuthorizedException();
			}
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}

		User user = dynamo.load(User.class, username);
		if (user == null) {
			throw new NotFoundException();
		}

		user = redact(user);

		@SuppressWarnings("unchecked")
		Map<String, Object> response = objectMapper.convertValue(user, Map.class);
		return response;
	}

	public Map<String, Object> update(String auth, String username, Map<String, Object> requestBody) {
		// TODO check that user name not changing and/or handle
		// TODO check if password updating and handle (update cloud credential)
		throw new NotImplementedError();
	}
	
	public Map<String, Object> delete(String auth, String username) {
		throw new NotImplementedError();
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
