package io.grokery.lab.api.common.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class DocumentDAO implements DAO {

	private static final Logger LOG = LoggerFactory.getLogger(DocumentDAO.class);

	public DocumentDAO(CloudContext context) {

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
	public JsonObj get(String hashKey, String rangeKey, String projection) throws NotFoundException {
		return null;
	}
	
	@Override
	public JsonObj query(String hashKey, String query) {
		return null;
	}

	@Override
	public JsonObj query(String hashKey, String query, String projection) {
		return null;
	}

	@Override
	public JsonObj scan(String projection) {
		return null;
	}

	@Override
	public JsonObj query(String hashKey, String query, String projection, int limit) {
		return null;
	}

}
