package io.grokery.lab.api.admin.models.submodels;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class UserRef implements Serializable {

	static final long serialVersionUID = 1L;

	private String userId;
	private String cloudRole;

	public UserRef() {

	}

	public UserRef(String userId) {
		this.userId = userId;
	}

	public UserRef(String userId, String cloudRole) {
		this.userId = userId;
		this.cloudRole = cloudRole;
	}
	
	@DynamoDBAttribute
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@DynamoDBAttribute
	public String getCloudRole() {
		return cloudRole;
	}

	public void setCloudRole(String cloudRole) {
		this.cloudRole = cloudRole;
	}

	@Override
	public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof UserRef)) {
            return false;
        }
        UserRef other = (UserRef) obj;
        return other.getUserId().equals(this.userId);
	}

}
