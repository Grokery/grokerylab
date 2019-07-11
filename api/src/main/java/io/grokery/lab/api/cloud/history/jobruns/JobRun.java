package io.grokery.lab.api.cloud.history.jobruns;

import java.util.Iterator;
import java.util.Map;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.history.HistoryItem;
import io.grokery.lab.api.cloud.history.ItemType;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class JobRun extends HistoryItem {

	private static final Logger LOG = LoggerFactory.getLogger(JobRun.class);

	private String nodeId;
	private String jobRunType;
	private String runStatus;
	private String startTime;
	private String endTime;
	private String userContact;
	private JsonObj args;

	public JobRun() {
		this.initializeDefaults();
		this.setJobRunType(JobRunType.GENERIC.toString());
	}

	protected JobRun(JobRunType jobRunType) {
		this.initializeDefaults();
		this.setJobRunType(jobRunType.toString());
	}

	protected void initializeDefaults() {
		super.initializeDefaults();
		this.setItemType(ItemType.JOBRUN.toString());
		this.setRunStatus(JobRunStatus.STAGED.toString());
	}

	public void startRun(CloudContext context) {
		
	}

	public void updateStatus(JsonObj request) throws InvalidInputException {		
		JobRunStatus status = JobRunStatus.valueOf(request.getString("runStatus"));
		this.validateStatusTransition(status);

		LOG.info("updateStatus nodeId/created: {}/{} from {} to {}", 
			this.getNodeId(),
			this.getCreated(),
			this.getRunStatus(),
			request.getString("runStatus"));

		this.setRunStatus(status.toString());
		this.setUpdated(new DateTime(DateTimeZone.UTC).toString());

		if (status == JobRunStatus.COMPLETED || status == JobRunStatus.ERRORED) {
			this.setEndTime(this.getUpdated());
		}
	}

	private void validateStatusTransition(JobRunStatus newStatus) throws InvalidInputException {
		JobRunStatus currentStatus = JobRunStatus.valueOf(this.getRunStatus());
		if (currentStatus == newStatus) {
			throw new InvalidInputException("JobRun has already been updated to status: " + newStatus.toString());
		} else if (currentStatus == JobRunStatus.RUNNING) {
			if (newStatus == JobRunStatus.STAGED) {
				throw new InvalidInputException("JobRun may not return to STAGED status after starting run");
			} 
		} else if (currentStatus == JobRunStatus.COMPLETED || currentStatus == JobRunStatus.ERRORED) {
			throw new InvalidInputException("JobRun has already terminated with status: " + this.getRunStatus());
		}
	}

	public static JsonObj toJsonObj(JobRun obj, Boolean removeNulls) {
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
			String typeName = obj.getString("jobRunType");
			LOG.info("Get class instance for jobRunType: " + typeName);
			JobRunType nodeType = JobRunType.valueOf(typeName);
			switch (nodeType) {
				case AWSLAMBDA:
					return new AWSLambdaJobRun();
				default:
					return new JobRun();
			}
		} catch (IllegalArgumentException e) {
			String message = "Unknown NodeType";
			LOG.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "NodeType specification required";
			LOG.error(message, e);
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
	public String getNodeId() {
		return nodeId;
	}
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
     public JsonObj getArgs() {
		return args;
	}
	public void setArgs(JsonObj args) {
		this.args = args;
	}
	public String getUserContact() {
		return userContact;
	}
	public void setUserContact(String user) {
		this.userContact = user;
	}

}
