package io.grokery.lab.api.cloud.nodes;

/**
 * Defines top level API resource type collections
 *
 * @author hogue
 */
public enum NodeType {
    JOB("Job"),
    DATASOURCE("Datasource");

    private String typeName;

    NodeType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }

}
