package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;

public class AWSLambdaJob extends Job {

    private String s3PkgPath;
	private String lambdaARN;
	private Map<String, Object> schedule;
	private String runControl;

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
		// replace files in s3 folder with any matching incoming files
    }

	public void transitionFrom(AWSLambdaJob other) {
		super.transitionFrom(other);
    }

    public void decomission() {
		super.decomission();
	}

	public String getS3Path() {
		return s3PkgPath;
	}
	public void setS3Path(String s3Path) {
		this.s3PkgPath = s3Path;
	}

	public String getLambdaARN() {
		return lambdaARN;
	}
	public void setLambdaARN(String lambdaARN) {
		this.lambdaARN = lambdaARN;
	}

	public Map<String, Object> getSchedule() {
		return schedule;
	}
	public void setSchedule(Map<String, Object> schedule) {
		this.schedule = schedule;
	}

	public String getRunControl() {
		return runControl;
	}
	public void setRunControl(String runControl) {
		this.runControl = runControl;
	}

}
