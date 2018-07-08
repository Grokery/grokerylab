package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;

import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class AWSDataPipelineJob extends Job {

	// Constructers
	public AWSDataPipelineJob() {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	public AWSDataPipelineJob(Map<String, Object> obj) {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	private void initializeDefaults() {
	}

	// Inherited class methodss
	public void setValues(Map<String, Object> newData) {
		super.setValues(newData);
		// TODO update self values with new data and return self
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
		// TODO make sure I'm good to be saved
	}

	public void setupExternalResources() {
		super.setupExternalResources();
		// TODO allocate any external resources
		// create s3 package path and copy default pkg
		// create lambda and save ARN
	}

	public void cleanupExternalResources() {
		super.cleanupExternalResources();
		// TODO de allocate any external resources
	}

	// Getters and Setters

}
