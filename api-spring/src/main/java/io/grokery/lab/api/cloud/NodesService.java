package io.grokery.lab.api.cloud;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.cloud.dao.DAO;
import io.grokery.lab.api.cloud.dao.DAOFactory;
import io.grokery.lab.api.cloud.nodes.Node;

public class NodesService {

	private static final Logger logger = LoggerFactory.getLogger(NodesService.class);

	public static JsonObj create(JsonObj data, CloudContext context) throws InvalidInputException, NotFoundException {
		logger.info("create resource");

		DAO dao = DAOFactory.getDAO(context);

		Node newItem = Node.fromMap(data, context);
		newItem.validateValues();
		dao.create(newItem.getNodeId().toString(), Node.toMap(newItem, true));

		newItem.setupExternalResources(context);
		return dao.update(newItem.getNodeId().toString(), Node.toMap(newItem, true));
	}

	public static JsonObj update(JsonObj data, CloudContext context) throws InvalidInputException, NotFoundException {
		logger.info("update resource");

		DAO dao = DAOFactory.getDAO(context);
		Node existing = Node.fromMap(dao.retrieve(data.get(Node.getNodeIdName()).toString()), context);

		String nodeType = data.getOrDefault(Node.getNodeTypeName(), "").toString();
		if (!nodeType.equals("") && !nodeType.equals(existing.getNodeType().toString())) {
			throw new InvalidInputException();
		}

		String nodeSubType = data.getOrDefault(Node.getNodeSubTypeName(), "").toString();
		if (nodeSubType.equals("") || nodeSubType.equals(existing.getSubType().toString())) {
			existing.updateExternalResources(context, data);
			existing.setValues(data);
			existing.validateValues();
			return dao.update(existing.getNodeId().toString(), Node.toMap(existing, false));
		} else {
			data.put(Node.getNodeTypeName(), existing.getNodeType());
			Node node = Node.getClassInstance(data, context);
			node.setNodeId(existing.getNodeId());
			node.setValues(Node.toMap(existing, false));

			existing.cleanupExternalResources(context);
			dao.delete(existing.getNodeId().toString());

			node.setValues(data);
			node.validateValues();

			dao.create(node.getNodeId().toString(), Node.toMap(node, true));
			node.setupExternalResources(context);
			return dao.update(existing.getNodeId().toString(), Node.toMap(node, false));
		}
	}

	public static JsonObj delete(String nodeId, CloudContext context) throws NotFoundException, InvalidInputException {
		logger.info("delete resource");

		Node item = null;
		DAO dao = DAOFactory.getDAO(context);
		item = Node.fromMap(dao.retrieve(nodeId), context);
		item.cleanupExternalResources(context);

		return dao.delete(nodeId);
	}

	public static JsonObj read(String nodeId, CloudContext context) throws NotFoundException, InvalidInputException {
		logger.info("read resource");

		Node existing = Node.fromMap(DAOFactory.getDAO(context).retrieve(nodeId.toString()), context);

		return Node.toMap(existing, false);
	}

	public static JsonObj readMultiple(CloudContext context) throws InvalidInputException {
		logger.info("read multiple resource");

		return DAOFactory.getDAO(context).retrieve();
	}

}
