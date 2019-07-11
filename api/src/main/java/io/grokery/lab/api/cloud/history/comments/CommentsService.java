package io.grokery.lab.api.cloud.history.comments;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.cloud.history.dao.HistoryDAO;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class CommentsService {

	private static final Logger LOG = LoggerFactory.getLogger(CommentsService.class);

	public static JsonObj createComment(String auth, String cloudId, JsonObj request) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		DAO dao = HistoryDAO.getInst(context);
		Comment comment = Comment.fromMap(request, context);
		comment.validateValues();
		JsonObj jsonObj = Comment.toJsonObj(comment, true);
		dao.create(comment.getNodeId(), comment.getCreated(), jsonObj);
		return jsonObj;
	}

	public static JsonObj getCommentsforNode(String auth, String cloudId, String nodeId, String query, String projection, int limit) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		DAO dao = HistoryDAO.getInst(context);
		if (projection == null) {
			projection = "commentId, created, nodeId, userContact, userName, message";
		}
		JsonObj results = dao.query(nodeId, query, projection, limit);
		return results;
	}

}
