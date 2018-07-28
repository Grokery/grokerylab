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
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class Router implements RequestHandler<ApiGatewayRequest, ApiGatewayResponse> {

	private static final Logger LOG = LoggerFactory.getLogger(Router.class);

	@Override
	public ApiGatewayResponse handleRequest(ApiGatewayRequest req, Context lcxt) {
		try {
			final String resource = req.getResource();

			LOG.info(String.format("%s: %s", req.getHttpMethod(), resource));

			if (resource.matches("/api/v[0-9]+/auth/signin"))
				return signin(req);
			else if (resource.matches("/api/v[0-9]+/auth/resetpass"))
				return resetPass(req);

			else if (resource.matches("/api/v[0-9]+/accounts"))
				return handleAccounts(req);
			else if (resource.matches("/api/v[0-9]+/accounts/\\{accountId\\}"))
				return handleAccount(req);

			else if (resource.matches("/api/v[0-9]+/users"))
				return handleUsers(req);
			else if (resource.matches("/api/v[0-9]+/users/\\{userId\\}"))
				return handleUser(req);

			else if (resource.matches("/api/v[0-9]+/clouds"))
				return handleClouds(req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}"))
				return handleCloud(req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/options"))
				return handleOptions(req);

			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes"))
				return handleNodes(req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/\\{nodeType\\}"))
				return handleNodes(req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/\\{nodeType\\}/\\{nodeId\\}"))
				return handleNode(req);
			
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns"))
				return handleJobruns(req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns/\\{jobId\\}"))
				return handleJobruns(req);
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns/\\{jobId\\}/\\{startTime\\}"))
				return handleJobrun(req);

			throw new NotImplementedError();
		} catch (NotFoundException e) {
			return ApiGatewayResponse.error(404, e.getMessage());
		} catch (InvalidInputException e) {
			return ApiGatewayResponse.error(400, e.getMessage());
		} catch (NotImplementedError e) {
			return ApiGatewayResponse.error(500, "No route or method handler implemented for: " + req.getResource());
		} catch (Throwable e) {
			LOG.error(e.getMessage());
			e.printStackTrace();
			return ApiGatewayResponse.error(500, "An error occured and a stack trace has been logged.");
		}
	}

	private ApiGatewayResponse signin(ApiGatewayRequest req) throws Exception {
		if (req.getHttpMethod().equals("POST")) {
			JsonObj res = UserService.getInstance().authenticate(req.getBody());
			return ApiGatewayResponse.make(200, res);
		}
		throw new NotImplementedError();
	}

	private ApiGatewayResponse resetPass(ApiGatewayRequest req) throws Exception {
		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleAccounts(ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();

		if (method.equals("POST")) {
			JsonObj result = AccountService.getInstance().create(auth, req.getBody());
			return ApiGatewayResponse.make(200, result);
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleAccount(ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();
		final String accountId = req.getPathValue("accountId");

		if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, AccountService.getInstance().retrieve(auth, accountId));
		} else if (method.equals("PUT")) {
			JsonObj result = AccountService.getInstance().update(auth, accountId, req.getBody());
			return ApiGatewayResponse.make(200, result);
		} else if (method.equals("DELETE")) {
			return ApiGatewayResponse.make(200, AccountService.getInstance().delete(auth, accountId));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleUsers(ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();

		if (method.equals("POST")) {
			JsonObj result = UserService.getInstance().create(auth, req.getBody());
			return ApiGatewayResponse.make(200, result);
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleUser(ApiGatewayRequest req) throws Exception {
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

	private ApiGatewayResponse handleClouds(ApiGatewayRequest req) throws Exception {
		final String auth = req.getHeader("Authorization");
		final String method = req.getHttpMethod();

		if (method.equals("POST")) {
			return ApiGatewayResponse.make(200, CloudService.getInstance().create(auth, req.getBody()));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleCloud(ApiGatewayRequest req) throws Exception {
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


	private ApiGatewayResponse handleOptions(ApiGatewayRequest req) throws Exception {
		final CloudContext gcxt = new CloudContext(req.getHeader("Authorization"));

		return ApiGatewayResponse.make(200, OptionsService.getOptions());
	}

	private ApiGatewayResponse handleNodes(ApiGatewayRequest req) throws Exception {
		final CloudContext gcxt = new CloudContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();

		if (method.equals("POST")) {
			return ApiGatewayResponse.make(200, NodesService.create(req.getBody(), gcxt));
		} else if (method.equals("GET")) {
			return ApiGatewayResponse.make(200, NodesService.readAll(gcxt));
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleNode(ApiGatewayRequest req) throws Exception {
		final CloudContext gcxt = new CloudContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();
		final String nodeType = req.getPathValue("nodeType");
		final String nodeId = req.getPathValue("nodeId");

		if (method.equals("PUT")) {
			JsonObj res = NodesService.update(req.getBody(), gcxt);
			return ApiGatewayResponse.make(200, res);
		} else if (method.equals("GET")) {
			JsonObj res = NodesService.read(nodeType, nodeId, gcxt);
			return ApiGatewayResponse.make(200, res);
		} else if (method.equals("DELETE")) {
			JsonObj res = NodesService.delete(nodeType, nodeId, gcxt);
			return ApiGatewayResponse.make(200, res);
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleJobruns(ApiGatewayRequest req) throws Exception {
		final CloudContext gcxt = new CloudContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();

		if (method.equals("POST")) {
			JsonObj result = JobRunsService.createAndStartJobRun(req.getBody(), gcxt);
			return ApiGatewayResponse.make(200, result);
		} else if (method.equals("GET")) {
			String jobRunId = req.getPathValue("jobRunId");
			String query = req.getQueryValue("query", null);
			String projection = req.getQueryValue("projection", null);
			int limit = Integer.parseInt(req.getQueryValue("limit", "0"));
			JsonObj result = JobRunsService.getJobRunsforJob(jobRunId, query, projection, limit, gcxt);
			return ApiGatewayResponse.make(200, result);
		}

		throw new NotImplementedError();
	}

	private ApiGatewayResponse handleJobrun(ApiGatewayRequest req) throws Exception {
		final CloudContext gcxt = new CloudContext(req.getHeader("Authorization"));
		final String method = req.getHttpMethod();

		if (method.equals("PUT")) {
			JsonObj result = JobRunsService.updateJobRunStatus(req.getBody(), gcxt);
			return ApiGatewayResponse.make(200, result);
		} else if (method.equals("GET")) {
			// TODO
		}

		throw new NotImplementedError();
	}

}
