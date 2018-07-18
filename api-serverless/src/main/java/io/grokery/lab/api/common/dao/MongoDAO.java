package io.grokery.lab.api.common.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class MongoDAO implements DAO {

	private static final Logger LOG = LoggerFactory.getLogger(MongoDAO.class);

	public MongoDAO(CloudContext context) {

	}

	@Override
	public JsonObj create(String hashKey, String rangeKey, JsonObj data) {
		return null;
	}

	@Override
	public JsonObj update(String hashKey, String rangeKey, JsonObj data) throws NotFoundException {
		return null;
	}

	@Override
	public JsonObj delete(String hashKey, String rangeKey) throws NotFoundException {
		return null;
	}

	@Override
	public JsonObj get(String hashKey, String rangeKey) throws NotFoundException {
		return null;
	}

	@Override
	public List<JsonObj> scan() {
		return null;
	}


}
