package io.grokery.lab.api.common;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;

public class StageTableNameResolver extends DynamoDBMapperConfig.DefaultTableNameResolver {
    @Override
    public String getTableName(Class<?> clazz, DynamoDBMapperConfig config) {
        String stage = System.getenv("STAGE");
        String rawTableName = super.getTableName(clazz, config);
        String finalName = rawTableName.replace("{STAGE}", stage);
        return finalName;
    }
}