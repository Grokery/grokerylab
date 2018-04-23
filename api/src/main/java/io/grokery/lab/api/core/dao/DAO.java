package io.grokery.lab.api.core.dao;

import io.grokery.lab.api.common.exceptions.NotFoundException;
import java.util.List;
import java.util.Map;

/**
 * Defines the basic operations that a data access object is expected to have
 */
public interface DAO {

    /**
     * Creates an item
     * @param String resourceType
     * @param String resourceId
     * @param Map<String, Object> item
     */
	Map<String, Object> create(String resourceType, String resourceId, Map<String, Object> item);

    /**
     * Updates an item
     * @param String resourceType
     * @param String resourceId
     * @param Map<String, Object> item
     * @throws NotFoundException 
     */
    Map<String, Object> update(String resourceType, String resourceId, Map<String, Object> item) throws NotFoundException;

    /**
     * Deletes an item (or assures item does not exist for resourceType / resourceId values).
     * @param String resourceType
     * @param String resourceId
     * @throws NotFoundException 
     */
    Map<String, Object> delete(String resourceType, String resourceId) throws NotFoundException;

    /**
     * Retrieves an item
     * @param String resourceType
     * @param String resourceId
     * @param Map<String, Object> item
     * @throws NotFoundException 
     */
    Map<String, Object> retrieve(String resourceType, String resourceId) throws NotFoundException;

    /**
     * Retrieve multiple items as paged results
     * @param String resourceType
     * @param String query
     * @param int pageNum page number to return
     * @param int pageSize as number of items to return per page
     * @return List of Map<String, Object> items of 'pageSize' length starting at index (pageNum - 1) * pageSize of results of query
     */
    List<Map<String, Object>> retrieve(String resourceType, String query, int pageNum, int pageSize);
    
}
