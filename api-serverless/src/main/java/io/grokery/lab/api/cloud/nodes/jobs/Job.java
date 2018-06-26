package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;

public class Job extends Node {

	private static final Logger LOGGER = LoggerFactory.getLogger(Job.class);

    private JobType subType;
    private UUID templateId;

    public Job() {
        super(NodeType.JOB);
        this.subType = JobType.GENERIC;
    }

    public Job(JobType subType) {
        super(NodeType.JOB);
        this.subType = subType;
	}

	public Job(JobType subType, Map<String, Object> obj) {
        super(NodeType.JOB);
		this.subType = subType;
		this.init(obj);
    }

    public void init(Map<String, Object> obj) {
		// TODO get field values from obj
    }

    public static String getNodeSubTypeName() {
        return "subType";
    }

    public static Job getClassInstance(Map<String, Object>  obj) throws InvalidInputException  {
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
					throw new NotImplementedError("Following valid Job type not implemented: " + subType.toString());
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

	public JobType getSubType() {
		return subType;
	}

	public void setSubType(JobType subType) {
		this.subType = subType;
	}

	public UUID getTemplateId() {
		return templateId;
	}

	public void setTemplateId(UUID templateId) {
		this.templateId = templateId;
	}

}
