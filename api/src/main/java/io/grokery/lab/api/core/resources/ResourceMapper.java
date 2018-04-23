package io.grokery.lab.api.core.resources;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * ObjectMapper singleton wrapper
 * 
 * @author hogue
 */
public class ResourceMapper extends ObjectMapper {

	private static final long serialVersionUID = 1L;
	private static ResourceMapper instance;

    public static ResourceMapper getInstance() {
        synchronized (ResourceMapper.class) {
            if (instance == null) {
                instance = new ResourceMapper();
                instance.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            }
        }
        return instance;
    }
	
}
