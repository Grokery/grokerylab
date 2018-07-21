package io.grokery.lab.api.cloud.nodes.jobs;

import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class AWSDataPipelineJob extends Job {

	// Constructers
	public AWSDataPipelineJob() {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	public AWSDataPipelineJob(JsonObj obj) {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	private void initializeDefaults() {
	}

	// Inherited class methodss
	public void setValues(JsonObj newData) {
		super.setValues(newData);
		// TODO update self values with new data and return self
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
		// TODO make sure I'm good to be saved
	}

	public void setupExternalResources(CloudContext context) {
		super.setupExternalResources(context);
		// TODO allocate any external resources
		// create s3 package path and copy default pkg
		// create lambda and save ARN
	}

	public void cleanupExternalResources(CloudContext context) {
		super.cleanupExternalResources(context);
		// TODO de allocate any external resources
	}

	// Getters and Setters

}
