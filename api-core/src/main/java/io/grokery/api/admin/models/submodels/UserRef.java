package io.grokery.api.admin.models.submodels;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class UserRef implements Serializable {

	static final long serialVersionUID = 1L;

	private String username;
	private String name;

	public UserRef() {

	}

	public UserRef(String username) {
		this.username = username;
	}

	public UserRef(String username, String name) {
		this.username = username;
		this.name = name;
	}
	
	@DynamoDBAttribute(attributeName = "username")
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@DynamoDBAttribute(attributeName = "name")
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
        return other.getUsername().equals(this.username);
	}

}
