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
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class JobRunsService {

	private static final Logger LOG = LoggerFactory.getLogger(JobRunsService.class);

	public static JsonObj createAndStartJobRun(String auth, String cloudId, JsonObj request) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		DAO dao = JobRunsDAO.getInst(context);
		JobRun jobrun = JobRun.fromMap(request, context);
		jobrun.setStartTime(new DateTime(DateTimeZone.UTC).toString());
		dao.create(jobrun.getJobId(), jobrun.getCreated(), JobRun.toJsonObj(jobrun, true));
		LOG.info("createAndStartJobRun {}/{}", jobrun.getJobId(), jobrun.getCreated());
		jobrun.startRun(context);
		return JobRun.toJsonObj(jobrun, true);
	}

	public static JsonObj updateJobRunStatus(String auth, String cloudId, String jobId, String created, JsonObj request) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		LOG.info("updateJobRunStatus {}/{}", jobId, created);
		DAO dao = JobRunsDAO.getInst(context);
		JobRun existing = JobRun.fromMap(dao.get(jobId, created), context);
		existing.updateStatus(request);
		dao.update(existing.getJobId(), existing.getCreated(), JobRun.toJsonObj(existing, true));
		return JobRun.toJsonObj(existing, true);
	}

	public static JsonObj getJobRunsforJob(String auth, String cloudId, String jobId, String query, String projection, int limit) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		LOG.info("getJobRunsforJob query={} projection={}", query, projection);
		DAO dao = JobRunsDAO.getInst(context);
		if (projection == null) {
			projection = "jobId, jobrunId, created, startTime, endTime, runStatus, userContact";
		}
		JsonObj results = dao.query(jobId, query, projection, limit);
		return results;
	}

	public static JsonObj getJobRunDetails(String auth, String cloudId, String jobRunId) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		throw new NotImplementedError();
	}

}
