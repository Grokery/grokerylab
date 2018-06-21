package io.grokery.lab.api.core.nodes.jobs;

import java.util.Map;

/**
 * Contains fields and logic specific to AWS Lambda jobs
 *
 * Might be cool to make this use github. It could create push and forget. Then checkout update commit push and forget.
 *
 * @author hogue
 */
public class AWSLambdaJob extends Job {

    private String s3Path;
    private String lambdaARN;

    public AWSLambdaJob() {
        super(JobType.AWSLAMBDA);
    }

    public AWSLambdaJob(Map<String, Object> obj) {
        super(JobType.AWSLAMBDA);
    }

    public void initialize() {
        super.initialize();
        // make folder in s3 and set this.s3Path
        // set default files from template projects into new s3 folder
	}

    public void transitionTo(AWSLambdaJob other) {
        super.transitionTo(other);
		// replace files in s3 folder with any matching incomming files
    }

	public void transitionFrom(AWSLambdaJob other) {
		super.transitionFrom(other);
    }

    public void decomission() {
		super.decomission();
	}

	/**
	 * @return the s3Path
	 */
	public String getS3Path() {
		return s3Path;
	}

	/**
	 * @param s3Path the s3Path to set
	 */
	public void setS3Path(String s3Path) {
		this.s3Path = s3Path;
	}

	/**
	 * @return the lambdaARN
	 */
	public String getLambdaARN() {
		return lambdaARN;
	}

	/**
	 * @param lambdaARN the lambdaARN to set
	 */
	public void setLambdaARN(String lambdaARN) {
		this.lambdaARN = lambdaARN;
	}

}
