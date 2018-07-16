package io.grokery.lab.api.cloud.jobruns;

import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class JobRun {

	private static final Logger LOGGER = LoggerFactory.getLogger(JobRun.class);

	private String jobId;
	private String jobRunType;
	private String jobRunId;
	private String runStatus;
	private String startTime;
	private String endTime;
	private JsonObj args;

	private static String getJobRunTypeName() {
		return "jobRunType";
	}

	public JobRun() {

	}

	public void startRun() {
		throw new NotImplementedError();
	}

	public static JsonObj toMap(JobRun obj, Boolean removeNulls) {
		JsonObj result = MapperUtil.getInstance().convertValue(obj, JsonObj.class);
		if (removeNulls == true) {
			return JobRun.RemoveNullValues(result);
		} else {
			return result;
		}
    }

	public static JsonObj RemoveNullValues(JsonObj obj) {
      for(Iterator<Map.Entry<String, Object>> it = obj.entrySet().iterator(); it.hasNext(); ) {
          Map.Entry<String, Object> entry = it.next();
          if(entry.getValue() == null) {
              it.remove();
          }
      }
      return obj;
	}

	public static JobRun fromMap(JsonObj obj, CloudContext context) throws InvalidInputException {
		return JobRun.fromMap(obj, JobRun.getClassInstance(obj, context));
	}

	public static JobRun fromMap(JsonObj obj, JobRun toValueType) {
		return MapperUtil.getInstance().convertValue(obj, toValueType.getClass());
	}

	public static JobRun getClassInstance(JsonObj obj, CloudContext context) throws InvalidInputException {
		try {
			String typeName = obj.getString(JobRun.getJobRunTypeName());
			LOGGER.info("Get class instance for jobRunType: " + typeName);
			JobRunType nodeType = JobRunType.valueOf(typeName);
			switch (nodeType) {
				case AWSLAMBDA:
					return new AWSLambdaJobRun();
				default:
					throw new NotImplementedError();
			}
		} catch (IllegalArgumentException e) {
			String message = "Unknown NodeType";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "NodeType specification required";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);
		}
	}

	public String getJobRunType() {
		return jobRunType;
	}
	public void setJobRunType(String jobRunType) {
		this.jobRunType = jobRunType;
	}

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
