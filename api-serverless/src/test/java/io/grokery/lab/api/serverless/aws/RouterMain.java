package io.grokery.lab.api.serverless.aws;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import io.grokery.lab.api.common.JsonObj;

public class RouterMain { 

  public static void main(String[] args) {
		// Router router = new Router();
		// ApiGatewayRequest req = null;

		// req = authenticateReq();
		// req = createAccountReq();
		// req = createUserReq();
		// req = createCloudReq();

		// ApiGatewayResponse res = router.handleRequest(req, null);
		// System.out.println(res.getStatusCode());
		// System.out.println(ress.getBody());
	}

	public static ApiGatewayRequest authenticateReq() {
		ApiGatewayRequest req = new ApiGatewayRequest();
		req.setResource("/api/v0/auth/signin");
		req.setHttpMethod("POST");
		req.setBody("{\"username\":\"chmod740@gmail.com\",\"password\":\"2cool222\"}");
		return req;
	}

	public static ApiGatewayRequest createAccountReq() {
		ApiGatewayRequest req = new ApiGatewayRequest();
		req.setResource("/api/v0/account");
		req.setHttpMethod("POST");
		req.getHeaders().put("Authorization", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaG1vZDc0MEBnbWFpbC5jb20iLCJhY2NvdW50SWQiOiI3NDZiYTA4My0wZWQzLTRhMmQtYjIwYS1kYzNhN2RkY2ZlNTgiLCJhY2NvdW50Um9sZSI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ3Jva2VyeS5pbyIsImlhdCI6MTUxNjgwNjQ5OSwiZXhwIjoxNTE2ODM1Mjk5fQ.m5aWsBG4HQPotUgJQjjb61kEu7vaCtYdrfPt38DeXz8");
		req.setBody("{\"type\":\"full\"}");
		return req;
	}

	public static ApiGatewayRequest createUserReq() {
		ApiGatewayRequest req = new ApiGatewayRequest();
		req.setResource("/api/v0/users");
		req.setHttpMethod("POST");
		req.getHeaders().put("Authorization", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaG1vZDc0MEBnbWFpbC5jb20iLCJhY2NvdW50SWQiOiI3NDZiYTA4My0wZWQzLTRhMmQtYjIwYS1kYzNhN2RkY2ZlNTgiLCJhY2NvdW50Um9sZSI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ3Jva2VyeS5pbyIsImlhdCI6MTUxNjgwNjQ5OSwiZXhwIjoxNTE2ODM1Mjk5fQ.m5aWsBG4HQPotUgJQjjb61kEu7vaCtYdrfPt38DeXz8");
		req.setBody("{\"accountId\":\"36fcd8d3-530c-48df-9bc1-a5bc2213fb1d\",\"accountRole\":\"admin\",\"username\":\"hello2@world.com\",\"password\":\"2cool222\",\"name\":\"Dan\"}");
		return req;
	}

	public static ApiGatewayRequest createCloudReq() {
		Map<String, String> creds = new HashMap<String, String>();
		creds.put("awsAccessKeyId", "ABC");
		creds.put("awsSecretKey", "abc123");
		creds.put("awsRegion","us-west-2");
		JsonObj adminAccess = new JsonObj();
		adminAccess.put("credentials", creds);
		JsonObj body = new JsonObj();
		body.put("accountId", "5f56fab3-5f03-4576-82c0-a62ea61268fd");
		body.put("name", "hellocloud");
		body.put("title", "Hello Cloud Test");
		body.put("description","hello");
		body.put("cloudType", "AWS");
		body.put("url", "https://i98ns6slt2.execute-api.us-west-2.amazonaws.com/dev/api/v0");
		body.put("adminAccess", adminAccess);
		body.put("password","hello123");
		ApiGatewayRequest req = new ApiGatewayRequest();
		req.setResource("/api/v0/clouds");
		req.setHttpMethod("POST");
		req.getHeaders().put("Authorization", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaG1vZDc0MEBnbWFpbC5jb20iLCJhY2NvdW50SWQiOiI3NDZiYTA4My0wZWQzLTRhMmQtYjIwYS1kYzNhN2RkY2ZlNTgiLCJhY2NvdW50Um9sZSI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ3Jva2VyeS5pbyIsImlhdCI6MTUxNjgwNjQ5OSwiZXhwIjoxNTE2ODM1Mjk5fQ.m5aWsBG4HQPotUgJQjjb61kEu7vaCtYdrfPt38DeXz8");
		req.setObjectBody(body);
		return req;
	}


	/*
	 * https://stackoverflow.com/questions/318239/how-do-i-set-environment-variables-from-java
	 * Example usage:
	 * Map<String, String> envSettingsForTest = new HashMap<String, String>();
	 * envSettingsForTest.put("AWS_REGION","US_WEST_2");
	 * RouterTests.setEnvs(envSettingsForTest);
	 */
	@SuppressWarnings({ "unchecked" })
	public static void setEnvs(Map<String, String> newenv) throws Exception {
	  try {
		Class<?> processEnvironmentClass = Class.forName("java.lang.ProcessEnvironment");
		Field theEnvironmentField = processEnvironmentClass.getDeclaredField("theEnvironment");
		theEnvironmentField.setAccessible(true);
		Map<String, String> env = (Map<String, String>) theEnvironmentField.get(null);
		env.putAll(newenv);
		Field theCaseInsensitiveEnvironmentField = processEnvironmentClass.getDeclaredField("theCaseInsensitiveEnvironment");
		theCaseInsensitiveEnvironmentField.setAccessible(true);
		Map<String, String> cienv = (Map<String, String>)     theCaseInsensitiveEnvironmentField.get(null);
		cienv.putAll(newenv);
	  } catch (NoSuchFieldException e) {
		@SuppressWarnings("rawtypes")
		Class[] classes = Collections.class.getDeclaredClasses();
		Map<String, String> env = System.getenv();
		for(@SuppressWarnings("rawtypes") Class cl : classes) {
		  if("java.util.Collections$UnmodifiableMap".equals(cl.getName())) {
			Field field = cl.getDeclaredField("m");
			field.setAccessible(true);
			Object obj = field.get(env);
			Map<String, String> map = (Map<String, String>) obj;
			map.clear();
			map.putAll(newenv);
		  }
		}
	  }
	}

}
