package io.grokery.lab.api.common;

public class CommonUtils {

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public static String getRequiredEnv(String key) {
        String env = System.getenv(key);
        if (CommonUtils.isNullOrEmpty(env)) {
            throw new Error("Environment variable ''"+key+"'' must be defined");
        }
        return env;
    }

    public static String getOptionalEnv(String key, String defaultValue) {
        String env = System.getenv(key);
        if (CommonUtils.isNullOrEmpty(env)) {
            return defaultValue;
        }
        return env;
    }

}