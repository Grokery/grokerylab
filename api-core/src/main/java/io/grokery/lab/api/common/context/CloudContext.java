package io.grokery.lab.api.common.context;

import io.grokery.lab.api.common.DigitalPiglet;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.jsonwebtoken.Claims;

public class CloudContext {

	// Common
	public String cloudId = "";
	public String cloudType = "";
	public String daoType = "";

	// AWS
	public String awsAccessKeyId = "";
	public String awsSecretKey = "";
	public String awsRegion = "";

	//Azure
	public String apikey = "";


	public CloudContext() {}

	public CloudContext(String cloudId, String auth) throws NotAuthorizedException {
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			this.cloudId = claims.get("cloudId").toString();
			this.cloudType = claims.get("cloudType").toString();
			this.daoType = claims.get("daoType").toString();
			
			this.awsAccessKeyId = claims.get("awsAccessKeyId").toString();
			this.awsSecretKey = claims.get("awsSecretKey").toString();
			this.awsRegion = claims.get("awsRegion").toString();
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
		if (!this.cloudId.equals(cloudId)) {
			throw new NotAuthorizedException();
		}
	}

	public boolean equals(CloudContext other) {
		return this.cloudId.equals(other.cloudId) &&
			this.cloudType.equals(other.cloudType) &&
			this.daoType.equals(other.daoType) &&
			this.awsAccessKeyId.equals(other.awsAccessKeyId) &&
			this.awsSecretKey.equals(other.awsSecretKey) &&
			this.awsRegion.equals(other.awsRegion);
	}

}
