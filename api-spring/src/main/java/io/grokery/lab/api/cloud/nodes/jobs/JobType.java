package io.grokery.lab.api.cloud.nodes.jobs;

/**
 * Defines job types
 *
 * @author hogue
 */
public enum JobType {
    GENERIC("Generic"),
    AWSLAMBDA("AWS Lambda"),
    SHELLSCRIPT("Shell Script"),
    AWSDATAPIPELINE("AWS DataPipeline");

	private String typeName;

    JobType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
	}

}
