package io.grokery.lab.api.core.resources.dataflows;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class Dataflow extends Resource {

    public Dataflow() {
        super(ResourceTypes.DATAFLOWS);
    }
    
    public Dataflow(Map<String, Object> obj) {
        super(ResourceTypes.DATAFLOWS);
        // TODO get field values from obj
    }
    
}
