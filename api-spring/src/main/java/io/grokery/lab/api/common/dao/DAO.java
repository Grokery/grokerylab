package io.grokery.lab.api.common.dao;

import io.grokery.lab.api.common.exceptions.NotFoundException;
import java.util.Map;

public interface DAO {

    /**
     * Creates an item in the db
     * @param String nodeId
     * @param Map<String, Object> item to create
     * @return Map<String, Object> item as created
     */
    Map<String, Object> create(String nodeId, Map<String, Object> item);

    /**
     * Updates item's (root level) key value pairs
     * @param String nodeId
     * @param Map<String, Object> key value map of (root level) keys to update
     * @return Map<String, Object> item as updated
     * @throws NotFoundException
     */
    Map<String, Object> update(String nodeId, Map<String, Object> values) throws NotFoundException;

    /**
     * Deletes an item from the db
     * @param String nodeId
     * @return Map<String, Object> item
     * @throws NotFoundException
     */
    Map<String, Object> delete(String nodeId) throws NotFoundException;

    /**
     * Retrieves an item from the db
     * @param String nodeId
     * @return Map<String, Object> results keyd by nodeId
     * @throws NotFoundException
     */
    Map<String, Object> retrieve(String nodeId) throws NotFoundException;

    /**
     * Retrieves items from the db
     * @return Map<String, Object> results keyd by nodeId
     * @throws NotFoundException
     */
    Map<String, Object> retrieve();
}
