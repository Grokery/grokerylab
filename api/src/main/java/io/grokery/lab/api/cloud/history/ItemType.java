package io.grokery.lab.api.cloud.history;

/**
 * Defines top level API resource type collections
 *
 * @author hogue
 */
public enum ItemType {
    GENERIC("Generic"),
    COMMENT("Comment"),
    JOBRUN("JobRun");

    private String typeName;

    ItemType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }

}
