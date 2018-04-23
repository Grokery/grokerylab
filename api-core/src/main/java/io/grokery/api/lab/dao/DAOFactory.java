package io.grokery.api.lab.dao;

import io.grokery.api.common.GrokeryContext;

public class DAOFactory {
    
    public static DAO getDAO(GrokeryContext context){
		DAOType resourcesDb = DAOType.valueOf(context.daoType);
		switch(resourcesDb) {
			case DYNAMODB:
				return DynamoDAO.getInstance(context);
			case MONGODB:
				return MongoDAO.getInstance(context);
			case DOCUMENTDB:
				throw new Error("DOCUMENTDB not implemented");
			default:
				throw new Error("Unknown context setting for 'RESOURCES_DB'");
		}
    }

}
