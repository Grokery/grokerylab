package io.grokery.lab.api.admin.models;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.common.Common;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "grokery-api-users-{STAGE}")
public class User implements Serializable {

	static final long serialVersionUID = 1L;

	private String username;
	private String password;
	private String name;
	private String accountId;
	private String accountRole;
	private Map<String, CloudAccess> clouds;

	// Not stored in DB
	private String accountToken;
	
	public User() {
		clouds = new HashMap<String, CloudAccess>();
	}

	@DynamoDBHashKey(attributeName = "username")
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@DynamoDBAttribute(attributeName = "password")
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@DynamoDBAttribute(attributeName = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@DynamoDBAttribute(attributeName = "accountId")
	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	@DynamoDBAttribute(attributeName = "accountRole")
	public String getAccountRole() {
		return accountRole;
	}

	public void setAccountRole(String accountRole) {
		this.accountRole = accountRole;
	}

	// not stored in db
	public String getAccountToken() {
		return accountToken;
	}
	
	public void setAccountToken(String accountToken) {
		this.accountToken = accountToken;
	}

	@DynamoDBAttribute(attributeName = "clouds")
	public Map<String, CloudAccess> getClouds() {
		return clouds;
	}

	public void setClouds(Map<String, CloudAccess> clouds) {
		this.clouds = clouds;
	}

	@Override
	public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof User)) {
            return false;
        }
        User other = (User) obj;
        return other.getUsername().equals(this.username);
	}

	public void assertIsValidForCreate() throws InvalidInputException {
		if (Common.isNullOrEmpty(this.getUsername())) {
			throw new InvalidInputException("Username is a required field");
		}
		if (Common.isNullOrEmpty(this.getPassword())) {
			throw new InvalidInputException("Password is a required field");
		}
		if (Common.isNullOrEmpty(this.getName())) {
			throw new InvalidInputException("Name is a required field");
		}
		if (Common.isNullOrEmpty(this.getAccountId())) {
			throw new InvalidInputException("AccountId is a required field");
		}
		if (Common.isNullOrEmpty(this.getAccountRole())) {
			throw new InvalidInputException("AccountRole is a required field");
		}
	}

}