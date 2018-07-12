package io.grokery.lab.api.cloud.context;

import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.jsonwebtoken.Claims;

public class CloudContext {

	public String cloudType = "";
	public String daoType = "";
	public String dynamoTableName = "";
	public String s3BucketName = "";
	public String awsAccessKeyId = "";
	public String awsSecretKey = "";
	public String awsRegion = "";

	public CloudContext() {}

	public CloudContext(String auth) throws NotAuthorizedException {
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			init(claims);
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
	}

	public void init(Claims values) {
		this.cloudType = values.get("cloudType").toString();
		this.daoType = "DYNAMODB";
		this.dynamoTableName = "grokery-cloud-" + values.get("cloudName").toString();
		this.s3BucketName = "grokery-cloud-" + values.get("cloudName").toString();
		this.awsAccessKeyId = values.get("awsAccessKeyId").toString();
		this.awsSecretKey = values.get("awsSecretKey").toString();
		this.awsRegion = values.get("awsRegion").toString();
	}

	public boolean equals(CloudContext other) {
		if (this.cloudType.equals(other.cloudType) &&
			this.daoType.equals(other.daoType) &&
			this.s3BucketName.equals(other.s3BucketName) &&
			this.dynamoTableName.equals(other.dynamoTableName) &&
			this.awsAccessKeyId.equals(other.awsAccessKeyId) &&
			this.awsSecretKey.equals(other.awsSecretKey) &&
			this.awsRegion.equals(other.awsRegion))
		{
			return true;
		}
		return false;
	}

}
