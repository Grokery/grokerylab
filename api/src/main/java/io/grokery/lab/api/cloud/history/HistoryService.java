package io.grokery.lab.api.cloud.history;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.cloud.history.dao.HistoryDAO;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class HistoryService {

	private static final Logger LOG = LoggerFactory.getLogger(HistoryService.class);

	public static JsonObj queryHistoryItems(String auth, String cloudId, String nodeId, String query, String projection, int limit) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		LOG.info("getHistoryItems query={} projection={}", query, projection);
		DAO dao = HistoryDAO.getInst(context);
		JsonObj results = dao.query(nodeId, query, projection, limit);
		return results;
	}

	public static JsonObj getHistoryItemDetails(String auth, String cloudId, String nodeId, String created, String projection) throws NotAuthorizedException, NotFoundException {
		CloudContext context = new CloudContext(cloudId, auth);
		DAO dao = HistoryDAO.getInst(context);
		JsonObj result = dao.get(nodeId, created, projection);
		return result;
	}

}
