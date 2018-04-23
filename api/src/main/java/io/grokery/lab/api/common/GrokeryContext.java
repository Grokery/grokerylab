package io.grokery.lab.api.common;

import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.jsonwebtoken.Claims;
import java.util.Map;

public class GrokeryContext {

	public String daoType = "";
	
	public String dynamoDbLocalEndpoint = "";
	public String dynamoTableName = "";
	
	public String awsAccessKeyId = "";
	public String awsSecretKey = "";
	public String awsRegion = "";
	
	public String mongoDbHost = "";
	public String mongoDbName = "";
	public String mongoDbPort = "";
	public String mongoDbUser = "";
	public String mongoDbPass = "";

	public GrokeryContext() {

	}

	public GrokeryContext(String auth) throws NotAuthorizedException {
		try {
			Claims claims = DigitalPiglet.parseJWT(auth);
			init(claims);
		} catch (Throwable e) {
			throw new NotAuthorizedException();
		}
	}

	public void init(Map<String, Object> values) {
		// TODO get values from input values obj
		this.daoType = "DYNAMODB";
		this.dynamoTableName = "grokerylab-resources";
		this.awsAccessKeyId = values.get("awsAccessKeyId").toString();
		this.awsSecretKey = values.get("awsSecretKey").toString();
		this.awsRegion = "US_WEST_2";
	}
	
	public boolean equals(GrokeryContext other) {
		if (this.daoType.equals(other.daoType) && 
			this.dynamoDbLocalEndpoint.equals(other.dynamoDbLocalEndpoint) && 
			this.dynamoTableName.equals(other.dynamoTableName) &&
			this.awsAccessKeyId.equals(other.awsAccessKeyId) && 
			this.awsSecretKey.equals(other.awsSecretKey) &&
			this.awsRegion.equals(other.awsRegion) && 
			this.mongoDbHost.equals(other.mongoDbHost) && 
			this.mongoDbName.equals(other.mongoDbName) &&
			this.mongoDbPort.equals(other.mongoDbPort) && 
			this.mongoDbUser.equals(other.mongoDbUser) && 
			this.mongoDbPass.equals(other.mongoDbPass)) {
			return true;
		}
		return false;
	}
	
}
