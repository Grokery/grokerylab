package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;

public class Job extends Node {

	private static final Logger LOGGER = LoggerFactory.getLogger(Job.class);

	private UUID templateId;

	// Constructers
	public Job() {
		super(NodeType.JOB);
		this.initializeDefaults();
	}

	protected Job(JobType subType) {
		super(NodeType.JOB);
		this.initializeDefaults();
		this.setSubType(subType.toString());
	}

	private void initializeDefaults() {
		this.setSubType(JobType.GENERIC.toString());
	}

	public void setValues(Map<String, Object> newData) {
		super.setValues(newData);
		this.templateId = newData.get("templateId") != null ? MapperUtil.getInstance().convertValue(newData.get("templateId"), UUID.class) : this.templateId;
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
	}

	public void setupExternalResources() {
		super.setupExternalResources();
	}

	public void updateExternalResources() {
		super.updateExternalResources();
	}

	public void cleanupExternalResources() {
		super.cleanupExternalResources();
	}

    public static Job getClassInstance(Map<String, Object> obj) throws InvalidInputException {
        try {
			String subTypeStr = obj.get(Job.getNodeSubTypeName()).toString();
			JobType subType = JobType.valueOf(subTypeStr);
			switch (subType) {
				case GENERIC:
					return new Job();
				case AWSLAMBDA:
					return new AWSLambdaJob();
				case AWSDATAPIPELINE:
					return new AWSDataPipelineJob();
				default:
					throw new NotImplementedError("Following Job type not implemented: " + subType.toString());
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

	// Getters and Setters
	public UUID getTemplateId() {
		return templateId;
	}

	public void setTemplateId(UUID templateId) {
		this.templateId = templateId;
	}

}
