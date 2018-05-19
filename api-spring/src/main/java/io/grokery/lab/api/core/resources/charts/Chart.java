package io.grokery.lab.api.core.resources.charts;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class Chart extends Resource {

    public Chart() {
        super(ResourceTypes.CHARTS);
    }
    
    public Chart(Map<String, Object> obj) {
        super(ResourceTypes.CHARTS);
        // TODO get field values from obj
    }
    
}
