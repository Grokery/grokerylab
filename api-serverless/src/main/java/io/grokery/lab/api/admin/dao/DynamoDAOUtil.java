package io.grokery.lab.api.admin.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import io.grokery.lab.api.common.CommonUtils;
import io.grokery.lab.api.common.CredentialProvider;


public class DynamoDAOUtil {

	protected static final Logger logger = LoggerFactory.getLogger(DynamoDAOUtil.class);
	private static final Long THROUGHPUT = new Long(5);

	private DynamoDBMapper dynamo;

	public DynamoDBMapper getDAO() {
		return dynamo;
	}

	public DynamoDAOUtil() {
		dynamo = this.getDynamoDbMapper(this.getDynamoDbClient());
	}

	public DynamoDAOUtil(final Class<?> klass) {
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
	}

	private AmazonDynamoDB getDynamoDbClient() {
		return AmazonDynamoDBClientBuilder.standard()
				.withCredentials(new CredentialProvider(
					CommonUtils.getRequiredEnv("API_HOST_AWS_ACCESS_KEY_ID"),
					CommonUtils.getRequiredEnv("API_HOST_AWS_SECRET_KEY")
				))
				.withRegion(CommonUtils.getRequiredEnv("API_HOST_AWS_REGION"))
				.build();
	}

	private DynamoDBMapper getDynamoDbMapper(AmazonDynamoDB dynamoClient) {
		Builder configBuilder = DynamoDBMapperConfig.builder();
		configBuilder.withTableNameResolver(new StageTableNameUtil());
		return new DynamoDBMapper(dynamoClient, configBuilder.build());
	}

}