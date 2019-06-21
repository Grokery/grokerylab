package io.grokery.lab.api.admin.models.submodels;

import java.io.Serializable;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class CloudLink implements Serializable{

	static final long serialVersionUID = 1L;

	private String title;
	private String url;
	
	@DynamoDBAttribute(attributeName = "title")
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	@DynamoDBAttribute(attributeName = "url")
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public boolean equals(Object obj) {
		 
        if (obj == this) {
            return true;
        }
 
        if (!(obj instanceof CloudLink)) {
            return false;
        }
         
        CloudLink other = (CloudLink) obj;
         
        return other.getUrl().equals(this.url) && other.getTitle().equals(this.title);
	}

}
