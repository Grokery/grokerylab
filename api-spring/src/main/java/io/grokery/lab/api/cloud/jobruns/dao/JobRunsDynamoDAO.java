package io.grokery.lab.api.cloud.jobruns.dao;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.dao.DynamoDAO;

public class JobRunsDynamoDAO extends DynamoDAO {

	private static final Logger logger = LoggerFactory.getLogger(JobRunsDynamoDAO.class);
	private static final String TABLENAME = "grokery-jobruns";
	private Table table;

	public JobRunsDynamoDAO(CloudContext context) {
		super(context);
		logger.info("init new jobruns dynamo dao instance");

		this.table = getTable();
		try {
			this.table.describe();
		} catch (ResourceNotFoundException e) {
			List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
			keySchema.add(new KeySchemaElement("nodeId", KeyType.HASH));

			List<AttributeDefinition> attrDefs = new ArrayList<AttributeDefinition>();
			attrDefs.add(new AttributeDefinition("nodeId", ScalarAttributeType.S));

			ProvisionedThroughput tput = new ProvisionedThroughput(new Long(10), new Long(10));

			this.table = client.createTable(TABLENAME, keySchema, attrDefs, tput);

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

	@Override
	protected Table getTable() {
		return client.getTable(TABLENAME);
	}

}
