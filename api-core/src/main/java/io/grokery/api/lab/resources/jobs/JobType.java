package io.grokery.api.lab.resources.jobs;

/**
 * Defines job types
 * 
 * @author hogue
 */
public enum JobType {
    GENERIC("Generic"),
	SHELLSCRIPT("ShellScript"),
	AWSDATAPIPELINE("AWSDataPipeline");

	private String typeName;
 
    JobType(String typeName) {
        this.typeName = typeName;
    }
 
    public String getTypeName() {
        return typeName;
	}
	
}
