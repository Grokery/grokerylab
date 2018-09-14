package io.grokery.lab.api.cloud.jobruns;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.jobruns.dao.JobRunsDAO;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class JobRunsService {

	private static final Logger LOG = LoggerFactory.getLogger(JobRunsService.class);

	public static JsonObj createAndStartJobRun(JsonObj request, CloudContext context) throws InvalidInputException, NotFoundException {
		DAO dao = JobRunsDAO.getInst(context);
		JobRun jobrun = JobRun.fromMap(request, context);
		jobrun.setStartTime(new DateTime(DateTimeZone.UTC).toString());
		dao.create(jobrun.getJobId(), jobrun.getCreated(), JobRun.toJsonObj(jobrun, true));
		LOG.info("createAndStartJobRun {}/{}", jobrun.getJobId(), jobrun.getCreated());
		jobrun.startRun(context);
		return JobRun.toJsonObj(jobrun, true);
	}

	public static JsonObj updateJobRunStatus(JsonObj request, CloudContext context) throws InvalidInputException, NotFoundException {
		LOG.info("updateJobRunStatus {}/{}", request.getString("jobId"), request.getString("created"));
		DAO dao = JobRunsDAO.getInst(context);
		JobRun existing = JobRun.fromMap(dao.get(request.getString("jobId"), request.getString("created")), context);
		existing.updateStatus(request);
		dao.update(existing.getJobId(), existing.getCreated(), JobRun.toJsonObj(existing, true));
		return JobRun.toJsonObj(existing, true);
	}

	public static JsonObj getJobRunsforJob(String jobId, String query, String projection, int limit, CloudContext context) {
		LOG.info("getJobRunsforJob jobId={} query={} projection={}", jobId, query, projection);
		DAO dao = JobRunsDAO.getInst(context);
		if (projection == null) {
			projection = "jobId, jobrunId, created, startTime, endTime, runStatus";
		}
		JsonObj results = dao.query(jobId, query, projection, limit);
		return results;
	}

	public static JsonObj getJobRunDetails(String jobRunId, CloudContext context) {
		throw new NotImplementedError();
	}

}
