package io.grokery.lab.api.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig.Builder;
import io.grokery.lab.api.common.ContextCredentialProvider;
import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.StageTableNameResolver;
import io.grokery.lab.api.common.Common;

public class BaseController {

	protected static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	protected final DynamoDBMapper dynamo;
	protected final ObjectMapper objectMapper;
	
	public BaseController() {
		GrokeryContext context = new GrokeryContext();
		context.awsAccessKeyId = Common.getRequiredEnv("AWS_ACCESS_KEY_ID");
		context.awsSecretKey = Common.getRequiredEnv("AWS_SECRET_KEY");
		context.awsRegion = Common.getRequiredEnv("AWS_REGION");
		
		AmazonDynamoDB dynamoClient = AmazonDynamoDBClientBuilder.standard()
				.withCredentials(new ContextCredentialProvider(context))
				.withRegion(Regions.valueOf(context.awsRegion))
				.build();

		Builder configBuilder = DynamoDBMapperConfig.builder();
		configBuilder.withTableNameResolver(new StageTableNameResolver());
		dynamo = new DynamoDBMapper(dynamoClient, configBuilder.build());

		objectMapper = new ObjectMapper();
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

}