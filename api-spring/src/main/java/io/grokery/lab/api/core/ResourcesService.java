package io.grokery.lab.api.core;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.common.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.dao.DAOFactory;
import io.grokery.lab.api.core.resources.Resource;

public class ResourcesService {

	private static final Logger logger = LoggerFactory.getLogger(ResourcesService.class);

	public static Map<String, Object> create(Map<String, Object> obj, CloudContext context)
		throws InvalidInputException {

		logger.info("create resource");
		Resource item = Resource.fromMap(obj);
		item.initialize();
		item.validate();
		obj = Resource.toMap(item, true);
		return DAOFactory.getDAO(context).create(item.getCollection().toString(), item.getGuid().toString(), obj);
	}

	public static Map<String, Object> update(Map<String, Object> obj, CloudContext context)
		throws InvalidInputException, NotFoundException {

		logger.info("update resource");
		DAO dao = DAOFactory.getDAO(context);

		Resource item = Resource.fromMap(obj);
		Resource existing = Resource.fromMap(dao.retrieve(item.getCollection().toString(), item.getGuid().toString()));
		existing.transitionTo(item);
        item.transitionFrom(existing);

        obj = Resource.toMap(item, true);
        return dao.update(item.getCollection().toString(), item.getGuid().toString(), obj);
	}

	public static Map<String, Object> delete(String collection, String guid, CloudContext context)
		throws NotFoundException, InvalidInputException {

		logger.info("delete resource");
		Resource item = null;
		DAO dao = DAOFactory.getDAO(context);
		item = Resource.fromMap(dao.retrieve(collection.toUpperCase(), guid));
		item.decomission();
		return dao.delete(collection.toUpperCase(), guid);
	}

	public static Map<String, Object> read(String collection, String guid, CloudContext context)
		throws NotFoundException, InvalidInputException {

		logger.info("read resource");
		return DAOFactory.getDAO(context).retrieve(collection.toUpperCase(), guid);
	}

	public static Map<String, Object> readMultiple(
			String collection,
			CloudContext context) throws InvalidInputException {

		logger.info("read multiple resource");
		return DAOFactory.getDAO(context).retrieve(collection.toUpperCase());
	}

}
