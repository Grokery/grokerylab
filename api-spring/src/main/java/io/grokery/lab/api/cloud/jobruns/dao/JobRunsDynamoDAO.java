package io.grokery.lab.api.cloud.jobruns.dao;

import java.util.ArrayList;
import java.util.List;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;

import io.grokery.lab.api.common.dao.DynamoDAO;
import io.grokery.lab.api.common.context.CloudContext;

public class JobRunsDynamoDAO extends DynamoDAO {

	@Override
	protected String getHashKeyName() {
		return "jobId";
	}

	@Override
	protected String getRangeKeyName() {
		return "startTime";
	}

	@Override
	protected String getTableName() {
		return this.context.cloudId + "-jobruns";
	}

	@Override
	protected Table initTable() {
		List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
		keySchema.add(new KeySchemaElement(getHashKeyName(), KeyType.HASH));
		keySchema.add(new KeySchemaElement(getRangeKeyName(), KeyType.RANGE));

		List<AttributeDefinition> attrDefs = new ArrayList<AttributeDefinition>();
		attrDefs.add(new AttributeDefinition(getHashKeyName(), ScalarAttributeType.S));
		attrDefs.add(new AttributeDefinition(getRangeKeyName(), ScalarAttributeType.S));

		ProvisionedThroughput tput = new ProvisionedThroughput(new Long(10), new Long(10));

		return this.client.createTable(getTableName(), keySchema, attrDefs, tput);
	}

	public JobRunsDynamoDAO(CloudContext context) {
		super(context);
	}

}
