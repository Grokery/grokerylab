package io.grokery.lab.api.admin.models.submodels;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class UserRef implements Serializable {

	static final long serialVersionUID = 1L;

	private String userId;
	private String name;

	public UserRef() {

	}

	public UserRef(String userId) {
		this.userId = userId;
	}

	public UserRef(String userId, String name) {
		this.userId = userId;
		this.name = name;
	}
	
	@DynamoDBAttribute
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@DynamoDBAttribute
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
