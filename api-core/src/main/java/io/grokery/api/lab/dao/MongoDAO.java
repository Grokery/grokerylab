package io.grokery.api.lab.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import io.grokery.api.common.GrokeryContext;
import io.grokery.api.common.exceptions.NotFoundException;
import org.bson.Document;
import static com.mongodb.client.model.Filters.eq;

/**
 * Implements data access interface for MongoDB.
 */
public class MongoDAO implements DAO {

    private MongoDatabase db;
    private static volatile MongoDAO instance;
	
	public static DAO getInstance() {
        synchronized (MongoDAO.class) {
            if (instance == null) {
                instance = new MongoDAO();
            }
        }
        return instance;
    }
	
	public static DAO getInstance(GrokeryContext context) {
		return new MongoDAO(context);
	}
    
    public MongoDAO() {
    		GrokeryContext context = new GrokeryContext();
	    context.mongoDbHost = System.getenv("MONGODB_HOST");
	    context.mongoDbPort = System.getenv("MONGODB_PORT");
	    context.mongoDbName = System.getenv("MONGODB_NAME");
	    context.mongoDbUser = null;
	    context.mongoDbPass = null;
	    init(context);
	}
    
    public MongoDAO(GrokeryContext context) {
    		init(context);
    }
    
    private void init(GrokeryContext context) {
        ArrayList<ServerAddress> addresses = new ArrayList<ServerAddress>();
        addresses.add(new ServerAddress(context.mongoDbHost, Integer.parseInt(context.mongoDbPort)));
		
        MongoClientOptions options = new MongoClientOptions.Builder()
                .connectionsPerHost(100)
                .threadsAllowedToBlockForConnectionMultiplier(10)
                .build();

        @SuppressWarnings("resource")
		MongoClient mongoClient = new MongoClient(addresses, options);
        this.db = mongoClient.getDatabase(context.mongoDbName);
    }

    public Map<String, Object> create(String resourceType, String resourceId, Map<String, Object> item) {
        item.put("_id", resourceId);
        this.db.getCollection(resourceType.toLowerCase()).insertOne(new Document(item));
        item.remove("_id");
        return item;
    }
    
    public Map<String, Object> update(String resourceType, String resourceId, Map<String, Object> values) throws NotFoundException {
        UpdateResult result = this.db.getCollection(resourceType.toLowerCase())
        		.updateOne(eq("_id", resourceId), new Document("$set", new Document(values)));
        if (result.getModifiedCount() == 0) {
        		throw new NotFoundException();
        }
        return null;
    }

    public Map<String, Object> delete(String resourceType, String resourceId) throws NotFoundException {
        DeleteResult deleteResult = this.db.getCollection(resourceType.toLowerCase())
        		.deleteMany(eq("_id", resourceId));
        if (deleteResult.getDeletedCount() == 0) {
        		throw new NotFoundException();
        }
        return null;
    }

    public Map<String, Object> retrieve(String resourceType, String resourceId) throws NotFoundException {
        Document dbModal = this.db.getCollection(resourceType.toLowerCase())
        		.find(eq("_id", resourceId)).first();
        if (dbModal == null) {
        		throw new NotFoundException();
        }
        dbModal.remove("_id");
        return dbModal;
    }

    public List<Map<String, Object>> retrieve(String resourceType, String query, int pageNum, int pageSize) {
    	// TODO query
        final List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        Block<Document> block = new Block<Document>() {
            public void apply(final Document doc) {
                doc.remove("_id");
				result.add(doc);
            }
        };
        this.db.getCollection(resourceType.toLowerCase()).find().skip(pageSize*(pageNum-1)).limit(pageSize).forEach(block);
        return result;
    }
    
}
