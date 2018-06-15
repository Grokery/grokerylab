package io.grokery.lab.api.common.dao;

import io.grokery.lab.api.common.exceptions.NotFoundException;
import java.util.Map;

public interface DAO {

    /**
     * Creates an item in the db
     * @param String resourceType
     * @param String resourceId
     * @param Map<String, Object> item to create
     * @return Map<String, Object> item as created
     */
    Map<String, Object> create(String resourceType, String resourceId, Map<String, Object> item);

    /**
     * Updates item's (root level) key value pairs
     * @param String resourceType
     * @param String resourceId
     * @param Map<String, Object> key value map of (root level) keys to update
     * @return Map<String, Object> item as updated
     * @throws NotFoundException
     */
    Map<String, Object> update(String resourceType, String resourceId, Map<String, Object> values) throws NotFoundException;

    /**
     * Deletes an item from the db
     * @param String resourceType
     * @param String resourceId
     * @return Map<String, Object> item
     * @throws NotFoundException
     */
    Map<String, Object> delete(String resourceType, String resourceId) throws NotFoundException;

    /**
     * Retrieves an item from the db
     * @param String resourceType
     * @param String resourceId
     * @return Map<String, Object> item
     * @throws NotFoundException
     */
    Map<String, Object> retrieve(String resourceType, String resourceId) throws NotFoundException;

    /**
     * Retrieve resource items by type
     * @param String resourceType
     * @return Map<String, Object> containing results keyed on resourceId
     */
    Map<String, Object> retrieve(String resourceType);

}
