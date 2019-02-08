package io.grokery.lab.api.cloud.comments;

import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class Comment {

	private static final Logger LOG = LoggerFactory.getLogger(Comment.class);

	private String nodeId;
	private String commentId;
	private String created;
	private String updated;
	private String userContact;
	private String userName;
	private String message;
	private JsonObj args;

	public Comment() {
		this.initializeDefaults();
	}

	private void initializeDefaults() {
		this.setCommentId(UUID.randomUUID().toString());
		this.setCreated(new DateTime(DateTimeZone.UTC).toString());
		this.setUpdated(this.getCreated());
	}

	public static JsonObj toJsonObj(Comment obj, Boolean removeNulls) {
		JsonObj result = MapperUtil.getInstance().convertValue(obj, JsonObj.class);
		if (removeNulls == true) {
			return Comment.RemoveNullValues(result);
		} else {
			return result;
		}
    }

	public static JsonObj RemoveNullValues(JsonObj obj) {
      for(Iterator<Map.Entry<String, Object>> it = obj.entrySet().iterator(); it.hasNext(); ) {
          Map.Entry<String, Object> entry = it.next();
          if(entry.getValue() == null) {
              it.remove();
          }
      }
      return obj;
	}

	public static Comment fromMap(JsonObj obj, CloudContext context) throws InvalidInputException {
		return Comment.fromMap(obj, Comment.getClassInstance(obj, context));
	}

	public static Comment fromMap(JsonObj obj, Comment toValueType) {
		return MapperUtil.getInstance().convertValue(obj, toValueType.getClass());
	}

	public static Comment getClassInstance(JsonObj obj, CloudContext context) throws InvalidInputException {
		return new Comment();
	}

	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the args
	 */
	public JsonObj getArgs() {
		return args;
	}

	/**
	 * @param args the args to set
	 */
	public void setArgs(JsonObj args) {
		this.args = args;
	}

	/**
	 * @return the userContact
	 */
	public String getUserContact() {
		return userContact;
	}

	/**
	 * @param userContact the userContact to set
	 */
	public void setUserContact(String userContact) {
		this.userContact = userContact;
	}

	/**
	 * @return the updated
	 */
	public String getUpdated() {
		return updated;
	}

	/**
	 * @param updated the updated to set
	 */
	public void setUpdated(String updated) {
		this.updated = updated;
	}

	/**
	 * @return the created
	 */
	public String getCreated() {
		return created;
	}

	/**
	 * @param created the created to set
	 */
	public void setCreated(String created) {
		this.created = created;
	}

	/**
	 * @return the commentId
	 */
	public String getCommentId() {
		return commentId;
	}

	/**
	 * @param commentId the commentId to set
	 */
	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}

	/**
	 * @return the nodeId
	 */
	public String getNodeId() {
		return nodeId;
	}

	/**
	 * @param nodeId the nodeId to set
	 */
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

}
