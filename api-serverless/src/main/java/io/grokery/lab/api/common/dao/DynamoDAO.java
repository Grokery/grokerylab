package io.grokery.lab.api.common.dao;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.CredentialProvider;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public abstract class DynamoDAO implements DAO {

	private static final Logger LOG = LoggerFactory.getLogger(DynamoDAO.class);

	protected DynamoDB client;
	protected Table table;
	protected CloudContext context;

	protected abstract String getTableName();
	protected abstract String getHashKeyName();
	protected abstract String getRangeKeyName();
	protected abstract Table initTable();

	public DynamoDAO(CloudContext context) {
		LOG.info("construct dynamo dao");
		this.context = context;

		this.client = new DynamoDB(AmazonDynamoDBClientBuilder.standard()
			.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
			.withRegion(context.awsRegion)
			.build());

		this.table = this.client.getTable(getTableName());
		try {
			this.table.describe();
		} catch (ResourceNotFoundException e) {
			LOG.info("init dynamo dao table: " + getTableName());
			this.table = initTable();
			Boolean stillWaiting = true;
			int tryCount = 0;
			while (stillWaiting && tryCount < 10) {
				tryCount += 1;
				try {
					Thread.sleep(1000); //milliseconds
					this.table.describe();
					stillWaiting = false;
				} catch (ResourceNotFoundException ex) {
				} catch (InterruptedException ex) {}
			}
		}
	}

	public JsonObj create(String hashKey, String rangeKey, JsonObj data) {
		Item dbItem = new Item();
		Iterator it = data.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry)it.next();
			dbItem.with(pair.getKey().toString(), pair.getValue());
		}
		dbItem.withString(getHashKeyName(), hashKey);
		dbItem.withString(getRangeKeyName(), rangeKey);
		this.table.putItem(dbItem);

		return new JsonObj(dbItem.asMap());
	}

	public JsonObj update(String hashKey, String rangeKey, JsonObj data) throws NotFoundException {
		Item dbItem = this.table.getItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		Iterator it = data.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry)it.next();
			dbItem.with(pair.getKey().toString(), pair.getValue());
		}
		dbItem.withString(getHashKeyName(), hashKey);
		dbItem.withString(getRangeKeyName(), rangeKey);
		this.table.putItem(dbItem);
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj delete(String hashKey, String rangeKey) throws NotFoundException {
		Item dbItem = this.table.getItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		this.table.deleteItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj get(String hashKey, String rangeKey) throws NotFoundException {
		Item dbItem = this.table.getItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		return new JsonObj(dbItem.asMap());
	}

	public List<JsonObj> scan() {
		ItemCollection<ScanOutcome> scanResults = this.table.scan(
			null, // String Filter expression
			null, // "nodeType, hashKey, title, description, x, y, upstream, downstream",// String ProjectionExpression
			null, // Map<String, String> ExpressionAttributeNames
			null // Map<String, Object> ExpressionAttributeValues
			);
		ArrayList<JsonObj> result = new ArrayList<>();
		Iterator<Item> iterator = scanResults.iterator();
		while (iterator.hasNext()) {
			Item item = iterator.next();
			result.add(new JsonObj(item.asMap()));
		}
		return result;
	}

	public List<JsonObj> query(String hashKey) {
		return this.query(hashKey, null);
	}

	public List<JsonObj> query(String hashKey, JsonObj queryParams) {
		String keyConditionExp = "";
		ValueMap valueMap = new ValueMap();
		if (queryParams != null) {
			queryParams.put(this.getHashKeyName(), hashKey);
			Iterator it = queryParams.entrySet().iterator();
			int i = 0;
			while (it.hasNext()) {
				Map.Entry pair = (Map.Entry)it.next();
				keyConditionExp += pair.getKey().toString() + " = :i" + i + " and ";
				valueMap.put(":i" + i, pair.getValue());
				i++;
			}
			keyConditionExp = keyConditionExp.replaceFirst(" and $","");
		}

		QuerySpec query = new QuerySpec()
			.withConsistentRead(true)
			.withScanIndexForward(false);
		if (queryParams != null) {
			query.withKeyConditionExpression(keyConditionExp);
			query.withValueMap(valueMap);
		} else {
			query.withHashKey(getHashKeyName(), hashKey);
		}
		ItemCollection queryResults = this.table.query(query);

		ArrayList<JsonObj> results = new ArrayList<>();
		Iterator<Item> iterator = queryResults.iterator();
		while (iterator.hasNext()) {
			results.add(new JsonObj(iterator.next().asMap()));
		}

		return results;
	}

}
