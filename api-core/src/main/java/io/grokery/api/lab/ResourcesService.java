package io.grokery.api.lab;

import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.grokery.api.common.GrokeryContext;
import io.grokery.api.common.exceptions.InvalidInputException;
import io.grokery.api.common.exceptions.NotFoundException;
import io.grokery.api.lab.dao.DAO;
import io.grokery.api.lab.dao.DAOFactory;
import io.grokery.api.lab.resources.Resource;
import io.grokery.api.lab.resources.ResourceTypes;

public class ResourcesService {
	
	private static final Logger logger = LogManager.getLogger(ResourcesService.class);

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
