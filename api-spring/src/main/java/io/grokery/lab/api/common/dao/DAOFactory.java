package io.grokery.lab.api.common.dao;

import io.grokery.lab.api.common.CloudContext;
import io.grokery.lab.api.common.errors.NotImplementedError;

public class DAOFactory {

    public static DAO getDAO(CloudContext context){
		DAOType resourcesDb = DAOType.valueOf(context.daoType);
		switch(resourcesDb) {
			case DYNAMODB:
				return DynamoDAO.getInstance(context);
			case MONGODB:
				throw new NotImplementedError("MONGODB not implemented");
			case DOCUMENTDB:
				throw new NotImplementedError("DOCUMENTDB not implemented");
			default:
				throw new Error("Unknown context setting for 'daoType'");
		}
    }

}
