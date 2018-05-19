package io.grokery.lab.api.core.resources.jobruns;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class JobRun extends Resource {

    public JobRun() {
        super(ResourceTypes.JOBRUNS);
    }
    
    public JobRun(Map<String, Object> obj) {
        super(ResourceTypes.JOBRUNS);
        // TODO get field values from obj
    }
	
}
