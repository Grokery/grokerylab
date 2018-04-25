package io.grokery.lab.api.common;

public class Common {

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty(); 
    }

    public static String getRequiredEnv(String key) {
        String env = System.getenv(key);
		if (Common.isNullOrEmpty(env)) {
            throw new Error("Environment variable ''"+key+"'' must be defined");
        } 
        return env;
    }

}