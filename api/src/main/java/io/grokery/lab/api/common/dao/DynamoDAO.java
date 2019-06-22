package io.grokery.lab.api.common.dao;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.NameMap;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.nodes.Node;
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
		LOG.info("Construct dynamo dao");
		this.context = context;

		this.client = new DynamoDB(AmazonDynamoDBClientBuilder.standard()
			.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
			.withRegion(context.awsRegion)
			.build());

		this.table = this.client.getTable(getTableName());
		try {
			this.table.describe();
		} catch (ResourceNotFoundException e) {
			try {
				LOG.info("Attempting to create table: " + getTableName());
				this.table = initTable();
				table.waitForActive();
			}
			catch (Exception ex) {
				LOG.error("Unable to create table: ", ex);
			}
		}
	}

	public JsonObj create(String hashKey, String rangeKey, JsonObj data) {
		LOG.info("create {}/{}", hashKey, rangeKey);
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
		LOG.info("update {}/{}", hashKey, rangeKey);
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
		LOG.info("delete {}/{}", hashKey, rangeKey);
		Item dbItem = this.table.getItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		this.table.deleteItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj get(String hashKey, String rangeKey) throws NotFoundException {
		return this.get(hashKey, rangeKey, null);
	}

	public JsonObj get(String hashKey, String rangeKey, String projection) throws NotFoundException {
		Item dbItem = this.table.getItem(getHashKeyName(), hashKey, getRangeKeyName(), rangeKey);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		return new JsonObj(dbItem.asMap());
	}

	public JsonObj scan(String projection) {
		String projectionExp = null;
		NameMap nameMap = null;
		if (projection != null) {
			projectionExp = "";
			nameMap = new NameMap();
			Iterator it = Arrays.asList(projection.split(",")).iterator();
			int i = 0;
			while (it.hasNext()) {
				String k = it.next().toString().trim();
				projectionExp += "#" + i;
				if (it.hasNext()) {
					projectionExp += ", ";
				}
				nameMap.put("#" + i, k);
				i++;
			}
		}
		ItemCollection<ScanOutcome> scanResults = this.table.scan(
			null,
			projectionExp,
			nameMap,
			null
			);
			JsonObj results = new JsonObj();
			Iterator<Item> iterator = scanResults.iterator();
			while (iterator.hasNext()) {
				Item item = iterator.next();
				Map<String, Object> m = item.asMap();
				results.put(item.getString(Node.getNodeIdName()), new JsonObj(m));
			}
			JsonObj result = new JsonObj();
			result.put("data", results);
			result.put("count", results.size());
			return result;
	}

	public JsonObj query(String hashKey, String query) {
		return this.query(hashKey, query, null, 0);
	}

	public JsonObj query(String hashKey, String query, String projection) {
		return this.query(hashKey, query, null, 0);
	}

	public JsonObj query(String hashKey, String query, String projection, int limit) {
		QuerySpec spec = new QuerySpec()
			.withConsistentRead(true)
			.withScanIndexForward(false);	
		if (query != null) {
			query = getHashKeyName() + " = " + hashKey + " and " + query;
			String keyConditionExp = "";
			ValueMap valueMap = new ValueMap();
			NameMap nameMap = new NameMap();
			int i = 0;
			Iterator it = Arrays.asList(query.split("\\s")).iterator();
			while (it.hasNext()) {
				String k = it.next().toString();
				String o = it.next().toString();
				String v = it.next().toString();
				keyConditionExp += "#" + i + " " + o + " :" + i;
				if (it.hasNext()) {
					keyConditionExp += " " + it.next().toString() + " ";
				}
				nameMap.put("#" + i, k);
				valueMap.put(":" + i, v);
				i++;
			}
			spec.withKeyConditionExpression(keyConditionExp);
			spec.withNameMap(nameMap);
			spec.withValueMap(valueMap);
		} else {
			spec.withHashKey(getHashKeyName(), hashKey);
		}

		if (projection != null) {
			spec.withProjectionExpression(projection);
		}

		if (limit > 0) {
			spec.withMaxResultSize(limit);
		}

		ItemCollection queryResults = this.table.query(spec);
		ArrayList<JsonObj> results = new ArrayList<>();
		Iterator<Item> iterator = queryResults.iterator();
		while (iterator.hasNext()) {
			results.add(new JsonObj(iterator.next().asMap()));
		}

		JsonObj result = new JsonObj();
		result.put("data", results);
		result.put("count", results.size());
		return result;
	}

}
