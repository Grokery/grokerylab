package io.grokery.lab.api.cloud.nodes.sources;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;

/**
 * Contains the fields and logic common to all DataSource types
 *
 * @author hogue
 */
public class Datasource extends Node {

	private static final Logger LOG = LoggerFactory.getLogger(Datasource.class);

	private UUID templateId;

	public Datasource() {
		super(NodeType.DATASOURCE);
		this.setSubType(SourceType.PLACEHOLDER.toString());
	}

    public Datasource(SourceType subType) {
        super(NodeType.DATASOURCE);
        this.setSubType(subType.toString());
	}

    public void init(JsonObj obj) {
		// TODO get field values from obj
    }

	public static String getResourceSubTypeName() {
        return "subType";
    }

	public static Datasource getClassInstance(JsonObj obj, CloudContext context) throws InvalidInputException  {
        try {
			String subTypeStr = obj.getString(Datasource.getResourceSubTypeName());
			SourceType subType = SourceType.valueOf(subTypeStr);
			switch (subType) {
				case PLACEHOLDER:
					return new Datasource();
				case AWSS3:
					return new AWSS3BucketSource();
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
	 * @return the templateId
	 */
	public UUID getTemplateId() {
		return templateId;
	}

	/**
	 * @param templateId the templateId to set
	 */
	public void setTemplateId(UUID templateId) {
		this.templateId = templateId;
	}
}
