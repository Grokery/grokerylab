package io.grokery.lab.api.cloud.history.dao;

import java.util.ArrayList;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;

import io.grokery.lab.api.common.dao.DynamoDAO;
import io.grokery.lab.api.common.context.CloudContext;

public class HistoryDynamoDAO extends DynamoDAO {

	@Override
	protected String getHashKeyName() {
		return "nodeId";
	}

	@Override
	protected String getRangeKeyName() {
		return "created";
	}

	@Override
	protected String getTableName() {
		return "history-" + this.context.cloudId;
	}

	@Override
	protected Table initTable() {
		ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
		attributeDefinitions.add(new AttributeDefinition()
			.withAttributeName(this.getHashKeyName())
			.withAttributeType("S"));
		attributeDefinitions.add(new AttributeDefinition()
			.withAttributeName(this.getRangeKeyName())
			.withAttributeType("S"));
		// attributeDefinitions.add(new AttributeDefinition()
		// 	.withAttributeName("Precipitation")
		// 	.withAttributeType("N"));
		// other attributes can be added here
		
		ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
		tableKeySchema.add(new KeySchemaElement(this.getHashKeyName(), KeyType.HASH));
		tableKeySchema.add(new KeySchemaElement(this.getRangeKeyName(), KeyType.RANGE));
		
		// GlobalSecondaryIndex precipIndex = new GlobalSecondaryIndex()
		// 	.withIndexName("PrecipIndex")
		// 	.withProvisionedThroughput(new ProvisionedThroughput(new Long(10), new Long(10)))
		// 	.withProjection(new Projection().withProjectionType(ProjectionType.ALL));

		// ArrayList<KeySchemaElement> indexKeySchema = new ArrayList<KeySchemaElement>();
		// indexKeySchema.add(new KeySchemaElement(this.getHashKeyName(), KeyType.HASH));
		// indexKeySchema.add(new KeySchemaElement("Precipitation", KeyType.RANGE));
		// precipIndex.setKeySchema(indexKeySchema);
		
		Table table = this.client.createTable(new CreateTableRequest()
			.withTableName(this.getTableName())
			.withProvisionedThroughput(new ProvisionedThroughput(new Long(10), new Long(10)))
			.withAttributeDefinitions(attributeDefinitions)
			.withKeySchema(tableKeySchema)
			// .withGlobalSecondaryIndexes(precipIndex)
		);
		return table;
	}

	public HistoryDynamoDAO(CloudContext context) {
		super(context);
	}

}
