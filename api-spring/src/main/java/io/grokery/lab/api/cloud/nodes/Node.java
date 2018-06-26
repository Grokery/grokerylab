package io.grokery.lab.api.cloud.nodes;

import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.cloud.nodes.jobs.Job;
import io.grokery.lab.api.cloud.nodes.sources.Datasource;

public class Node {

	private static final Logger LOGGER = LoggerFactory.getLogger(Node.class);

	private String cloudId;
	private NodeType nodeType;
	private UUID nodeId;
	private String title;
	private String description;

	private Double x;
	private Double y;
	private List<Map<String, Object>> upstream;
	private List<Map<String, Object>> downstream;

	public static String getCloudIdName() {
		return "cloudId";
	}

	public static String getNodeTypeName() {
		return "nodeType";
	}

	public static String getNodeIdName() {
		return "nodeId";
	}

	public Node() {
		this.nodeType = NodeType.NODE;
		this.nodeId = UUID.randomUUID();
	}

	protected Node(NodeType nodeType) {
		this.nodeType = nodeType;
		this.nodeId = UUID.randomUUID();
	}

	public void initialize() {}

	public void transitionTo(Node other) {}

	public void transitionFrom(Node other) {}

	public void decomission() {}

	public void validate() throws InvalidInputException {
		if (this.nodeType == null) {
			throw new InvalidInputException("Missing required field: '"+Node.getNodeTypeName()+"'. Must be a valid IAPIResourceType");
		}
		if (this.nodeId.toString().length() != 36) {
			throw new InvalidInputException("Missing or invalid required field: '"+Node.getNodeIdName()+"'. Should be valid UUID string.");
		}
	}

	@SuppressWarnings("unchecked")
	public static Map<String, Object> toMap(Node obj, Boolean removeNulls) {
		Map<String, Object> result = MapperUtil.getInstance().convertValue(obj, Map.class);
		if (removeNulls == true) {
			return Node.RemoveNullValues(result);
		} else {
			return result;
		}
    }

	public static Map<String, Object> RemoveNullValues(Map<String, Object> obj) {
      for(Iterator<Map.Entry<String, Object>> it = obj.entrySet().iterator(); it.hasNext(); ) {
          Map.Entry<String, Object> entry = it.next();
          if(entry.getValue() == null) {
              it.remove();
          }
      }
      return obj;
	}

	public static Node fromMap(Map<String, Object> obj) throws InvalidInputException {
        return Node.fromMap(obj, Node.getClassInstance(obj));
    }

	public static Node fromMap(Map<String, Object> obj, Node toValueType) {
		return MapperUtil.getInstance().convertValue(obj, toValueType.getClass());
    }

    public static Node getClassInstance(Map<String, Object> obj) throws InvalidInputException {
		try {
			String typeName = obj.get(Node.getNodeTypeName()).toString();
			LOGGER.info("Get class instance for nodeType=" + typeName);
			NodeType nodeType = NodeType.valueOf(typeName);
			switch (nodeType) {
				case NODE:
					return new Node();
				case CHART:
					return new Node();
				case DASHBOARD:
					return new Node();
				case JOB:
					return Job.getClassInstance(obj);
				case DATASOURCE:
					return Datasource.getClassInstance(obj);
				default:
					throw new NotImplementedError();
			}
		} catch (IllegalArgumentException e) {
			String message = "Unknown ResourceTypes";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "ResourceTypes specification required";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
        }
	}

	public String getCloudId() {
		return cloudId;
	}
	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}
	public NodeType getNodeType() {
		return nodeType;
	}
	public void setNodeType(NodeType nodeType) {
		this.nodeType = nodeType;
	}
	public UUID getNodeId() {
		return nodeId;
	}
	public void setNodeId(UUID nodeId) {
		this.nodeId = nodeId;
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
