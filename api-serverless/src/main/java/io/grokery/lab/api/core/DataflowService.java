package io.grokery.lab.api.core;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.dao.DAOFactory;

public class DataflowService {
	
	private static final Logger logger = LoggerFactory.getLogger(DataflowService.class);

    public static Map<String, Object> getNodesForFlow(GrokeryContext context) 
        throws InvalidInputException {

        logger.info("getNodesForFlow called");
        Map<String, Object> result = DAOFactory.getDAO(context).retrieve("JOBS", null, null);

        // Map<String, Object> result = new HashMap<String, Object>();
        // for (Map<String, Object> node : result) {
        //     result.put(node.get("guid").toString(), node);
        // }
        
		return result;
	}
		
}
