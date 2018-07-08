package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;

import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class AWSDataPipelineJob extends Job {

	// Constructers
	public AWSDataPipelineJob() {
		super(JobType.AWSLAMBDA);
		this.construct();
	}

	public AWSDataPipelineJob(Map<String, Object> obj) {
		super(JobType.AWSLAMBDA);
		this.construct();
	}

	private void construct() {
	}

	// Inherited class methodss
	public void setValues(Map<String, Object> newData) {
		super.setValues(newData);
		// TODO update self values with new data and return self
	}

	public void initialize() {
		super.initialize();
		// TODO allocate any external resources
		// create s3 package path and copy default pkg
		// create lambda and save ARN
	}

	public void decomission() {
		super.decomission();
		// TODO de allocate any external resources
	}

	public void validate() throws InvalidInputException {
		super.validate();
		// TODO make sure I'm good to be saved
	}

	// Getters and Setters

}
