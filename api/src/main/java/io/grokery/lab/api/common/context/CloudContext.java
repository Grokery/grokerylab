package io.grokery.lab.api.common.context;

import io.grokery.lab.api.common.CommonUtils;
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
			
			if (claims.containsKey("awsAccessKeyId")) {
				this.awsAccessKeyId = claims.get("awsAccessKeyId").toString();
			}
			else if (CommonUtils.getOptionalEnv("API_HOST_AWS_ACCESS_KEY_ID", null) != null) {
				this.awsAccessKeyId = CommonUtils.getOptionalEnv("API_HOST_AWS_ACCESS_KEY_ID", null);
			}

			if (claims.containsKey("awsSecretKey")) {
				this.awsSecretKey = claims.get("awsSecretKey").toString();
			}
			else if (CommonUtils.getOptionalEnv("API_HOST_AWS_SECRET_KEY", null) != null) {
				this.awsSecretKey = CommonUtils.getOptionalEnv("API_HOST_AWS_SECRET_KEY", null);
			}

			if (claims.containsKey("awsRegion")) {
				this.awsRegion = claims.get("awsRegion").toString();
			}
			else if (CommonUtils.getOptionalEnv("API_HOST_AWS_REGION", null) != null) {
				this.awsRegion = CommonUtils.getOptionalEnv("API_HOST_AWS_REGION", null);
			}

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
