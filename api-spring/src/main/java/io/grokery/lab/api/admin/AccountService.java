package io.grokery.lab.api.admin;

import java.util.Map;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedQueryList;

import io.grokery.lab.api.admin.models.Account;
import io.grokery.lab.api.admin.types.AccountRole;
import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AccountService extends ServiceBaseClass {

	private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
	private static volatile AccountService instance;

	public AccountService () {
		super(Account.class);
	}
	
	public static AccountService getInstance() {
        synchronized (AccountService.class) {
            if (instance == null) {
                instance = new AccountService();
            }
        }
        return instance;
    }
	
	public Map<String, Object> create(String auth, Map<String, Object> requestBody) throws Exception {

		if (auth == null) {
			// allow create superadmin account during system initialization
			Map<String, Object> checkResult = validateSuperAdminAccountInitialization(requestBody);
			if (checkResult != null) {
				logger.info("Returning super admin account for super admin user creation");
				return checkResult;
			}
			logger.info("Creating super admin user account");
		} else {
			try {
				Claims claims = DigitalPiglet.parseJWT(auth);
				if (AccountRole.valueOf(claims.get("accountRole").toString()) != AccountRole.SUPERADMIN) {
					throw new NotAuthorizedException("SuperAdmin role required to create new account");
				}
			} catch (Throwable e) {
				throw new NotAuthorizedException();
			}
		}
		
		// Get account info and validate fields 
		Account account = objectMapper.convertValue(requestBody, Account.class);
		account.assertIsValidForCreate();
		
		// Save and verify
		dynamo.save(account);
        Account created = dynamo.load(Account.class, Account.hashKey, account.getAccountId());
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

	private Map<String, Object> validateSuperAdminAccountInitialization(Map<String, Object> requestBody) throws NotAuthorizedException {
		Account acct = new Account();
		acct.setAccountType("ACCOUNT");
		PaginatedQueryList<Account> results = dynamo.query(Account.class, new DynamoDBQueryExpression<Account>().withHashKeyValues(acct));
		if (results.size() == 0) {
			return null;
		} 
		if (results.size() == 1) {
			acct = results.get(0);
			if (acct.getUsers().size() == 0) {
				@SuppressWarnings("unchecked")
				Map<String, Object> response = objectMapper.convertValue(acct, Map.class);
				return response;
			}
		}
		throw new NotAuthorizedException("SuperAdmin user/account may only be created during system initialization");		
	}

}
