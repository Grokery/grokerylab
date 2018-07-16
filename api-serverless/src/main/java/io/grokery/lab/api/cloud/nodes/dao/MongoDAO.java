package io.grokery.lab.api.cloud.nodes.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class MongoDAO implements DAO {

	private static final Logger logger = LoggerFactory.getLogger(MongoDAO.class);

	private CloudContext context;
	private static volatile MongoDAO instance;

	public static DAO getInstance(CloudContext context) {
		logger.info("get dao instance");
		synchronized (MongoDAO.class) {
			if(instance == null || !instance.context.equals(context)) {
				instance = new MongoDAO(context);
			}
		}
		return instance;
	}

	public MongoDAO(CloudContext context) {
		logger.info("init new dao instance");
		this.context = context;
		init(context);
	}

	public void init(CloudContext context) {

	}

	public JsonObj create(String nodeId, JsonObj item) {

		return new JsonObj();
	}

	public JsonObj update(String nodeId, JsonObj values) throws NotFoundException {

		return new JsonObj();
	}

	public JsonObj delete(String nodeId) throws NotFoundException {

		return new JsonObj();
	}

	public JsonObj retrieve(String nodeId) throws NotFoundException {

		return new JsonObj();
	}

	public JsonObj retrieve() {

		return new JsonObj();
	}

}
