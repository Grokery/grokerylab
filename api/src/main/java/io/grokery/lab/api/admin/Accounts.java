package io.grokery.lab.api.admin;

import java.util.Map;

import io.grokery.lab.api.admin.models.Account;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Accounts extends BaseController {

	private static final Logger logger = LoggerFactory.getLogger(Accounts.class);
	private static volatile Accounts instance;
	
	public static Accounts getInstance() {
        synchronized (Accounts.class) {
            if (instance == null) {
                instance = new Accounts();
            }
        }
        return instance;
    }
	
	public Map<String, Object> create(String auth, Map<String, Object> requestBody) throws Exception {

		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			if (!claims.getSubject().equals("chmod740@gmail.com")) {
				throw new NotAuthorizedException();
			}
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
		
		// Get account info and validate fields 
		Account account = objectMapper.convertValue(requestBody, Account.class);
		account.assertIsValidForCreate();
		
		// Save and verify
		dynamo.save(account);
        Account created = dynamo.load(Account.class, account.getAccountId());
		if (created == null) {
			throw new Error("Error creating account");
		}

		// Map and return
		@SuppressWarnings("unchecked")
		Map<String, Object> response = objectMapper.convertValue(created, Map.class);
		return response;
	}

	public Map<String, Object> retrieve(String auth, String username) throws NotFoundException, NotAuthorizedException {
		throw new NotImplementedError();
	}
	
	public Map<String, Object> update(String auth, String username, Map<String, Object> requestBody) {
		throw new NotImplementedError();
	}
	
	public Map<String, Object> delete(String auth, String username) {
		throw new NotImplementedError();
	}

}
