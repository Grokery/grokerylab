package io.grokery.lab.api.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig.Builder;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.GlobalSecondaryIndex;
import com.amazonaws.services.dynamodbv2.model.Projection;
import com.amazonaws.services.dynamodbv2.model.ProjectionType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;
import com.amazonaws.services.dynamodbv2.util.TableUtils;
import com.amazonaws.services.dynamodbv2.util.TableUtils.TableNeverTransitionedToStateException;

import io.grokery.lab.api.common.CloudContext;
import io.grokery.lab.api.common.CommonUtils;
import io.grokery.lab.api.common.ContextCredentialUtil;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.StageTableNameUtil;


public class ServiceBaseClass {

	protected static final Logger logger = LoggerFactory.getLogger(ServiceBaseClass.class);
	private static final Long THROUGHPUT = new Long(5);

	protected final DynamoDBMapper dynamo;
	protected final ObjectMapper objectMapper;


	public ServiceBaseClass() {
		dynamo = this.getDynamoDbMapper(this.getDynamoDbClient());
		objectMapper = MapperUtil.getInstance();
	}

	public ServiceBaseClass(final Class<?> klass) {
		AmazonDynamoDB dynamoClient = this.getDynamoDbClient();
		dynamo = this.getDynamoDbMapper(dynamoClient);

		CreateTableRequest request = dynamo.generateCreateTableRequest(klass);
		request.setProvisionedThroughput(new ProvisionedThroughput(THROUGHPUT, THROUGHPUT));
		if (request.getGlobalSecondaryIndexes() != null) {
			for (final GlobalSecondaryIndex index : request.getGlobalSecondaryIndexes()) {
				index.setProvisionedThroughput(new ProvisionedThroughput(THROUGHPUT, THROUGHPUT));
				index.setProjection(new Projection().withProjectionType(ProjectionType.ALL));
			}
		}
		final String tableName = request.getTableName();
		try {
			dynamoClient.describeTable(tableName);
		} catch (final ResourceNotFoundException e) {
			logger.info("Dynamo db table {} doesn't exist, attempting to create....", tableName);
			dynamoClient.createTable(request);
			try {
				TableUtils.waitUntilActive(dynamoClient, tableName);
			} catch (TableNeverTransitionedToStateException e1) {
				e1.printStackTrace();
			} catch (InterruptedException e1) {
				e1.printStackTrace();
			}
		}

		objectMapper = MapperUtil.getInstance();
	}

	private AmazonDynamoDB getDynamoDbClient() {
		CloudContext context = new CloudContext();
		context.awsAccessKeyId = CommonUtils.getRequiredEnv("API_HOST_AWS_ACCESS_KEY_ID");
		context.awsSecretKey = CommonUtils.getRequiredEnv("API_HOST_AWS_SECRET_KEY");
		context.awsRegion = CommonUtils.getRequiredEnv("API_HOST_AWS_REGION");

		AmazonDynamoDB dynamoClient = AmazonDynamoDBClientBuilder.standard()
				.withCredentials(new ContextCredentialUtil(context))
				.withRegion(context.awsRegion)
				.build();

		return dynamoClient;
	}

	private DynamoDBMapper getDynamoDbMapper(AmazonDynamoDB dynamoClient) {
		Builder configBuilder = DynamoDBMapperConfig.builder();
		configBuilder.withTableNameResolver(new StageTableNameUtil());
		return new DynamoDBMapper(dynamoClient, configBuilder.build());
	}

}