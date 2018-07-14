package io.grokery.lab.api.cloud.nodes.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AWSLambdaPythonJob extends AWSLambdaJob {

	private static final Logger LOGGER = LoggerFactory.getLogger(AWSLambdaPythonJob.class);

	// Constructers
	public AWSLambdaPythonJob() {
		super(JobType.PYTHON);
		this.initializeDefaults();
	}

}
