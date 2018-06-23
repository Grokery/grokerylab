package io.grokery.lab.api.admin.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;

import io.grokery.lab.api.common.CommonUtils;

public class StageTableNameUtil extends DynamoDBMapperConfig.DefaultTableNameResolver {
    @Override
    public String getTableName(Class<?> clazz, DynamoDBMapperConfig config) {
        String stage = CommonUtils.getRequiredEnv("STAGE");
        if (CommonUtils.isNullOrEmpty(stage)) {
            throw new Error("STAGE env var must be defined");
        }
        String rawTableName = super.getTableName(clazz, config);
        String finalName = rawTableName.replace("{STAGE}", stage);
        return finalName;
    }
}