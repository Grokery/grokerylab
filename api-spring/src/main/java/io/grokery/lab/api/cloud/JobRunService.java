package io.grokery.lab.api.cloud;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JobRunService {

	private static final Logger logger = LoggerFactory.getLogger(JobRunService.class);

	// public static Map<String, Object> create(Map<String, Object> obj, CloudContext context)
	// 	throws InvalidInputException {

	// 	logger.info("create resource");
	// 	Node item = Node.fromMap(obj);
	// 	item.setupExternalResources();
	// 	item.validateValues();
	// 	obj = Node.toMap(item, true);
	// 	return DAOFactory.getDAO(context).create(item.getNodeId().toString(), obj);
	// }

	// public static Map<String, Object> update(Map<String, Object> obj, CloudContext context)
	// 	throws InvalidInputException, NotFoundException {

	// 	logger.info("update resource");
	// 	DAO dao = DAOFactory.getDAO(context);

	// 	Node item = Node.fromMap(obj);
	// 	Node existing = Node.fromMap(dao.retrieve(item.getNodeId().toString()));
	// 	existing.transitionTo(item);
    //     item.transitionFrom(existing);

    //     obj = Node.toMap(item, true);
    //     return dao.update(item.getNodeId().toString(), obj);
	// }

	// public static Map<String, Object> delete(String nodeId, CloudContext context)
	// 	throws NotFoundException, InvalidInputException {

	// 	logger.info("delete resource");
	// 	Node item = null;
	// 	DAO dao = DAOFactory.getDAO(context);
	// 	item = Node.fromMap(dao.retrieve(nodeId));
	// 	item.cleanupExternalResources();
	// 	return dao.delete(nodeId);
	// }

	// public static Map<String, Object> read(String nodeId, CloudContext context)
	// 	throws NotFoundException, InvalidInputException {

	// 	logger.info("read resource");
	// 	return DAOFactory.getDAO(context).retrieve(nodeId);
	// }

	// public static Map<String, Object> readMultiple(
	// 		CloudContext context) throws InvalidInputException {

	// 	logger.info("read multiple resource");
	// 	return DAOFactory.getDAO(context).retrieve();
	// }

}
