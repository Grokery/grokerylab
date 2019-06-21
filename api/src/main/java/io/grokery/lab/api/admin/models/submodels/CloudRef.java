package io.grokery.lab.api.admin.models.submodels;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class CloudRef implements Serializable {

	static final long serialVersionUID = 1L;

	private String cloudId;

	public CloudRef() {

	}

	public CloudRef(String cloudId) {
		this.cloudId = cloudId;
	}

	@DynamoDBAttribute(attributeName = "cloudId")
	public String getCloudId() {
		return cloudId;
	}

	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}

	@Override
	public boolean equals(Object obj) {
		 
        if (obj == this) {
            return true;
        }
 
        if (!(obj instanceof CloudRef)) {
            return false;
        }
         
        CloudRef other = (CloudRef) obj;
         
        return other.getCloudId().equals(this.cloudId);
	}

}
