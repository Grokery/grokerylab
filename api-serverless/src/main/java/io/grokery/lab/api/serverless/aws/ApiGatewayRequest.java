package io.grokery.lab.api.serverless.aws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ApiGatewayRequest {
	
	private static final Logger LOG = LoggerFactory.getLogger(ApiGatewayRequest.class);
	
	private String resource;
    private String path;
	private String httpMethod;
	private String stage;
	private JsonObj headers;
	private JsonObj pathParameters;
	private JsonObj queryStringParameters;
	private JsonObj body;
	
	public ApiGatewayRequest() {
		this.headers = new JsonObj();
		this.pathParameters = new JsonObj();
		this.queryStringParameters = new JsonObj();
		this.body = new JsonObj();
	}
	
	public void setBody(String body) {
		if (body != null && body != "") {
			LOG.debug("Mapping request body string into JsonObj");
			ObjectMapper mapper = new ObjectMapper();
			try {
				this.body = mapper.readValue(body, JsonObj.class);
			} catch (Throwable e) {
				LOG.error("Error mapping request body", e);
				this.body.put("Error", "Error mapping request body");
			}
		}
	}
	public void setObjectBody(JsonObj body) {
		this.body = body;
	}
	public JsonObj getBody() {
		return body;
	}
	public String getHttpMethod() {
		return httpMethod;
	}
	public void setHttpMethod(String httpMethod) {
		this.httpMethod = httpMethod;
	}
	public JsonObj getHeaders() {
		return headers;
	}
	public void setHeaders(JsonObj headers) {
		this.headers = headers;
	}
	public JsonObj getPathParameters() {
		return pathParameters;
	}
	public void setPathParameters(JsonObj pathParameters) {
		this.pathParameters = pathParameters;
	}
	public JsonObj getQueryStringParameters() {
		return queryStringParameters;
	}
	public void setQueryStringParameters(JsonObj queryStringParameters) {
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
			return headers.getString(key, defaultVal);
		}
		return defaultVal;
	}

	public String getPathValue(String key) throws Exception {
		return getPathValue(key, null);
	}

	public String getPathValue(String key, String defaultVal) {
		if (pathParameters != null) {
			return pathParameters.getString(key, defaultVal);
		}
		return defaultVal;
	}

	public String getQueryValue(String key) throws Exception {
		return getQueryValue(key, null);
	}

	public String getQueryValue(String key, String defaultVal) {
		if (pathParameters != null) {
			return queryStringParameters.getString(key, defaultVal);
		}
		return defaultVal;
	}
}
