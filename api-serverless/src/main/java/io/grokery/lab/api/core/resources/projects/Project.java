package io.grokery.lab.api.core.resources.projects;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class Project extends Resource {	
	
    public Project() {
        super(ResourceTypes.PROJECTS);
    }
    
    public Project(Map<String, Object> obj) {
        super(ResourceTypes.PROJECTS);
        // TODO get field values from obj
    }

}
