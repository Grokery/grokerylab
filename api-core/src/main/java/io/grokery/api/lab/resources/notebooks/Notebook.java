package io.grokery.api.lab.resources.notebooks;

import java.util.Map;

import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class Notebook extends Resource {

    public Notebook() {
        super(ResourceTypes.NOTEBOOKS);
    }
    
    public Notebook(Map<String, Object> obj) {
        super(ResourceTypes.NOTEBOOKS);
        // TODO get field values from obj
    }

}
