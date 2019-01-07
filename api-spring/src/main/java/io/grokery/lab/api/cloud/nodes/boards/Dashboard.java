package io.grokery.lab.api.cloud.nodes.boards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;

/**
 * Contains the fields and logic common to all Dashboard types
 *
 * @author hogue
 */
public class Dashboard extends Node {

	private static final Logger LOG = LoggerFactory.getLogger(Dashboard.class);

	private String publicUrl;
	private String source;

	public Dashboard() {
		this.initializeDefaults();
	}

    protected void initializeDefaults() {
		super.initializeDefaults();
		
		this.setNodeType(NodeType.BOARD.toString());
		this.setSubType(BoardType.GENERIC.toString());
		this.source = new StringBuilder()
		.append("<head>")
		.append("</head>")
		.append("<body>")
		.append("</body>")
		.toString();
	}

	// Inherited class methods
	public void setValues(JsonObj newData) {
		super.setValues(newData);

		this.publicUrl = newData.get("publicUrl") != null ? newData.getString("publicUrl") : this.publicUrl;
		this.source = newData.get("source") != null ? newData.getString("source") : this.source;
	}

	public void setupExternalResources(CloudContext context) {

	}

	public void updateExternalResources(CloudContext context, JsonObj data) {

	}

	public void cleanupExternalResources(CloudContext context) {

	}

	public static Dashboard getClassInstance(JsonObj obj) throws InvalidInputException  {
        try {
			String subTypeStr = obj.getString(Dashboard.getNodeSubTypeName());
			BoardType subType = BoardType.valueOf(subTypeStr);
			switch (subType) {
				case GENERIC:
					return new Dashboard();
				default:
					throw new NotImplementedError("Following valid Source type not implemented: " + subType.toString());
			}
        } catch (IllegalArgumentException e) {
			String message = "Unknown APIResourceSubType";
			LOG.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "APIResourceSubType specification required";
			LOG.error(message, e);
			throw new InvalidInputException(message);
        }

    }

	/**
	 * @return the publicUrl
	 */
	public String getPublicUrl() {
		return publicUrl;
	}

	/**
	 * @param publicUrl the publicUrl to set
	 */
	public void setPublicUrl(String publicUrl) {
		this.publicUrl = publicUrl;
	}

	/**
	 * @return the source
	 */
	public String getSource() {
		return source;
	}

	/**
	 * @param source the source to set
	 */
	public void setSource(String source) {
		this.source = source;
	}
}
