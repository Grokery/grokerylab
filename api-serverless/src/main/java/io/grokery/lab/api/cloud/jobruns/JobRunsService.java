package io.grokery.lab.api.cloud.jobruns;

import java.util.List;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.jobruns.dao.JobRunsDAO;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class JobRunsService {

	private static final Logger logger = LoggerFactory.getLogger(JobRunsService.class);

	public static JsonObj createAndStartJobRun(JsonObj request, CloudContext context) throws InvalidInputException, NotFoundException {
		logger.info("run job");

		DAO dao = JobRunsDAO.getInst(context);
		JobRun jobrun = JobRun.fromMap(request, context);
		jobrun.setStartTime(new DateTime(DateTimeZone.UTC).toString());
		dao.create(jobrun.getJobId(), jobrun.getCreated(), JobRun.toJsonObj(jobrun, true));

		jobrun.startRun(context);
		dao.update(jobrun.getJobId(), jobrun.getCreated(), JobRun.toJsonObj(jobrun, true));
		return JobRun.toJsonObj(jobrun, true);
	}

	public static JsonObj getJobRunDetails(String jobRunId, CloudContext context) {
		DAO dao = JobRunsDAO.getInst(context);

		return new JsonObj();
	}

	public static JsonObj getJobRunsforJob(String jobId, CloudContext context) {
		DAO dao = JobRunsDAO.getInst(context);

		// JsonObj query = new JsonObj();
		// query.put("startTime", "2018-07-21T06:28:26.738Z");
		// List<JsonObj> test = dao.query(jobId, query);

		List<JsonObj> items = dao.query(jobId);
		JsonObj result = new JsonObj();
		result.put("data", items);
		return result;
	}

	public static JsonObj updateJobRunStatus(JsonObj request, CloudContext context) throws InvalidInputException, NotFoundException {
		DAO dao = JobRunsDAO.getInst(context);
		JobRun existing = JobRun.fromMap(dao.get(request.getString("jobId"), request.getString("created")), context);
		existing.updateStatus(request);
		dao.update(existing.getJobId(), existing.getStartTime(), JobRun.toJsonObj(existing, true));
		return JobRun.toJsonObj(existing, true);
	}

}
