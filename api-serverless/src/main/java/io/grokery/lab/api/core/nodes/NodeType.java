package io.grokery.lab.api.core.nodes;

/**
 * Defines top level API resource type collections
 *
 * @author hogue
 */
public enum NodeType {
    NODE("Generic Node"),
    CHART("Chart"),
    DASHBOARD("Dashboard"),
	DATASOURCE("Datasource"),
	JOBRUN("Job Run"),
	JOB("Job");

	private String typeName;

    NodeType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
	}

}