package io.grokery.api.lab.resources.jobruns;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class JobRun extends Resource {

    public JobRun() {
        super(ResourceTypes.JOBRUNS);
    }
    
    public JobRun(Map<String, Object> obj) {
        super(ResourceTypes.JOBRUNS);
        // TODO get field values from obj
    }
	
}
