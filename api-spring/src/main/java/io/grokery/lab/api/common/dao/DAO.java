package io.grokery.lab.api.common.dao;

import java.util.List;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public interface DAO {

    /**
     * Creates an item in the table
     * @param String hashKey
     * @param String rangeKey
     * @param JsonObj item data
     * @return JsonObj item as created
     */
    public JsonObj create(String hashKey, String rangeKey, JsonObj data);

    /**
     * Updates item's (root level) key/value pairs
     * @param String hashKey
     * @param String rangeKey
     * @param JsonObj data as key value map of (root level) keys to update
     * @return JsonObj item as updated
     * @throws NotFoundException
     */
    public JsonObj update(String hashKey, String rangeKey, JsonObj data) throws NotFoundException;

    /**
     * Deletes an item from the table
     * @param String hashKey
     * @param String rangeKey
     * @return JsonObj item
     * @throws NotFoundException
     */
    public JsonObj delete(String hashKey, String rangeKey) throws NotFoundException;

    /**
     * Gets an item from the table
     * @param String hashKey
     * @param String rangeKey
     * @return JsonObj results keyd by id
     * @throws NotFoundException
     */
    public JsonObj get(String hashKey, String rangeKey) throws NotFoundException;

    /**
     * Gets all items from the table
     * @return List<JsonObj>
     */
    List<JsonObj> scan();

    /**
     * Gets all items from the table for a given hashKey
     * @return List<JsonObj>
     */
    List<JsonObj> query(String hashKey);
}
