package io.grokery.lab.api.serverless.aws;

import java.util.Map;
import java.util.HashMap;

import org.apache.log4j.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class ApiGatewayRequest {
	
	private static final Logger LOGGER = Logger.getLogger(ApiGatewayRequest.class);
	
	private String resource;
    private String path;
	private String httpMethod;
	private String stage;
	private Map<String, String> headers;
	private Map<String, String> pathParameters;
	private Map<String, String> queryStringParameters;
	private Map<String, Object> body;
	
	public ApiGatewayRequest() {
		this.headers = new HashMap<String, String>();
		this.pathParameters = new HashMap<String, String>();
		this.queryStringParameters = new HashMap<String, String>();
		this.body = new HashMap<String, Object>();
	}
	
	@SuppressWarnings("unchecked")
	public void setBody(String body) {
		if (body != null && body != "") {
			LOGGER.debug("Mapping request body string into Map<String, Object>");
			ObjectMapper mapper = new ObjectMapper();
			try {
				this.body = mapper.readValue(body, Map.class);
			} catch (Throwable e) {
				LOGGER.error("Error mapping request body", e);
				this.body.put("Error", "Error mapping request body");
			}
		}
	}
	public void setObjectBody(Map<String, Object> body) {
		this.body = body;
	}
	public Map<String, Object> getBody() {
		return body;
	}
	public String getHttpMethod() {
		return httpMethod;
	}
	public void setHttpMethod(String httpMethod) {
		this.httpMethod = httpMethod;
	}
	public Map<String, String> getHeaders() {
		return headers;
	}
	public void setHeaders(Map<String, String> headers) {
		this.headers = headers;
	}
	public Map<String, String> getPathParameters() {
		return pathParameters;
	}
	public void setPathParameters(Map<String, String> pathParameters) {
		this.pathParameters = pathParameters;
	}
	public Map<String, String> getQueryStringParameters() {
		return queryStringParameters;
	}
	public void setQueryStringParameters(Map<String, String> queryStringParameters) {
		this.queryStringParameters = queryStringParameters;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getResource() {
		return resource;
	}
	public void setResource(String resource) {
		this.resource = resource;
	}
	public String getStage() {
		return stage;
	}
	public void setStage(String stage) {
		this.stage = stage;
	}

	public String getHeader(String key) throws Exception {
		return getHeader(key, null);
	}

	public String getHeader(String key, String defaultVal) {
		if (headers != null) {
			return headers.getOrDefault(key, defaultVal);
		}
		return defaultVal;
	}

	public String getPathValue(String key) throws Exception {
		return getPathValue(key, null);
	}

	public String getPathValue(String key, String defaultVal) {
		if (pathParameters != null) {
			return pathParameters.getOrDefault(key, defaultVal);
		}
		return defaultVal;
	}
}
