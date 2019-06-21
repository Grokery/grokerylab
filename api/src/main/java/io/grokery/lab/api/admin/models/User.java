package io.grokery.lab.api.admin.models;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import io.grokery.lab.api.admin.models.submodels.CloudAccess;
import io.grokery.lab.api.common.CommonUtils;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

@DynamoDBTable(tableName = "grokery-api-users-{STAGE}")
public class User implements Serializable {

	static final long serialVersionUID = 1L;

	public static final String hashKey = "USER";
	private String userId;
	private String userType;
	private String username;
	private String password;
	private String name;
	private String accountRole;
	private Map<String, CloudAccess> clouds;
	private String created;
	private String updated;

	// Not stored in DB
	private String accountToken;

	public User() {
		this.userId = UUID.randomUUID().toString();
		this.userType = "USER";
		this.clouds = new HashMap<String, CloudAccess>();
		this.created = new DateTime(DateTimeZone.UTC).toString();
		this.updated = new DateTime(DateTimeZone.UTC).toString();
	}

	@DynamoDBHashKey
	public static String getHashKey() {
		return hashKey;
	}
	public void setHashKey(String hashKey) {
		// noop
	}

	@DynamoDBRangeKey
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}

	@DynamoDBIndexRangeKey(localSecondaryIndexName="userType")
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}

	@DynamoDBIndexRangeKey(localSecondaryIndexName="username")
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}

	@DynamoDBAttribute
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	@DynamoDBAttribute
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	@DynamoDBAttribute
	public String getAccountRole() {
		return accountRole;
	}
	public void setAccountRole(String accountRole) {
		this.accountRole = accountRole;
	}

	@DynamoDBAttribute
	public Map<String, CloudAccess> getClouds() {
		return clouds;
	}
	public void setClouds(Map<String, CloudAccess> clouds) {
		this.clouds = clouds;
	}

	@DynamoDBAttribute
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}

	@DynamoDBAttribute
	public String getUpdated() {
		return updated;
	}
	public void setUpdated(String updated) {
		this.updated = updated;
	}

	// Not stored in db
	public String getAccountToken() {
		return accountToken;
	}
	public void setAccountToken(String accountToken) {
		this.accountToken = accountToken;
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
		if (CommonUtils.isNullOrEmpty(this.getUsername())) {
			throw new InvalidInputException("Username is a required field");
		}
		if (CommonUtils.isNullOrEmpty(this.getPassword())) {
			throw new InvalidInputException("Password is a required field");
		}
		if (CommonUtils.isNullOrEmpty(this.getName())) {
			throw new InvalidInputException("Name is a required field");
		}
		if (this.getAccountRole() == null) {
			throw new InvalidInputException("AccountRole is a required field");
		}
	}

}
