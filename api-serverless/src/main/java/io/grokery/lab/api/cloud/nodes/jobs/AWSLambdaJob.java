package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.HashMap;
import java.util.Map;

import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class AWSLambdaJob extends Job {

	private String s3PkgPath;
	private String lambdaARN;
	private String runControl;
	private Map<String, Object> schedule;

	// Constructers
	public AWSLambdaJob() {
		super(JobType.AWSLAMBDA);
		this.construct();
	}

	public AWSLambdaJob(Map<String, Object> obj) {
		super(JobType.AWSLAMBDA);
		this.construct();
	}

	private void construct() {
		this.runControl = "manual";
		this.schedule = new HashMap<String, Object>();
	}

	// Inherited class methods
	@SuppressWarnings("unchecked")
	public void setValues(Map<String, Object> newData) {
		super.setValues(newData);
		this.s3PkgPath = newData.get("s3PkgPath") != null ? newData.get("s3PkgPath").toString() : this.s3PkgPath;
		this.lambdaARN = newData.get("lambdaARN")!= null ? newData.get("lambdaARN").toString() : this.lambdaARN;
		this.runControl = newData.get("runControl") != null ? newData.get("runControl").toString() : this.runControl;
		this.schedule = newData.get("schedule") != null ? MapperUtil.getInstance().convertValue(newData.get("schedule"), HashMap.class) : this.schedule;
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

	public String getRunControl() {
		return runControl;
	}
	public void setRunControl(String runControl) {
		this.runControl = runControl;
	}

	public Map<String, Object> getSchedule() {
		return schedule;
	}
	public void setSchedule(Map<String, Object> schedule) {
		this.schedule = schedule;
	}

}
