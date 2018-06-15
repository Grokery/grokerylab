package io.grokery.lab.api.core;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.CloudContext;
import io.grokery.lab.api.common.dao.DAOFactory;

public class DataflowService {

	private static final Logger logger = LoggerFactory.getLogger(DataflowService.class);

    public static Map<String, Object> getNodesForFlow(CloudContext context)
        throws InvalidInputException {

        logger.info("getNodesForFlow called");
        Map<String, Object> result = DAOFactory.getDAO(context).retrieve("");

		return result;
	}

}
