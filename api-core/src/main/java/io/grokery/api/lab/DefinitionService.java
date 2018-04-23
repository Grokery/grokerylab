package io.grokery.api.lab;

import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.grokery.api.common.GrokeryContext;
import io.grokery.api.common.exceptions.InvalidInputException;

public class DefinitionService {
	
	private static final Logger logger = LogManager.getLogger(DataflowService.class);

    public static Map<String, Object> getLookups() 
        throws InvalidInputException {
        logger.info("getalookups called");
        Map<String, Object> results = new HashMap<String, Object>();
        
		return results;
	}
		
}
