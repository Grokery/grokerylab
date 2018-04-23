package io.grokery.api.lab.resources.dataflows;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class Dataflow extends Resource {

    public Dataflow() {
        super(ResourceTypes.DATAFLOWS);
    }
    
    public Dataflow(Map<String, Object> obj) {
        super(ResourceTypes.DATAFLOWS);
        // TODO get field values from obj
    }
    
}
