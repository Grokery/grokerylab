package io.grokery.lab.api.core.resources.entries;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class Entry extends Resource {

    public Entry() {
        super(ResourceTypes.ENTRIES);
    }
    
    public Entry(Map<String, Object> obj) {
        super(ResourceTypes.ENTRIES);
        // TODO get field values from obj
    }
	
}
