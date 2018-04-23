package io.grokery.api.admin.models.submodels;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class CloudAccess implements Serializable {

	static final long serialVersionUID = 1L;

	private String cloudId;
	private String title;
	private CloudCredentials credentials;
	private List<CloudLink> links;

	// Not stored in DB
	private String cloudToken;
	
	public CloudAccess() {
		links = new ArrayList<CloudLink>();
	}
	
	@DynamoDBAttribute(attributeName = "cloudId")
	public String getCloudId() {
		return cloudId;
	}
	public void setCloudId(String id) {
		this.cloudId = id;
	}

	@DynamoDBAttribute(attributeName = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	// not stored in db
	public String getCloudToken() {
		return cloudToken;
	}
	public void setCloudToken(String cloudToken) {
		this.cloudToken = cloudToken;
	}
	
	@DynamoDBAttribute(attributeName = "credentials")
	public CloudCredentials getCredentials() {
		return credentials;
	}
	public void setCredentials(CloudCredentials credentials) {
		this.credentials = credentials;
	}
	
	@DynamoDBAttribute(attributeName = "links")
	public List<CloudLink> getLinks() {
		return links;
	}
	public void setLinks(List<CloudLink> links) {
		this.links = links;
	}

}
