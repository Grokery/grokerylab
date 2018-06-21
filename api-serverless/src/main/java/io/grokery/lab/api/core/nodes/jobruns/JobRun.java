package io.grokery.lab.api.core.nodes.jobruns;

import java.util.Map;

import io.grokery.lab.api.core.nodes.Node;
import io.grokery.lab.api.core.nodes.NodeType;

public class JobRun extends Node {

    public JobRun() {
        super(NodeType.JOBRUN);
    }

    public JobRun(Map<String, Object> obj) {
        super(NodeType.JOBRUN);
        // TODO get field values from obj
    }

}
