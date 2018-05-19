package io.grokery.lab.api.core;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class DefinitionService {
	
	private static final Logger logger = LoggerFactory.getLogger(DataflowService.class);

    public static Map<String, Object> getLookups() 
        throws InvalidInputException {
        logger.info("getalookups called");
        Map<String, Object> results = new HashMap<String, Object>();
        
		return results;
	}
		
}
