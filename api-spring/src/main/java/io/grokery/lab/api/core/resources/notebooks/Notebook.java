package io.grokery.lab.api.core.resources.notebooks;

import java.util.Map;

import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class Notebook extends Resource {

    public Notebook() {
        super(ResourceTypes.NOTEBOOKS);
    }
    
    public Notebook(Map<String, Object> obj) {
        super(ResourceTypes.NOTEBOOKS);
        // TODO get field values from obj
    }

}
