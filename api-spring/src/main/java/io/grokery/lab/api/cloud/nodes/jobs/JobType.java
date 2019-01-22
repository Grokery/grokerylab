package io.grokery.lab.api.cloud.nodes.jobs;

/**
 * Defines job types
 *
 * @author hogue
 */
public enum JobType {

    // Basic
    GENERIC("Placeholder"),
    BROWSERJS("Browser JS"),

    // Local
    PYTHON("Python"),
    JAVA("Java"),
    SPROC("SQL Stored Procedure"),

    // AWS
    AWSLAMBDA("AWS Lambda"),
    AWSDATAPIPELINE("AWS DataPipeline"),

    // Azure
    AZUREFUNC("Azure Function"),
    AZUREDATAFACTORY("Azure DataFactory");

    private String typeName;

    JobType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }

}
