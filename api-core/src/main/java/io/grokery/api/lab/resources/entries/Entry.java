package io.grokery.api.lab.resources.entries;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class Entry extends Resource {

    public Entry() {
        super(ResourceTypes.ENTRIES);
    }
    
    public Entry(Map<String, Object> obj) {
        super(ResourceTypes.ENTRIES);
        // TODO get field values from obj
    }
	
}
