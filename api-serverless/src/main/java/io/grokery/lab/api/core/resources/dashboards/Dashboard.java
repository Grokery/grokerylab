package io.grokery.lab.api.core.resources.dashboards;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class Dashboard extends Resource {

    public Dashboard() {
        super(ResourceTypes.DASHBOARDS);
    }
    
    public Dashboard(Map<String, Object> obj) {
        super(ResourceTypes.DASHBOARDS);
        // TODO get field values from obj
    }
    
}
