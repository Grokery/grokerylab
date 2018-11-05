package io.grokery.lab.api.serverless.aws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.lambda.runtime.Context; 
import com.amazonaws.services.lambda.runtime.RequestHandler;

import io.grokery.lab.api.admin.AccountService;
import io.grokery.lab.api.admin.CloudService;
import io.grokery.lab.api.admin.UserService;
import io.grokery.lab.api.cloud.jobruns.JobRunsService;
import io.grokery.lab.api.cloud.nodes.NodesService;
import io.grokery.lab.api.cloud.options.OptionsService;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class Router implements RequestHandler<ApiGatewayRequest, ApiGatewayResponse> {

	private static final Logger LOG = LoggerFactory.getLogger(Router.class);

	@Override
	public ApiGatewayResponse handleRequest(ApiGatewayRequest req, Context lcxt) {
		try {
			final String resource = req.getResource();
			final String method = req.getHttpMethod();

			LOG.info(String.format("handleRequest %s: %s", req.getHttpMethod(), resource));

			JsonObj res = null;
			if (resource.matches("/api/v[0-9]+/accounts")) 
				res = handleAccounts(method, req);
			else if (resource.matches("/api/v[0-9]+/accounts/\\{accountId\\}"))
				res = handleAccount(method, req);

			else if (resource.matches("/api/v[0-9]+/users"))
				res = handleUsers(method, req);
			else if (resource.matches("/api/v[0-9]+/users/\\{userId\\}"))
				res = handleUser(method, req);
			else if (resource.matches("/api/v[0-9]+/users/authenticate"))
				res = authenticateUser(method, req);

			else if (resource.matches("/api/v[0-9]+/clouds"))
				res = handleClouds(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}"))
				res =  handleCloud(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/options"))
				res = handleOptions(method, req);

			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes"))
				res = handleNodes(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/search"))
				res = handleNodes(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/\\{nodeType\\}"))
				res = handleNodes(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/\\{nodeType\\}/\\{nodeId\\}"))
				res = handleNode(method, req);
			
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns"))
				res = handleJobruns(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns/search"))
				res = handleJobrunSearch(method, req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns/\\{jobId\\}/\\{created\\}"))
				res = handleJobrun(method, req);
			else
				throw new NotImplementedError();

			return ApiGatewayResponse.make(200, res);
		} catch (NotAuthorizedException e) {
			LOG.error(e.getMessage());
			return ApiGatewayResponse.error(401, "Not Authorized");
		} catch (InvalidInputException e) {
			LOG.error(e.getMessage());
			return ApiGatewayResponse.error(400, "Invalid Input");
		} catch (NotFoundException e) {
			LOG.error(e.getMessage());
			return ApiGatewayResponse.error(404, "Not Found");
		} catch (NotImplementedError e) {
			LOG.error(e.getMessage());
			return ApiGatewayResponse.error(500, "Not Implemented");
		} catch (Throwable e) {
			LOG.error(e.getMessage());
			e.printStackTrace();
			return ApiGatewayResponse.error(500, "Internal Server Error");
		}
	}

	private JsonObj handleAccounts(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");

		if (method.equals("POST")) {
			return AccountService.getInstance().create(auth, req.getBody());
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleAccount(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String accountId = req.getPathValue("accountId");

		if (method.equals("GET")) {
			return AccountService.getInstance().retrieve(auth, accountId);
		} else if (method.equals("PUT")) {
			return AccountService.getInstance().update(auth, accountId, req.getBody());
		} else if (method.equals("DELETE")) {
			return AccountService.getInstance().delete(auth, accountId);
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleUsers(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");

		if (method.equals("POST")) {
			return UserService.getInstance().create(auth, req.getBody());
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleUser(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String username = req.getPathValue("username");

		if (method.equals("GET")) {
			return UserService.getInstance().retrieve(auth, username);
		} else if (method.equals("PUT")) {
			return UserService.getInstance().update(auth, username, req.getBody());
		} else if (method.equals("DELETE")) {
			return UserService.getInstance().delete(auth, username);
		} else {
			throw new NotImplementedError();
		}
		
	}

	private JsonObj authenticateUser(String method, ApiGatewayRequest req) throws Exception {

		if (req.getHttpMethod().equals("POST")) {
			return UserService.getInstance().authenticate(req.getBody());
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleClouds(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");

		if (method.equals("POST")) {
			return CloudService.getInstance().create(auth, req.getBody());
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleCloud(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");

		if (method.equals("GET")) {
			return CloudService.getInstance().retrieve(auth, cloudId);
		} else if (method.equals("PUT")) {
			return CloudService.getInstance().update(auth, cloudId, req.getBody());
		} else if (method.equals("DELETE")) {
			return CloudService.getInstance().delete(auth, cloudId);
		} else {
			throw new NotImplementedError();
		}

	}


	private JsonObj handleOptions(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");

		if (method.equals("GET")) {
			return OptionsService.getOptions(auth, cloudId);
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleNodes(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");
		final String nodeType = req.getPathValue("nodeType");

		if (method.equals("POST")) {
			return NodesService.create(auth, cloudId, nodeType, req.getBody());
		} else if (method.equals("GET")) {
			return NodesService.readAll(auth, cloudId);
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleNode(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");
		final String nodeType = req.getPathValue("nodeType");
		final String nodeId = req.getPathValue("nodeId");

		if (method.equals("PUT")) {
			return NodesService.update(auth, cloudId, nodeType, nodeId, req.getBody());
		} else if (method.equals("GET")) {
			return NodesService.read(auth, cloudId, nodeType, nodeId);
		} else if (method.equals("DELETE")) {
			return NodesService.delete(auth, cloudId, nodeType, nodeId);
		} else {
			throw new NotImplementedError();
		}

	}

	private JsonObj handleJobruns(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");

		if (method.equals("POST")) {
			return JobRunsService.createAndStartJobRun(auth, cloudId, req.getBody());
		} else {
			throw new NotImplementedError();
		}
		
	}

	private JsonObj handleJobrunSearch(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");

		if (method.equals("GET")) {
			String jobId = req.getQueryValue("jobId", null);
			String query = req.getQueryValue("query", null);
			String projection = req.getQueryValue("projection", null);
			int limit = Integer.parseInt(req.getQueryValue("limit", "0"));
			return JobRunsService.getJobRunsforJob(auth, cloudId, jobId, query, projection, limit);
		} else {
			throw new NotImplementedError();
		}
		
	}

	private JsonObj handleJobrun(String method, ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String cloudId = req.getPathValue("cloudId");

		if (method.equals("PUT")) {
			final String jobId = req.getPathValue("jobId");
			final String created = req.getPathValue("created");
			return JobRunsService.updateJobRunStatus(auth, cloudId, jobId, created, req.getBody());
		} else if (method.equals("GET")) {
			throw new NotImplementedError();
		} else {
			throw new NotImplementedError();
		}
		
	}

}
