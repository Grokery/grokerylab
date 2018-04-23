package io.grokery.api.lab.resources.charts;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class Chart extends Resource {

    public Chart() {
        super(ResourceTypes.CHARTS);
    }
    
    public Chart(Map<String, Object> obj) {
        super(ResourceTypes.CHARTS);
        // TODO get field values from obj
    }
    
}
