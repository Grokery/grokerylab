package io.grokery.lab.api.cloud.dao;

import java.util.ArrayList;
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
import io.grokery.lab.api.common.JsonObj;
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
		init(context);
	}

	public void init(CloudContext context) {
		 DynamoDB client = new DynamoDB(AmazonDynamoDBClientBuilder.standard()
				.withCredentials(new CredentialProvider(
					this.context.awsAccessKeyId,
					this.context.awsSecretKey
				))
				.withRegion(context.awsRegion)
				.build());

		this.table = client.getTable(getDynamoTableName(context));

		try {
			this.table.describe();
		} catch (ResourceNotFoundException e) {

			List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
			keySchema.add(new KeySchemaElement("nodeId", KeyType.HASH));

			List<AttributeDefinition> attrDefs = new ArrayList<AttributeDefinition>();
			attrDefs.add(new AttributeDefinition("nodeId", ScalarAttributeType.S));

			ProvisionedThroughput tput = new ProvisionedThroughput(new Long(10), new Long(10));

			client.createTable(getDynamoTableName(context), keySchema, attrDefs, tput);
		}
	}

	private String getDynamoTableName(CloudContext context) {
		return "grokery-nodes";
	}

	public JsonObj create(String nodeId, JsonObj item) {
		Item dbItem = new Item();
		Iterator it = item.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry)it.next();
			dbItem.with(pair.getKey().toString(), pair.getValue());
		}
		dbItem.withString("nodeId", nodeId);
		table.putItem(dbItem);

		return new JsonObj(dbItem.asMap());
	}

	public JsonObj update(String nodeId, JsonObj values) throws NotFoundException {
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
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj delete(String nodeId) throws NotFoundException {
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		table.deleteItem("nodeId", nodeId);
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj retrieve(String nodeId) throws NotFoundException {
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj retrieve() {

		ItemCollection<ScanOutcome> scanResults = table.scan(
        	null, // Filter expression
            null, // "nodeType, nodeId, title, description, x, y, upstream, downstream", // ProjectionExpression
            null, // ExpressionAttributeNames
            null // ExpressionAttributeValues
            );

		JsonObj result = new JsonObj();
		Iterator<Item> iterator = scanResults.iterator();
        while (iterator.hasNext()) {
        	Item item = iterator.next();
			result.put(item.getString("nodeId"), item.asMap());
		}

		return result;
	}

}
