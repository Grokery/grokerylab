package io.grokery.lab.api.cloud.comments.dao;

import io.grokery.lab.api.common.dao.DAO; import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.dao.DAOType;
import io.grokery.lab.api.common.errors.NotImplementedError;

public class CommentsDAO {

    public static DAO getInst(CloudContext context) {
		DAOType daoType = DAOType.valueOf(context.daoType);
		switch(daoType) {
			case DYNAMODB:
				return new CommentsDynamoDAO(context);
			case MONGODB:
				throw new NotImplementedError("MONGODB not implemented");
			case DOCUMENTDB:
				throw new NotImplementedError("DOCUMENTDB not implemented");
			default:
				throw new Error("Unknown context setting for 'daoType'");
		}
    }

}