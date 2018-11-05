package io.grokery.lab.api.cloud.nodes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.dao.NodesDAO;

public class NodesService {

	private static final Logger LOG = LoggerFactory.getLogger(NodesService.class);

	public static JsonObj create(String auth, String cloudId, String nodeType, JsonObj data) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);

		data.put(Node.getNodeTypeName(), nodeType);
		Node newItem = Node.fromJsonObj(data, context);
		newItem.validateValues();

		DAO dao = NodesDAO.getInst(context);
		dao.create(newItem.getNodeType(), newItem.getNodeId(), newItem.toJsonObj());

		newItem.setupExternalResources(context);

		JsonObj result = dao.update(newItem.getNodeType(), newItem.getNodeId(), newItem.toJsonObj());

		return result;
	}

	public static JsonObj update(String auth, String cloudId, String nodeType, String nodeId, JsonObj data) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);

		DAO dao = NodesDAO.getInst(context);
		Node existing = Node.fromJsonObj(dao.get(nodeType, nodeId), context);

		String nodeSubType = data.getOrDefault(Node.getNodeSubTypeName(), "").toString();
		if (nodeSubType.equals("") || nodeSubType.equals(existing.getSubType().toString())) {
			existing.updateExternalResources(context, data);
			existing.setValues(data);
			existing.validateValues();
			return dao.update(existing.getNodeType(), existing.getNodeId(), existing.toJsonObj());
		} else {
			Node node = Node.getClassInstance(data, context);
			node.setNodeId(existing.getNodeId());
			node.setValues(existing.toJsonObj());
			node.setValues(data);
			node.validateValues();

			existing.cleanupExternalResources(context);
			dao.delete(existing.getNodeType(), existing.getNodeId());

			dao.create(node.getNodeType(), node.getNodeId(), node.toJsonObj());
			node.setupExternalResources(context);
			return dao.update(node.getNodeType(), node.getNodeId(), node.toJsonObj());
		}
	}

	public static JsonObj delete(String auth, String cloudId, String nodeType, String nodeId) throws NotFoundException, InvalidInputException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		
		DAO dao = NodesDAO.getInst(context);
		Node item = Node.fromJsonObj(dao.get(nodeType, nodeId), context);
		item.cleanupExternalResources(context);
		JsonObj result = dao.delete(nodeType, nodeId);
		return result;
	}

	public static JsonObj read(String auth, String cloudId, String nodeType, String nodeId) throws NotFoundException, InvalidInputException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);

		DAO dao = NodesDAO.getInst(context);
		Node existing = Node.fromJsonObj(dao.get(nodeType, nodeId), context);
		return existing.toJsonObj();
	}

	public static JsonObj readAll(String auth, String cloudId) throws InvalidInputException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);

		DAO dao = NodesDAO.getInst(context);
		// String projection = "nodeId, nodeType, title, description, x, y, upstream, downstream";
		JsonObj results = dao.scan(null);
		return results;
	}

}
