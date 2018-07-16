package io.grokery.lab.api.cloud.jobruns;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AWSLambdaJobRun extends JobRun {

	private static final Logger LOGGER = LoggerFactory.getLogger(AWSLambdaJobRun.class);

	private String s3LogPath;
	private String lambdaARN;

	public AWSLambdaJobRun() {
		super();
	}

	public void startRun() {

	}

	public String getS3LogPath() {
		return s3LogPath;
	}
	public void setS3LogPath(String s3LogPath) {
		this.s3LogPath = s3LogPath;
	}
	public String getLambdaARN() {
		return lambdaARN;
	}
	public void setLambdaARN(String lambdaARN) {
		this.lambdaARN = lambdaARN;
	}
}
