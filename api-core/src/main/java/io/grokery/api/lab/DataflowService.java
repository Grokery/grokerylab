package io.grokery.api.lab;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.grokery.api.common.GrokeryContext;
import io.grokery.api.common.exceptions.InvalidInputException;
import io.grokery.api.lab.dao.DAOFactory;

public class DataflowService {
	
	private static final Logger logger = LogManager.getLogger(DataflowService.class);

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
