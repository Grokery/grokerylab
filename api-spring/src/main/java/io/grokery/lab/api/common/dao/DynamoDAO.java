package io.grokery.lab.api.common.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.regions.Regions;
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

import io.grokery.lab.api.common.ContextCredentialUtil;
import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.exceptions.NotFoundException;

/**
 * Implements data access interface for DynamoDAO.
 */
public class DynamoDAO implements DAO {

	private static final Logger logger = LoggerFactory.getLogger(DynamoDAO.class);
	
	private GrokeryContext context;
	private static volatile DynamoDAO instance;
	private Table table;
	
	public static DAO getInstance(GrokeryContext context) {
		logger.info("get dynamo dao instance");
		synchronized (DynamoDAO.class) {
			if(instance == null || !context.equals(context)) {
				instance = new DynamoDAO(context);
			}
		}
		return instance;
	}
	
	public DynamoDAO(GrokeryContext context) {
		logger.info("init new dynamo dao instance");
		this.context = context;
		init();
	}
	
	public void init() {
		DynamoDB client = null;

		client = new DynamoDB(AmazonDynamoDBClientBuilder.standard()
				.withCredentials(new ContextCredentialUtil(context))
				.withRegion(Regions.valueOf(context.awsRegion))
				.build());

		table = client.getTable(context.dynamoTableName);
		
		// Check that table exists by calling describe
		try {
			table.describe();
		} catch (ResourceNotFoundException e) {
			
			List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
			keySchema.add(new KeySchemaElement("resourceType", KeyType.HASH));
			keySchema.add(new KeySchemaElement("resourceId", KeyType.RANGE));
			
			List<AttributeDefinition> attrDefs = new ArrayList<AttributeDefinition>();
			attrDefs.add(new AttributeDefinition("resourceType", ScalarAttributeType.S));
			attrDefs.add(new AttributeDefinition("resourceId", ScalarAttributeType.S));
			
			// TODO  make throughput configurable by env var
			ProvisionedThroughput tput = new ProvisionedThroughput(new Long(10), new Long(10));
			
			client.createTable(context.dynamoTableName, keySchema, attrDefs, tput);
		}
	}
	
	public Map<String, Object> create(String resourceType, String resourceId, Map<String, Object> item) {
		Item dbItem = new Item();
		dbItem.withString("resourceType", resourceType);
		dbItem.withString("resourceId", resourceId);
		dbItem.withMap("item", item);
		table.putItem(dbItem);
		return item;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> update(String resourceType, String resourceId, Map<String, Object> values) throws NotFoundException {
		Item dbItem = table.getItem("resourceType", resourceType, "resourceId", resourceId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		Map<String, Object> item = (Map<String, Object>) dbItem.get("item");
		item.putAll(values);
		dbItem.withMap("item", item);
		table.putItem(dbItem);
		return item;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object>  delete(String resourceType, String resourceId) throws NotFoundException {
		Item dbItem = table.getItem("resourceType", resourceType, "resourceId", resourceId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		table.deleteItem("resourceType", resourceType, "resourceId", resourceId);
		return (Map<String, Object>) dbItem.get("item");
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> retrieve(String resourceType, String resourceId) throws NotFoundException {
		Item dbItem = table.getItem("resourceType", resourceType, "resourceId", resourceId);
		if (dbItem == null) {
			throw new NotFoundException();
		}
		return (Map<String, Object>) dbItem.get("item");
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> retrieve(String resourceType, Map<String, String> filter, String startId) {
        // TODO implement query
		// TODO implement pagination (pre scan for index?)
		ItemCollection<ScanOutcome> scanResults = table.scan(
        	null, // Filter expression
            null, // ProjectionExpression
            null, // ExpressionAttributeNames
            null // ExpressionAttributeValues
            );

		Map<String, Object> result = new HashMap<String, Object>();
		ArrayList<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
        Iterator<Item> iterator = scanResults.iterator();
        while (iterator.hasNext()) {
        	Item item = iterator.next();
            items.add((Map<String, Object>)item.get("item"));
        }
        
		return result;
	}

}
