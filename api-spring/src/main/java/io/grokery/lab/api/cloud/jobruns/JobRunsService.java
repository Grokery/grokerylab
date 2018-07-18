package io.grokery.lab.api.cloud.jobruns;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.dao.DAO; import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
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
		dao.create(jobrun.getJobId(), jobrun.getStartTime(), JobRun.toJsonObj(jobrun, true));
		jobrun.startRun(context);
		dao.update(jobrun.getJobId(), jobrun.getStartTime(), JobRun.toJsonObj(jobrun, true));

		return JobRun.toJsonObj(jobrun, true);
	}

}
