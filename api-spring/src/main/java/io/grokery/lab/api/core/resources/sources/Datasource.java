package io.grokery.lab.api.core.resources.sources;

import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.core.resources.Node;
import io.grokery.lab.api.core.resources.ResourceTypes;

/**
 * Contains the fields and logic common to all DataSource types
 *
 * @author hogue
 */
public class Datasource extends Node {

	private static final Logger LOGGER = LoggerFactory.getLogger(Datasource.class);

	private SourceType subType;
    private UUID templateId;

    public Datasource() {
        super(ResourceTypes.DATASOURCES);
        this.subType = SourceType.GENERIC;
    }

    public Datasource(SourceType subType) {
        super(ResourceTypes.DATASOURCES);
        this.subType = subType;
	}

	public Datasource(SourceType subType, Map<String, Object> obj) {
        super(ResourceTypes.DATASOURCES);
		this.subType = subType;
		this.init(obj);
    }

    public void init(Map<String, Object> obj) {
		// TODO get field values from obj
    }

	public static String getResourceSubTypeName() {
        return "subType";
    }

	public static Datasource getClassInstance(Map<String, Object>  obj) throws InvalidInputException  {
        try {
			String subTypeStr = obj.get(Datasource.getResourceSubTypeName()).toString();
			SourceType subType = SourceType.valueOf(subTypeStr);
			switch (subType) {
				case GENERIC:
					return new Datasource();
				case AWSS3BUCKET:
					return new AWSS3BucketSource();
				default:
					throw new NotImplementedError("Following valid Source type not implemented: " + subType.toString());
			}
        } catch (IllegalArgumentException e) {
			String message = "Unknown APIResourceSubType";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "APIResourceSubType specification required";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
        }

    }

	/**
	 * @return the subType
	 */
	public SourceType getSubType() {
		return subType;
	}

	/**
	 * @param subType the subType to set
	 */
	public void setSubType(SourceType subType) {
		this.subType = subType;
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
