package io.grokery.lab.api.common;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;

/**
 * ObjectMapper singleton wrapper
 *
 * @author hogue
 */
public class MapperUtil extends ObjectMapper {

	private static final long serialVersionUID = 1L;
	private static MapperUtil instance;

    public static MapperUtil getInstance() {
        synchronized (MapperUtil.class) {
            if (instance == null) {
                instance = new MapperUtil();
                instance.setSerializationInclusion(Include.NON_NULL);
                instance.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                instance.registerModule(new JodaModule());
            }
        }
        return instance;
    }

}
