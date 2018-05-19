package io.grokery.lab.api.core.resources.jobs;

/**
 * Defines job types
 * 
 * @author hogue
 */
public enum JobType {
    GENERIC("Generic"),
    SHELLSCRIPT("ShellScript"),
    AWSLAMBDA("AWSLambda"),
    AWSDATAPIPELINE("AWSDataPipeline");

	private String typeName;
 
    JobType(String typeName) {
        this.typeName = typeName;
    }
 
    public String getTypeName() {
        return typeName;
	}
	
}
