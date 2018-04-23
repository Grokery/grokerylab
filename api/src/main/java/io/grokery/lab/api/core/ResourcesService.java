package io.grokery.lab.api.core;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.core.dao.DAO;
import io.grokery.lab.api.core.dao.DAOFactory;
import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.resources.ResourceTypes;

public class ResourcesService {
	
	private static final Logger logger = LoggerFactory.getLogger(ResourcesService.class);

	public static Map<String, Object> create(Map<String, Object> obj, GrokeryContext context) 
		throws InvalidInputException {

		logger.info("create resource");
		Resource item = Resource.fromMap(obj);
		item.initialize();
		item.validate();
		obj = Resource.RemoveNullValues(Resource.toMap(item));
		return DAOFactory.getDAO(context).create(item.getCollection().toString(), item.getGuid().toString(), obj);
	}
	
	public static Map<String, Object> update(Map<String, Object> obj, GrokeryContext context) 
		throws InvalidInputException, NotFoundException {
		
		logger.info("update resource");
		DAO dao = DAOFactory.getDAO(context);	

		Resource item = Resource.fromMap(obj);
		Resource existing = Resource.fromMap(dao.retrieve(item.getCollection().toString(), item.getGuid().toString()));
		existing.transitionTo(item);
        item.transitionFrom(existing);
        
        obj = Resource.RemoveNullValues(Resource.toMap(item));
        return dao.update(item.getCollection().toString(), item.getGuid().toString(), obj);
	}
	
	public static Map<String, Object> delete(String collection, String guid, GrokeryContext context) 
		throws NotFoundException, InvalidInputException {
		
		logger.info("delete resource");
		Resource item = null;
		DAO dao = DAOFactory.getDAO(context);
		item = Resource.fromMap(dao.retrieve(collection.toUpperCase(), guid));
		item.decomission();
		return dao.delete(collection.toUpperCase(), guid);
	}
	
	public static Map<String, Object> read(String collection, String guid, GrokeryContext context) 
		throws NotFoundException, InvalidInputException {
		
		logger.info("read resource");
		return DAOFactory.getDAO(context).retrieve(collection.toUpperCase(), guid);
	}
	
	public static List<Map<String, Object>> readMultiple(
			String collection, 
			String query,
			int pageNum, 
			int pageSize,
			GrokeryContext context) throws InvalidInputException {
		logger.info("read multiple resource");
		// TODO projections
		ResourceTypes t = ResourceTypes.valueOf(collection.toUpperCase());
		return DAOFactory.getDAO(context).retrieve(t.toString(), query, pageNum, pageSize);
	}
		
}
