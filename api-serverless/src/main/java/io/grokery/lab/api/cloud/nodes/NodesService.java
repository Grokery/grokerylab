package io.grokery.lab.api.cloud.nodes;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.dao.NodesDAO;

public class NodesService {

	private static final Logger LOG = LoggerFactory.getLogger(NodesService.class);

	public static JsonObj create(JsonObj data, CloudContext context) throws InvalidInputException, NotFoundException {
		LOG.info("create resource");

		DAO dao = NodesDAO.getInst(context);
		Node newItem = Node.from(data, context);
		newItem.validateValues();
		dao.create(newItem.getNodeType(), newItem.getNodeId(), newItem.to());

		newItem.setupExternalResources(context);
		JsonObj result = dao.update(newItem.getNodeType(), newItem.getNodeId(), newItem.to());

		return result;
	}

	public static JsonObj update(JsonObj data, CloudContext context) throws InvalidInputException, NotFoundException {
		LOG.info("update resource");

		DAO dao = NodesDAO.getInst(context);
		String nodeType = data.getString(Node.getNodeTypeName());
		String nodeId = data.getString(Node.getNodeIdName());
		Node existing = Node.from(dao.get(nodeType, nodeId), context);

		String nodeSubType = data.getOrDefault(Node.getNodeSubTypeName(), "").toString();
		if (nodeSubType.equals("") || nodeSubType.equals(existing.getSubType().toString())) {
			existing.updateExternalResources(context, data);
			existing.setValues(data);
			existing.validateValues();
			return dao.update(existing.getNodeType(), existing.getNodeId(), existing.to());
		} else {
			Node node = Node.getClassInstance(data, context);
			node.setNodeId(existing.getNodeId());
			node.setValues(existing.to());
			node.setValues(data);
			node.validateValues();

			existing.cleanupExternalResources(context);
			dao.delete(existing.getNodeType(), existing.getNodeId());

			dao.create(node.getNodeType(), node.getNodeId(), node.to());
			node.setupExternalResources(context);
			return dao.update(node.getNodeType(), node.getNodeId(), node.to());
		}
	}

	public static JsonObj delete(String nodeType, String nodeId, CloudContext context) throws NotFoundException, InvalidInputException {
		LOG.info("delete resource");
		DAO dao = NodesDAO.getInst(context);
		Node item = Node.from(dao.get(nodeType, nodeId), context);
		item.cleanupExternalResources(context);
		JsonObj result = dao.delete(nodeType, nodeId);
		return result;
	}

	public static JsonObj read(String nodeType, String nodeId, CloudContext context) throws NotFoundException, InvalidInputException {
		LOG.info("read resource");
		DAO dao = NodesDAO.getInst(context);
		Node existing = Node.from(dao.get(nodeType, nodeId), context);
		return existing.to();
	}

	public static JsonObj readAll(CloudContext context) throws InvalidInputException {
		LOG.info("read multiple resource");
		DAO dao = NodesDAO.getInst(context);
		List<JsonObj> results = dao.scan();
		JsonObj result = new JsonObj();
		for(JsonObj item : results) {
			result.put(item.getString(Node.getNodeIdName()), item);
		}
		return result;
	}

}
