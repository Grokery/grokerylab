package io.grokery.lab.api.admin.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import io.grokery.lab.api.admin.models.submodels.CloudRef;
import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.common.CommonUtils;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "grokery-api-accounts-{STAGE}")
public class Account implements Serializable {

	static final long serialVersionUID = 1L;

	public static final String hashKey = "ACCOUNT";
	private String accountId;
	private String accountType;
    private List<UserRef> users;
    private List<CloudRef> clouds;
    
	public Account() {
		accountId = UUID.randomUUID().toString();	
		accountType = "BASIC";
        users = new ArrayList<UserRef>();
        clouds = new ArrayList<CloudRef>();
	}

	@DynamoDBHashKey
	public static String getHashKey() {
		return hashKey;
	}
	public void setHashKey(String hashKey) {
		
	}

	@DynamoDBRangeKey
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	@DynamoDBIndexRangeKey(localSecondaryIndexName="accountType")
	public String getAccountType() {
		return accountType;
	}
	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

    @DynamoDBAttribute
	public List<UserRef> getUsers() {
		return users;
	}
	public void setUsers(List<UserRef> users) {
		this.users = users;
	}

    @DynamoDBAttribute
	public List<CloudRef> getClouds() {
		return clouds;
	}
	public void setClouds(List<CloudRef> clouds) {
		this.clouds = clouds;
	}

	@Override
	public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof Account)) {
            return false;
        }
        Account other = (Account) obj;
        return other.getAccountId().equals(this.accountId);
	}

	public void assertIsValidForCreate() throws InvalidInputException {
		if (CommonUtils.isNullOrEmpty(this.getAccountId())) {
			throw new InvalidInputException("AccountId is a required field");
		}
		if (this.getAccountType() == null) {
			throw new InvalidInputException("Type is a required field");
		}
	}

}
