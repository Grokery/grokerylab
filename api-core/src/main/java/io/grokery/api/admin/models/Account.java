package io.grokery.api.admin.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import io.grokery.api.admin.models.submodels.CloudRef;
import io.grokery.api.admin.models.submodels.UserRef;
import io.grokery.api.common.exceptions.InvalidInputException;

import org.apache.logging.log4j.util.Strings;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "grokery-api-accounts-{STAGE}")
public class Account implements Serializable {

	static final long serialVersionUID = 1L;

	private String accountId;
    private String type;
    private List<UserRef> users;
    private List<CloudRef> clouds;
    
	public Account() {
		accountId = UUID.randomUUID().toString();
		type = "basic";
        users = new ArrayList<UserRef>();
        clouds = new ArrayList<CloudRef>();
	}

	@DynamoDBHashKey(attributeName = "accountId")
	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

    @DynamoDBAttribute(attributeName = "type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

    @DynamoDBAttribute(attributeName = "users")
	public List<UserRef> getUsers() {
		return users;
	}

	public void setUsers(List<UserRef> users) {
		this.users = users;
	}

    @DynamoDBAttribute(attributeName = "clouds")
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
		if (!Strings.isNotEmpty(this.getAccountId())) {
			throw new InvalidInputException("AccountId is a required field");
		}
		if (!Strings.isNotEmpty(this.getType())) {
			throw new InvalidInputException("Type is a required field");
		}
	}
}
