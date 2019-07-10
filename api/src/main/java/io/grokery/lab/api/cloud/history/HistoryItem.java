package io.grokery.lab.api.cloud.history;

import java.util.Iterator;
import java.util.UUID;
import java.util.Map;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.history.comments.Comment;
import io.grokery.lab.api.cloud.history.jobruns.JobRun;

public class HistoryItem {

	private static final Logger LOG = LoggerFactory.getLogger(HistoryItem.class);

	private String itemId;
	private String itemType;
	private String created;
	private String updated;

	public HistoryItem() {
		this.initializeDefaults();
	}

	public static String getItemIdName() {
		return "itemId";
	}

	public static String getItemTypeName() {
		return "itemType";
	}

	protected void initializeDefaults() {
		this.itemId = UUID.randomUUID().toString();
		this.created = new DateTime(DateTimeZone.UTC).toString();
		this.updated = new DateTime(DateTimeZone.UTC).toString();
	}

	// Class methods
	public void setValues(JsonObj newData) {
		this.updated = new DateTime(DateTimeZone.UTC).toString();
	}

	public void validateValues() throws InvalidInputException {
		if (this.itemType == null || this.itemType.isEmpty()) {
			throw new InvalidInputException("Missing required field: '" + HistoryItem.getItemTypeName() + "'. Must be a valid ItemType");
		}
		if (this.itemId.toString().length() != 36) {
			throw new InvalidInputException("Missing or invalid required field: '" + HistoryItem.getItemIdName() + "'. Should be valid UUID string.");
		}
	}

	public JsonObj toJsonObj() {
		JsonObj result = MapperUtil.getInstance().convertValue(this, JsonObj.class);
		return removeNullValues(result);
	}

	private JsonObj removeNullValues(JsonObj obj) {
      for(Iterator<Map.Entry<String, Object>> it = obj.entrySet().iterator(); it.hasNext(); ) {
          Map.Entry<String, Object> entry = it.next();
          if(entry.getValue() == null) {
              it.remove();
          }
      }
      return obj;
	}

	public static HistoryItem fromJsonObj(JsonObj obj, CloudContext context) throws InvalidInputException {
        return HistoryItem.fromJsonObj(obj, HistoryItem.getClassInstance(obj));
    }

	public static HistoryItem fromJsonObj(JsonObj obj, HistoryItem toValueType) {
		return MapperUtil.getInstance().convertValue(obj, toValueType.getClass());
    }

    public static HistoryItem getClassInstance(JsonObj obj) throws InvalidInputException {
		try {
			String typeName = obj.getString(HistoryItem.getItemTypeName());
			LOG.info("Get class instance for itemType: " + typeName);
			ItemType itemType = ItemType.valueOf(typeName);
			switch (itemType) {
				case COMMENT:
					return Comment.getClassInstance(obj);
				case JOBRUN:
					return JobRun.getClassInstance(obj);
				default:
					throw new NotImplementedError();
			}
		} catch (IllegalArgumentException e) {
			String message = "Unknown ItemType";
			LOG.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "ItemType specification required";
			LOG.error(message, e);
			throw new InvalidInputException(message);
        }
	}

	// Getters and Setters
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	public String getItemType() {
		return itemType;
	}
	public void setItemType(String itemType) {
		this.itemType = itemType;
	}
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}
	public String getUpdated() {
		return updated;
	}
	public void setUpdated(String updated) {
		this.updated = updated;
	}

}
