package io.grokery.lab.api.cloud;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.cloud.dao.DAO;
import io.grokery.lab.api.cloud.dao.DAOFactory;
import io.grokery.lab.api.cloud.nodes.Node;

public class NodesService {

	private static final Logger logger = LoggerFactory.getLogger(NodesService.class);

	public static Map<String, Object> create(Map<String, Object> data, CloudContext context) throws InvalidInputException, NotFoundException {
		logger.info("create resource");

		DAO dao = DAOFactory.getDAO(context);

		Node newItem = Node.fromMap(data);
		newItem.validate();
		dao.create(newItem.getNodeId().toString(), Node.toMap(newItem, true));

		newItem.initialize();
		return dao.update(newItem.getNodeId().toString(), Node.toMap(newItem, true));
	}

	public static Map<String, Object> update(Map<String, Object> data, CloudContext context) throws InvalidInputException, NotFoundException {
		logger.info("update resource");

		DAO dao = DAOFactory.getDAO(context);
		Node existing = Node.fromMap(dao.retrieve(data.get(Node.getNodeIdName()).toString()));

		String nodeType = data.getOrDefault(Node.getNodeTypeName(), "").toString();
		if (!nodeType.equals("") && !nodeType.equals(existing.getNodeType().toString())) {
			throw new InvalidInputException();
		}

		String nodeSubType = data.getOrDefault(Node.getNodeSubTypeName(), "").toString();
		if (!nodeSubType.equals("") && !nodeSubType.equals(existing.getSubType().toString())) {
			data.put(Node.getNodeTypeName(), existing.getNodeType());
			Node node = Node.getClassInstance(data);
			node.setNodeId(existing.getNodeId());
			node.setValues(Node.toMap(existing, false));

			existing.decomission();
			dao.delete(existing.getNodeId().toString());

			node.setValues(data);
			node.validate();

			dao.create(node.getNodeId().toString(), Node.toMap(node, true));
			node.initialize();
			return dao.update(existing.getNodeId().toString(), Node.toMap(node, false));
		} else {
			existing.setValues(data);
			existing.validate();
			return dao.update(existing.getNodeId().toString(), Node.toMap(existing, false));
		}
	}

	public static Map<String, Object> delete(String nodeId, CloudContext context) throws NotFoundException, InvalidInputException {
		logger.info("delete resource");

		Node item = null;
		DAO dao = DAOFactory.getDAO(context);
		item = Node.fromMap(dao.retrieve(nodeId));
		item.decomission();

		return dao.delete(nodeId);
	}

	public static Map<String, Object> read(String nodeId, CloudContext context) throws NotFoundException, InvalidInputException {
		logger.info("read resource");

		Node existing = Node.fromMap(DAOFactory.getDAO(context).retrieve(nodeId.toString()));

		return Node.toMap(existing, false);
	}

	public static Map<String, Object> readMultiple(CloudContext context) throws InvalidInputException {
		logger.info("read multiple resource");

		return DAOFactory.getDAO(context).retrieve();
	}

}
