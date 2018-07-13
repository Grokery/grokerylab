package io.grokery.lab.api.cloud.nodes;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
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
import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.cloud.nodes.jobs.Job;
import io.grokery.lab.api.cloud.nodes.sources.Datasource;

public class Node {

	private static final Logger LOGGER = LoggerFactory.getLogger(Node.class);

	private String nodeId;
	private String nodeType;
	private String subType;
	private String created;
	private String updated;

	private String title;
	private String description;
	private Double x;
	private Double y;
	private List<Map<String, Object>> upstream;
	private List<Map<String, Object>> downstream;

	public static String getNodeIdName() {
		return "nodeId";
	}

	public static String getNodeTypeName() {
		return "nodeType";
	}

	public static String getNodeSubTypeName() {
		return "subType";
	}

	// Constructers
	public Node() {
		this.initializeDefaults();
	}

	protected Node(NodeType nodeType) {
		this.initializeDefaults();
		this.nodeType = nodeType.toString();
	}

	private void initializeDefaults() {
		this.nodeId = UUID.randomUUID().toString();
		this.nodeType = "";
		this.subType = "";
		this.created = new DateTime(DateTimeZone.UTC).toString();
		this.updated = new DateTime(DateTimeZone.UTC).toString();

		this.title = "New Node";
		this.description = "Default description.";
		this.x = new Double(0);
		this.y = new Double(0);
		this.upstream = new ArrayList<>();
		this.downstream = new ArrayList<>();
	}

	// Class methods
	@SuppressWarnings("unchecked")
	public void setValues(JsonObj newData) {
		this.updated = new DateTime(DateTimeZone.UTC).toString();

		this.title = newData.get("title") != null ? newData.getString("title") : this.title;
		this.description = newData.get("description") != null ? newData.getString("description") : this.description;
		this.x = newData.get("x") != null ? new Double(newData.get("x").toString()) : this.x;
		this.y = newData.get("y") != null ? new Double(newData.get("y").toString()) : this.y;
		this.upstream = newData.get("upstream") != null ? MapperUtil.getInstance().convertValue(newData.get("upstream"), ArrayList.class) : this.upstream;
		this.downstream = newData.get("downstream") != null ? MapperUtil.getInstance().convertValue(newData.get("downstream"), ArrayList.class) : this.downstream;
	}

	public void validateValues() throws InvalidInputException {
		if (this.nodeType == null || this.nodeType.isEmpty()) {
			throw new InvalidInputException("Missing required field: '" + Node.getNodeTypeName() + "'. Must be a valid NodeType");
		}
		if (this.nodeId.toString().length() != 36) {
			throw new InvalidInputException("Missing or invalid required field: '" + Node.getNodeIdName() + "'. Should be valid UUID string.");
		}
	}

	public void setupExternalResources(CloudContext context) {

	}

	public void updateExternalResources(CloudContext context, JsonObj data) {

	}

	public void cleanupExternalResources(CloudContext context) {

	}

	public static JsonObj toMap(Node obj, Boolean removeNulls) {
		JsonObj result = MapperUtil.getInstance().convertValue(obj, JsonObj.class);
		if (removeNulls == true) {
			return Node.RemoveNullValues(result);
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

	public static Node fromMap(JsonObj obj, CloudContext context) throws InvalidInputException {
        return Node.fromMap(obj, Node.getClassInstance(obj, context));
    }

	public static Node fromMap(JsonObj obj, Node toValueType) {
		return MapperUtil.getInstance().convertValue(obj, toValueType.getClass());
    }

    public static Node getClassInstance(JsonObj obj, CloudContext context) throws InvalidInputException {
		try {
			String typeName = obj.getString(Node.getNodeTypeName());
			LOGGER.info("Get class instance for nodeType: " + typeName);
			NodeType nodeType = NodeType.valueOf(typeName);
			switch (nodeType) {
				case JOB:
					return Job.getClassInstance(obj, context);
				case DATASOURCE:
					return Datasource.getClassInstance(obj, context);
				default:
					throw new NotImplementedError();
			}
		} catch (IllegalArgumentException e) {
			String message = "Unknown NodeType";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "NodeType specification required";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
        }
	}

	// Getters and Setters
	public String getNodeId() {
		return nodeId;
	}
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
	public String getNodeType() {
		return nodeType;
	}
	public void setNodeType(NodeType nodeType) {
		this.nodeType = nodeType.toString();
	}
	public String getSubType() {
		return subType;
	}
	public void setSubType(String subType) {
		this.subType = subType;
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

	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Double getX() {
		return x;
	}
	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return y;
	}
	public void setY(Double y) {
		this.y = y;
	}
	public List<Map<String, Object>> getUpstream() {
		return this.upstream;
	}
	public void setUpstream(List<Map<String, Object>> upstream) {
		this.upstream = upstream;
	}
	public List<Map<String, Object>> getDownstream() {
		return this.downstream;
	}
	public void setDownstream(List<Map<String, Object>> downstream) {
		this.downstream = downstream;
	}

}
