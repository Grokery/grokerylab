package io.grokery.lab.api.cloud.nodes.jobs;

/**
 * Defines job types
 *
 * @author hogue
 */
public enum JobType {
    GENERIC("Generic"),
    PYTHON("Python"),
    SQL("SQL"),
    JAVA("Java"),

    AWSLAMBDA("AWS Lambda"),
    AZUREFUNC("Azure Function"),
    AWSDATAPIPELINE("AWS DataPipeline"),
    AZUREDATAFACTORY("Azure DataFactory");

    private String typeName;

    JobType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }

}
