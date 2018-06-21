package io.grokery.lab.api.core.nodes.jobs;

/**
 * Defines job types
 *
 * @author hogue
 */
public enum JobType {
    GENERIC("Generic"),
    SHELLSCRIPT("Shell Script"),
    AWSLAMBDA("AWS Lambda"),
    AWSDATAPIPELINE("AWS DataPipeline");

	private String typeName;

    JobType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
	}

}
