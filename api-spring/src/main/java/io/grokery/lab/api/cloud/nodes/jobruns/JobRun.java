package io.grokery.lab.api.cloud.nodes.jobruns;

import java.util.Map;

import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;

public class JobRun extends Node {

    public JobRun() {
        super(NodeType.JOBRUN);
    }

    public JobRun(Map<String, Object> obj) {
        super(NodeType.JOBRUN);
        // TODO get field values from obj
    }

}
