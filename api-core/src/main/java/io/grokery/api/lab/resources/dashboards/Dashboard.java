package io.grokery.api.lab.resources.dashboards;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class Dashboard extends Resource {

    public Dashboard() {
        super(ResourceTypes.DASHBOARDS);
    }
    
    public Dashboard(Map<String, Object> obj) {
        super(ResourceTypes.DASHBOARDS);
        // TODO get field values from obj
    }
    
}
