package io.grokery.lab.api.admin.models.submodels;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

@DynamoDBDocument
public class CloudAccess implements Serializable {

	static final long serialVersionUID = 1L;

	private String cloudId;
	private CloudCredentials credentials;
	private List<CloudLink> links;
	private Double sortRank;
	private String created;
	private String updated;

	// Not stored in DB
	private Map<String, Object> cloudInfo;
	private String cloudToken;

	public CloudAccess() {
		this.links = new ArrayList<CloudLink>();
		this.sortRank = 0.0;
		this.created = new DateTime(DateTimeZone.UTC).toString();
		this.updated = new DateTime(DateTimeZone.UTC).toString();
	}

	@DynamoDBAttribute(attributeName = "cloudId")
	public String getCloudId() {
		return cloudId;
	}
	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
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

	@DynamoDBAttribute
	public Double getSortRank() {
		return sortRank;
	}
	public void setSortRank(Double sortRank) {
		this.sortRank = sortRank;
	}

	@DynamoDBAttribute
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}

	@DynamoDBAttribute
	public String getUpdated() {
		return updated;
	}
	public void setUpdated(String updated) {
		this.updated = updated;
	}

	// not stored in db
	public String getCloudToken() {
		return cloudToken;
	}
	public void setCloudToken(String cloudToken) {
		this.cloudToken = cloudToken;
	}

	public Map<String, Object> getCloudInfo() {
		return cloudInfo;
	}
	public void setCloudInfo(Map<String, Object> cloudInfo) {
		this.cloudInfo = cloudInfo;
	}

}
