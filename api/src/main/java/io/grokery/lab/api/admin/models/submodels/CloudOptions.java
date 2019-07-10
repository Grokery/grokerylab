package io.grokery.lab.api.admin.models.submodels;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class CloudOptions implements Serializable {

	static final long serialVersionUID = 1L;
	
	private String awsAccessKeyId;
	private String awsSecretKey;
	private String awsRegion;
	
	@DynamoDBAttribute(attributeName = "awsAccessKeyId")
	public String getAwsAccessKeyId() {
		return awsAccessKeyId;
	}
	public void setAwsAccessKeyId(String awsAccessKeyId) {
		this.awsAccessKeyId = awsAccessKeyId;
	}
	
	@DynamoDBAttribute(attributeName = "awsSecretKey")
	public String getAwsSecretKey() {
		return awsSecretKey;
	}
	public void setAwsSecretKey(String awsSecretKey) {
		this.awsSecretKey = awsSecretKey;
	}

	@DynamoDBAttribute(attributeName = "awsRegion")
	public String getAwsRegion() {
		return awsRegion;
	}

	public void setAwsRegion(String awsRegion) {
		this.awsRegion = awsRegion;
	}

}
