package io.grokery.lab.api.cloud.context;

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

	public CloudContext(String auth) throws NotAuthorizedException {
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			init(claims);
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
	}

	public void init(Claims values) {
		this.cloudId = values.get("cloudId").toString();
		this.cloudType = values.get("cloudType").toString();
		this.daoType = values.get("daoType").toString();

		this.awsAccessKeyId = values.get("awsAccessKeyId").toString();
		this.awsSecretKey = values.get("awsSecretKey").toString();
		this.awsRegion = values.get("awsRegion").toString();
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
