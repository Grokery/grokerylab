package io.grokery.lab.api.cloud.jobruns;

import io.grokery.lab.api.common.JsonObj;

public class JobRun {

    private String jobRunId;
    private String jobId;
    private String s3LogPath;
    private String runStatus;
    private String startTime;
    private String endTime;
    private JsonObj args;

    public JobRun() {}

	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getRunStatus() {
		return runStatus;
	}
	public void setRunStatus(String runStatus) {
		this.runStatus = runStatus;
	}
	public String getS3LogPath() {
		return s3LogPath;
	}
	public void setS3LogPath(String s3LogPath) {
		this.s3LogPath = s3LogPath;
	}
	public String getJobId() {
		return jobId;
	}
	public void setJobId(String jobId) {
		this.jobId = jobId;
	}
	public String getJobrunId() {
		return jobRunId;
	}
	public void setJobrunId(String jobRunId) {
		this.jobRunId = jobRunId;
    }
     public JsonObj getArgs() {
		return args;
	}
	public void setArgs(JsonObj args) {
		this.args = args;
	}

}
