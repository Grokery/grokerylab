package io.grokery.lab.api.common;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class JsonObj extends HashMap<String, Object> {

    private static final long serialVersionUID = 9105136437859359152L;

    public JsonObj() {
        super();
    }

    public JsonObj(Map<String, Object> other) {
        Iterator it = other.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            this.put(pair.getKey().toString(), pair.getValue());
        }
    }

    public void putJsonObj(String key, JsonObj value) {
        this.put(key, value);
    }
    public JsonObj getJsonObj(String key) {
        return (JsonObj) this.get(key);
    }
    public JsonObj getJsonObj(String key, JsonObj defaultValue) {
        return (JsonObj) this.getOrDefault(key, defaultValue);
    }

    public void putString(String key, String value) {
        this.put(key, value);
    }
    public String getString(String key) {
        return (String) this.get(key);
    }
    public String getString(String key, String defaultValue) {
        return (String) this.getOrDefault(key, defaultValue);
    }

    public void putInt(String key, int value) {
        this.put(key, value);
    }
    public int getInt(String key) {
        return (int) this.get(key);
    }
    public int getInt(String key, int defaultValue) {
        return (int) this.getOrDefault(key, defaultValue);
    }

    public void putBool(String key, boolean value) {
        this.put(key, value);
    }
    public boolean getBool(String key) {
        return (boolean) this.get(key);
    }
    public boolean getBool(String key, Boolean defaultValue) {
        return (boolean) this.getOrDefault(key, defaultValue);
    }

    public void putDouble(String key, double value) {
        this.put(key, value);
    }
    public double getDouble(String key) {
        return (double) this.get(key);
    }
    public double getDouble(String key, double defaultValue) {
        return (double) this.getOrDefault(key, defaultValue);
    }

}