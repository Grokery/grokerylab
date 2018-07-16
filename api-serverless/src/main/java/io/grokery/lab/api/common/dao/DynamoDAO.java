package io.grokery.lab.api.common.dao;

import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.CredentialProvider;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public abstract class DynamoDAO implements DAO {

	private static final Logger logger = LoggerFactory.getLogger(DynamoDAO.class);

	protected DynamoDB client;

	public DynamoDAO(CloudContext context) {
		logger.info("init new dynamo dao instance");

		client = new DynamoDB(AmazonDynamoDBClientBuilder.standard()
		.withCredentials(new CredentialProvider(
			context.awsAccessKeyId,
			context.awsSecretKey
		))
		.withRegion(context.awsRegion)
		.build());
	}

	protected abstract Table getTable();

	public JsonObj create(String nodeId, JsonObj item) {
		Table table = getTable();
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
		Table table = getTable();
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
		Table table = getTable();
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		table.deleteItem("nodeId", nodeId);
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj retrieve(String nodeId) throws NotFoundException {
		Table table = getTable();
		Item dbItem = table.getItem("nodeId", nodeId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj retrieve() {
		Table table = getTable();

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
