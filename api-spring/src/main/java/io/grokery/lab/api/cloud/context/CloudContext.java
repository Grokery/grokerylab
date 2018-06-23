package io.grokery.lab.api.cloud.context;

import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.jsonwebtoken.Claims;
import java.util.Map;

public class CloudContext {

	public String daoType = "";
	public String dynamoTableName = "";
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

	public void init(Map<String, Object> values) {
		this.daoType = "DYNAMODB";
		this.dynamoTableName = "grokery-cloud-" + values.get("cloudName").toString();
		this.awsAccessKeyId = values.get("awsAccessKeyId").toString();
		this.awsSecretKey = values.get("awsSecretKey").toString();
		this.awsRegion = values.get("awsRegion").toString();
	}

	public boolean equals(CloudContext other) {
		if (this.daoType.equals(other.daoType) &&
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
