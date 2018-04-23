package io.grokery.api.lab.resources.projects;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class Project extends Resource {	
	
    public Project() {
        super(ResourceTypes.PROJECTS);
    }
    
    public Project(Map<String, Object> obj) {
        super(ResourceTypes.PROJECTS);
        // TODO get field values from obj
    }

}
