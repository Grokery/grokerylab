package io.grokery.lab.api.cloud;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class JobRunsService {

	private static final Logger logger = LoggerFactory.getLogger(JobRunsService.class);

	public static JsonObj runJob(JsonObj request, CloudContext context) throws InvalidInputException {
		logger.info("run job");

			// TODO init info in db
			// TODO switch into job run code and kick off job run
			// TODO return job run id and status info

		return new JsonObj();
	}


}
