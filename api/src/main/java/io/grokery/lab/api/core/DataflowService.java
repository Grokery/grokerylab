package io.grokery.lab.api.core;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.core.dao.DAOFactory;

public class DataflowService {
	
	private static final Logger logger = LoggerFactory.getLogger(DataflowService.class);

    public static Map<String, Object> getNodesForFlow(GrokeryContext context) 
        throws InvalidInputException {

        logger.info("getNodesForFlow called");
        List<Map<String, Object>> results = DAOFactory.getDAO(context).retrieve("JOBS", "", 0, 100);

        Map<String, Object> result = new HashMap<String, Object>();
        for (Map<String, Object> node : results) {
            result.put(node.get("guid").toString(), node);
        }
        
		return result;
	}
		
}
