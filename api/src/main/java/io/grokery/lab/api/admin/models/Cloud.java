package io.grokery.lab.api.admin.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.common.Common;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "grokery-api-clouds-{STAGE}")
public class Cloud implements Serializable {

	static final long serialVersionUID = 1L;

	private String cloudId;
	private String accountId;
    private String cloudType;
    private String name;
    private String title;
	private String description;
    private String url;
	private List<UserRef> users;
	
	public Cloud() {
		cloudId = UUID.randomUUID().toString();
		users = new ArrayList<UserRef>();
	}

	@DynamoDBHashKey(attributeName = "cloudId")
	public String getCloudId() {
		return cloudId;
	}

	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}

	@DynamoDBAttribute(attributeName = "accountId")
	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

    @DynamoDBAttribute(attributeName = "cloudType")
	public String getCloudType() {
		return cloudType;
	}

	public void setCloudType(String cloudType) {
		this.cloudType = cloudType;
	}

    @DynamoDBAttribute(attributeName = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

    @DynamoDBAttribute(attributeName = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

    @DynamoDBAttribute(attributeName = "description")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
    @DynamoDBAttribute(attributeName = "url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

    @DynamoDBAttribute(attributeName = "users")
	public List<UserRef> getUsers() {
		return users;
	}

	public void setUsers(List<UserRef> users) {
		this.users = users;
	}

	@Override
	public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof Cloud)) {
            return false;
        }
        Cloud other = (Cloud) obj;
        return other.getCloudId().equals(this.cloudId);
	}

	public void assertIsValidForCreate() throws InvalidInputException {
		if (Common.isNullOrEmpty(this.getCloudId())) {
			throw new InvalidInputException("CloudId is a required field");
		}
		if (Common.isNullOrEmpty(this.getAccountId())) {
			throw new InvalidInputException("AccountId is a required field");
		}
		if (Common.isNullOrEmpty(this.getCloudType())) {
			throw new InvalidInputException("CloudType is a required field");
		}
		if (Common.isNullOrEmpty(this.getName())) {
			throw new InvalidInputException("Name is a required field");
		}
		if (Common.isNullOrEmpty(this.getTitle())) {
			throw new InvalidInputException("Title is a required field");
		}
		if (Common.isNullOrEmpty(this.getUrl())) {
			throw new InvalidInputException("Url is a required field");
		}
		if (this.getUsers() == null || getUsers().size() < 1) {
			throw new InvalidInputException("Cloud must have at least one user");
		}
	}

}
