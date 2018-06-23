package io.grokery.lab.api.cloud.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.CredentialProvider;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class DynamoDAO implements DAO {

	private static final Logger logger = LoggerFactory.getLogger(DynamoDAO.class);

	private CloudContext context;
	private static volatile DynamoDAO instance;
	private Table table;

	public static DAO getInstance(CloudContext context) {
		logger.info("get dynamo dao instance");
		synchronized (DynamoDAO.class) {
			if(instance == null || !instance.context.equals(context)) {
				instance = new DynamoDAO(context);
			}
		}
		return instance;
	}

	public DynamoDAO(CloudContext context) {
		logger.info("init new dynamo dao instance");
		this.context = context;
		init();
	}

	public void init() {
		 DynamoDB client = new DynamoDB(AmazonDynamoDBClientBuilder.standard()
				.withCredentials(new CredentialProvider(
					this.context.awsAccessKeyId,
					this.context.awsSecretKey
				))
				.withRegion(context.awsRegion)
				.build());

		this.table = client.getTable(context.dynamoTableName);

		try {
			this.table.describe();
		} catch (ResourceNotFoundException e) {

			List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
			keySchema.add(new KeySchemaElement("nodeId", KeyType.HASH));

			List<AttributeDefinition> attrDefs = new ArrayList<AttributeDefinition>();
			attrDefs.add(new AttributeDefinition("nodeId", ScalarAttributeType.S));

			ProvisionedThroughput tput = new ProvisionedThroughput(new Long(10), new Long(10));

			client.createTable(context.dynamoTableName, keySchema, attrDefs, tput);
		}
	}

	public Map<String, Object> create(String nodeId, Map<String, Object> item) {
		Item dbItem = new Item();
		Iterator it = item.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry)it.next();
			dbItem.with(pair.getKey().toString(), pair.getValue());
		}
		dbItem.withString("nodeId", nodeId);
		table.putItem(dbItem);
		return dbItem.asMap();
	}

	public Map<String, Object> update(String nodeId, Map<String, Object> values) throws NotFoundException {
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		Iterator it = values.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry)it.next();
			dbItem.with(pair.getKey().toString(), pair.getValue());
		}
		dbItem.withString("nodeId", nodeId);
		table.putItem(dbItem);
		return dbItem.asMap();
	}

	public Map<String, Object> delete(String nodeId) throws NotFoundException {
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		table.deleteItem("nodeId", nodeId);
		return dbItem.asMap();
	}

	public Map<String, Object> retrieve(String nodeId) throws NotFoundException {
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		return dbItem.asMap();
	}

	public Map<String, Object> retrieve() {

		ItemCollection<ScanOutcome> scanResults = table.scan(
        	null, // Filter expression
            null, // ProjectionExpression
            null, // ExpressionAttributeNames
            null // ExpressionAttributeValues
            );

		Map<String, Object> result = new HashMap<String, Object>();
		Iterator<Item> iterator = scanResults.iterator();
        while (iterator.hasNext()) {
        	Item item = iterator.next();
			result.put(item.get("nodeId").toString(), item.asMap());
		}

		return result;
	}

}
