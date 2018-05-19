package io.grokery.lab.api.serverless.aws;

import java.util.Map;

import org.apache.log4j.Logger;

import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.core.DataflowService;
import io.grokery.lab.api.core.DefinitionService;
import io.grokery.lab.api.core.ResourcesService;
import io.grokery.lab.api.admin.AccountService;
import io.grokery.lab.api.admin.CloudService;
import io.grokery.lab.api.admin.UserService;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class Router implements RequestHandler<ApiGatewayRequest, ApiGatewayResponse> {

	private static final Logger LOGGER = Logger.getLogger(Router.class);

	@Override
	public ApiGatewayResponse handleRequest(ApiGatewayRequest req, Context lcxt) {
		try {
			final String resource = req.getResource();

			LOGGER.info(String.format("%s: %s", req.getHttpMethod(), resource));

			if (resource.matches("/api/v[0-9]+/auth/signin")) 
				return signin(resource, req);
			else if (resource.matches("/api/v[0-9]+/auth/resetpass")) 
				return resetPass(resource, req);
			
			else if (resource.matches("/api/v[0-9]+/accounts")) 
				return handleAccounts(resource, req);
			else if (resource.matches("/api/v[0-9]+/accounts/\\{accountId\\}")) 
				return handleAccount(resource, req);

			else if (resource.matches("/api/v[0-9]+/users")) 
				return handleUsers(resource, req);
			else if (resource.matches("/api/v[0-9]+/users/\\{username\\}")) 
				return handleUser(resource, req);
			
			else if (resource.matches("/api/v[0-9]+/clouds")) 
				return handleClouds(resource, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}")) 
				return handleCloud(resource, req);

			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/resources/\\{collection\\}")) 
				return handleResources(resource, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/resources/\\{collection\\}/\\{guid\\}")) 
				return handleResource(resource, req);

			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/dataflowservice")) 
				return handleDataflowService(resource, req);

			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/definitionservice")) 
				return handleDefinitionService(resource, req);

			throw new NotImplementedError();
		} catch (NotFoundException e) {
			return ApiGatewayResponse.error(404, e.getMessage());
		} catch (InvalidInputException e) {
			return ApiGatewayResponse.error(400, e.getMessage());
		} catch (NotAuthorizedException e) {
			return ApiGatewayResponse.error(401, e.getMessage());
		} catch (NotImplementedError e) {
			return ApiGatewayResponse.error(500, "No route or method handler implemented for: " + req.getResource());
		} catch (Throwable e) {
			LOGGER.error(e.getMessage());
			e.printStackTrace();
			return ApiGatewayResponse.error(500, "An error occured and a stack trace has been logged.");
		}
	}

	private ApiGatewayResponse signin(String resource, ApiGatewayRequest req) throws Exception {
		if (req.getHttpMethod().equals("POST")) {
			Map<String, Object> res = UserService.getInstance().authenticate(req.getBody());
			return ApiGatewayResponse.make(200, res);
		} 
		throw new NotImplementedError();
	}

	private ApiGatewayResponse resetPass(String resource, ApiGatewayRequest req) throws Exception {
		if (req.getHttpMethod().equals("POST")) {
			// TODO
		} 
		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleAccounts(String resource, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();
		
		if (method.equals("POST")) {
			return ApiGatewayResponse.make(200, AccountService.getInstance().create(auth, req.getBody()));
		} 
		
		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleAccount(String resource, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();
		final String accountId = req.getPathValue("accountId");

		if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, AccountService.getInstance().retrieve(auth, accountId));
		} else if (method.equals("PUT")) {
			return ApiGatewayResponse.make(200, AccountService.getInstance().update(auth, accountId, req.getBody()));
		} else if (method.equals("DELETE")) {
			return ApiGatewayResponse.make(200, AccountService.getInstance().delete(auth, accountId));
		}
		
		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleUsers(String resource, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();
		
		if (method.equals("POST")) {
			return ApiGatewayResponse.make(200, UserService.getInstance().create(auth, req.getBody()));
		} 
		
		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleUser(String resource, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();
		final String username = req.getPathValue("username");

		if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, UserService.getInstance().retrieve(auth, username));
		} else if (method.equals("PUT")) {
			return ApiGatewayResponse.make(200, UserService.getInstance().update(auth, username, req.getBody()));
		} else if (method.equals("DELETE")) {
			return ApiGatewayResponse.make(200, UserService.getInstance().delete(auth, username));
		}
		
		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleClouds(String resource, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();

		if (method.equals("POST")) {
			return ApiGatewayResponse.make(200, CloudService.getInstance().create(auth, req.getBody()));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleCloud(String resource, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");
		final String method = req.getHttpMethod();
		
		if (method.equals("GET")){
			return ApiGatewayResponse.make(200, CloudService.getInstance().retrieve(auth, cloudId));
		} else if (method.equals("PUT")) {
			return ApiGatewayResponse.make(200, CloudService.getInstance().update(auth, cloudId, req.getBody()));
		} else if (method.equals("DELETE")) {
			return ApiGatewayResponse.make(200, CloudService.getInstance().delete(auth, cloudId));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleResources(String resource, ApiGatewayRequest req) throws Exception {
		final GrokeryContext gcxt = new GrokeryContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();
		final String collection = req.getPathValue("collection");

		if (method.equals("POST")) {
			return ApiGatewayResponse.make(200, ResourcesService.create(req.getBody(), gcxt));
		} else if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, ResourcesService.readMultiple(collection, "", 0, 100, gcxt));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleResource(String resource, ApiGatewayRequest req) throws Exception {
		final GrokeryContext gcxt = new GrokeryContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();
		final String collection = req.getPathValue("collection");
		final String id = req.getPathValue("guid");

		if (method.equals("PUT")) {
			Map<String, Object> res = ResourcesService.update(req.getBody(), gcxt);
			return ApiGatewayResponse.make(200, res);
		} else if (method.equals("GET")) {
			Map<String, Object> res = ResourcesService.read(collection, id, gcxt);
			return ApiGatewayResponse.make(200, res);
		} else if (method.equals("DELETE")) {
			Map<String, Object> res = ResourcesService.delete(collection, id, gcxt);
			return ApiGatewayResponse.make(200, res);
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleDataflowService(String resource, ApiGatewayRequest req) throws Exception {
		final GrokeryContext gcxt = new GrokeryContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();

		if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, DataflowService.getNodesForFlow(gcxt));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleDefinitionService(String resource, ApiGatewayRequest req) throws Exception {
		// final GrokeryContext gcxt = new GrokeryContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();

		if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, DefinitionService.getLookups());
		}

		throw new NotImplementedError();
	}
}
