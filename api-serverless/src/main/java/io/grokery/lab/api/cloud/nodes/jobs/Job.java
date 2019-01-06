package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;

public class Job extends Node {

	private static final Logger LOG = LoggerFactory.getLogger(Job.class);

	private int version;
	private String templateId;
	private Map<String, Object> files;

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
		this.setVersion(0);
		this.setSubType(JobType.PLACEHOLDER.toString());
	}

	public void setValues(JsonObj newData) {
		super.setValues(newData);
		this.templateId = newData.get("templateId") != null ? newData.getString("templateId") : this.templateId;
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
	}

	public void setupExternalResources(CloudContext context) {
		super.setupExternalResources(context);
	}

	public void updateExternalResources(CloudContext context, JsonObj data) {
		super.updateExternalResources(context, data);
	}

	public void cleanupExternalResources(CloudContext context) {
		super.cleanupExternalResources(context);
	}

	public static Job getClassInstance(JsonObj obj) throws InvalidInputException {
		try {
			String subTypeStr = obj.getString(Job.getNodeSubTypeName());
			JobType subType = JobType.valueOf(subTypeStr);
			switch (subType) {
				case PLACEHOLDER:
					return new Job();
				case AWSLAMBDA:
					return new AWSLambdaJob();
				default:
					throw new NotImplementedError("Following Job type not implemented: " + subType.toString());
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

	// Getters and Setters
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}

	public String getTemplateId() {
		return templateId;
	}
	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}
	public Map<String, Object> getFiles() {
		return files;
	}
	public void setFiles(Map<String, Object> files) {
		this.files = files;
	}

}
