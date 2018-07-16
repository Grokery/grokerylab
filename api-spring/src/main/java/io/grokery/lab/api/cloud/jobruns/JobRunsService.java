package io.grokery.lab.api.cloud.jobruns;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.cloud.jobruns.dao.DAOFactory;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class JobRunsService {

	private static final Logger logger = LoggerFactory.getLogger(JobRunsService.class);

	public static JsonObj createAndStartJobRun(JsonObj request, CloudContext context) throws InvalidInputException {
		logger.info("run job");

		DAO dao = DAOFactory.getDAO(context);

		JobRun jobrun = JobRun.fromMap(request, context);

		dao.create(jobrun.getJobrunId(), JobRun.toMap(jobrun, true));

		jobrun.startRun();

		return JobRun.toMap(jobrun, true);
	}

}
