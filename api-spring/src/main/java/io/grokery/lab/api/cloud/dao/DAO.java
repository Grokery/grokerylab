package io.grokery.lab.api.cloud.dao;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public interface DAO {

    /**
     * Creates an item in the db
     * @param String id
     * @param JsonObj item to create
     * @return JsonObj item as created
     */
    JsonObj create(String id, JsonObj item);

    /**
     * Updates item's (root level) key/value pairs
     * @param String id
     * @param JsonObj key value map of (root level) keys to update
     * @return JsonObj item as updated
     * @throws NotFoundException
     */
    JsonObj update(String id, JsonObj values) throws NotFoundException;

    /**
     * Deletes an item from the db
     * @param String id
     * @return JsonObj item
     * @throws NotFoundException
     */
    JsonObj delete(String id) throws NotFoundException;

    /**
     * Retrieves an item from the db
     * @param String id
     * @return JsonObj results keyd by id
     * @throws NotFoundException
     */
    JsonObj retrieve(String id) throws NotFoundException;

    /**
     * Retrieves items from the db
     * @return JsonObj results keyd by id
     * @throws NotFoundException
     */
    JsonObj retrieve();
}
