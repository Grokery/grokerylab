package io.grokery.lab.api.admin.models;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import io.grokery.lab.api.admin.models.submodels.UserRef;
import io.grokery.lab.api.common.CommonUtils;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

@DynamoDBTable(tableName = "grokery-api-clouds-{STAGE}")
public class Cloud implements Serializable {

	static final long serialVersionUID = 1L;


	public static final String hashKey = "CLOUD";
	private String cloudId;
    private String cloudType;
    private String name;
    private String title;
	private String description;
    private String url;
	private Map<String, UserRef> users;
	private String created;
	private String updated;
	private String status;
	private String jwtPrivateKey;

	public Cloud() {
		this.cloudId = UUID.randomUUID().toString();
		this.users = new HashMap<String, UserRef>();
		this.created = new DateTime(DateTimeZone.UTC).toString();
		this.updated = new DateTime(DateTimeZone.UTC).toString();
		this.status = "CREATING";
	}

	@DynamoDBHashKey
	public static String getHashKey() {
		return hashKey;
	}
	public void setHashKey(String hashKey) {
		// noop
	}

	@DynamoDBRangeKey
	public String getCloudId() {
		return cloudId;
	}
	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}

    @DynamoDBAttribute
	public String getCloudType() {
		return cloudType;
	}
	public void setCloudType(String cloudType) {
		this.cloudType = cloudType;
	}

    @DynamoDBIndexRangeKey(localSecondaryIndexName="name")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

    @DynamoDBAttribute
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}

    @DynamoDBAttribute
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

    @DynamoDBAttribute
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}

    @DynamoDBAttribute
	public Map<String, UserRef> getUsers() {
		return users;
	}
	public void setUsers(Map<String, UserRef> users) {
		this.users = users;
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
		return this.updated;
	}
	public void setUpdated(String updated) {
		this.updated = updated;
	}

	@DynamoDBAttribute
	public String getStatus() {
		return this.status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	@DynamoDBAttribute
	public String getJwtPrivateKey() {
		return this.jwtPrivateKey;
	}
	public void setJwtPrivateKey(String jwtPrivateKey) {
		this.jwtPrivateKey = jwtPrivateKey;
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
		if (CommonUtils.isNullOrEmpty(this.getCloudId())) {
			throw new InvalidInputException("CloudId is a required field");
		}
		if (CommonUtils.isNullOrEmpty(this.getCloudType())) {
			throw new InvalidInputException("CloudType is a required field");
		}
		if (CommonUtils.isNullOrEmpty(this.getName())) {
			throw new InvalidInputException("Name is a required field");
		}
		if (CommonUtils.isNullOrEmpty(this.getTitle())) {
			throw new InvalidInputException("Title is a required field");
		}
		if (this.getUsers() == null || getUsers().size() < 1) {
			throw new InvalidInputException("Cloud must have at least one user");
		}
	}

}
