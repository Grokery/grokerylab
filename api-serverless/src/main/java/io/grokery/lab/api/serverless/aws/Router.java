package io.grokery.lab.api.serverless.aws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.lambda.runtime.Context; 
import com.amazonaws.services.lambda.runtime.RequestHandler;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

import io.grokery.lab.api.admin.AccountService;
import io.grokery.lab.api.admin.CloudService;
import io.grokery.lab.api.admin.UserService;

import io.grokery.lab.api.cloud.jobruns.JobRunsService;
import io.grokery.lab.api.cloud.nodes.NodesService;
import io.grokery.lab.api.cloud.nodes.sources.SourceService;
import io.grokery.lab.api.cloud.options.OptionsService;


public class Router implements RequestHandler<ApiGatewayRequest, ApiGatewayResponse> {

	private static final Logger LOG = LoggerFactory.getLogger(Router.class);

	@Override
	public ApiGatewayResponse handleRequest(ApiGatewayRequest req, Context lcxt) {
		try {
			final String resource = req.getResource();
			final String method = req.getHttpMethod();

			LOG.info(String.format("handleRequest %s: %s", req.getHttpMethod(), resource));

			final String auth = req.getHeader("Authorization", null);
			JsonObj res = null;


			if (resource.matches("/api/v[0-9]+/accounts")) 
			{
				if (method.equals("POST"))
					res = AccountService.getInstance().create(auth, req.getBody());
			} 
			else if (resource.matches("/api/v[0-9]+/accounts/\\{accountId\\}")) 
			{
				String accountId = req.getPathValue("accountId");
				if (method.equals("GET"))
					res = AccountService.getInstance().retrieve(auth, accountId);
				else if (method.equals("PUT"))
					res = AccountService.getInstance().update(auth, accountId, req.getBody());
				else if (method.equals("DELETE"))
					res = AccountService.getInstance().delete(auth, accountId);
			} 
			

			if (resource.matches("/api/v[0-9]+/users")) 
			{
				if (method.equals("POST")) 
					res = UserService.getInstance().create(auth, req.getBody());
			}
			else if (resource.matches("/api/v[0-9]+/users/\\{userId\\}"))
			{
				String username = req.getPathValue("username");
				if (method.equals("GET"))
					res = UserService.getInstance().retrieve(auth, username);
				else if (method.equals("PUT"))
					res = UserService.getInstance().update(auth, username, req.getBody());
				else if (method.equals("DELETE"))
					res = UserService.getInstance().delete(auth, username);
			}
			else if (resource.matches("/api/v[0-9]+/users/authenticate")) 
			{
				if (req.getHttpMethod().equals("POST"))
					res = UserService.getInstance().authenticate(req.getBody());
			}
				

			if (resource.matches("/api/v[0-9]+/clouds"))
			{
				if (req.getHttpMethod().equals("POST"))
					res = CloudService.getInstance().create(auth, req.getBody());
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}"))
			{
				String cloudId = req.getPathValue("cloudId");
				if (method.equals("GET"))
					res = CloudService.getInstance().retrieve(auth, cloudId);
				else if (method.equals("PUT"))
					res = CloudService.getInstance().update(auth, cloudId, req.getBody());
				else if (method.equals("DELETE"))
					res = CloudService.getInstance().delete(auth, cloudId);
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/options"))
			{
				if (method.equals("GET"))
					res = OptionsService.getOptions(auth, req.getPathValue("cloudId"));
			}


			if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes"))
			{
				String cloudId = req.getPathValue("cloudId");
				if (method.equals("POST"))
					res = NodesService.create(auth, cloudId, req.getPathValue("nodeType"), req.getBody());
				else if (method.equals("GET"))
					res = NodesService.readAll(auth, cloudId);
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/search"))
			{
				if (method.equals("GET"))
					res = NodesService.readAll(auth, req.getPathValue("cloudId"));
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/\\{nodeType\\}"))
			{
				String cloudId = req.getPathValue("cloudId");
				if (method.equals("POST"))
					res = NodesService.create(auth, cloudId, req.getPathValue("nodeType"), req.getBody());
				else if (method.equals("GET"))
					res = NodesService.readAll(auth, cloudId);
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/\\{nodeType\\}/\\{nodeId\\}"))
			{
				String cloudId = req.getPathValue("cloudId");
				String nodeType = req.getPathValue("nodeType");
				String nodeId = req.getPathValue("nodeId");
				if (method.equals("PUT"))
					res = NodesService.update(auth, cloudId, nodeType, nodeId, req.getBody());
				else if (method.equals("GET"))
					res = NodesService.read(auth, cloudId, nodeType, nodeId);
				else if (method.equals("DELETE"))
					res = NodesService.delete(auth, cloudId, nodeType, nodeId);
			} 
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/datasource/\\{sourceId\\}/query")) 
			{
				if (method.equals("GET"))
					res = (JsonObj) SourceService.query(auth, req.getPathValue("cloudId"), req.getPathValue("sourceId"),
							req.getQueryStringParameters());
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/nodes/datasource/\\{sourceId\\}/write")) 
			{
				if (method.equals("PUT"))
					res = SourceService.write(auth, req.getPathValue("cloudId"), req.getPathValue("sourceId"), req.getBody());
			}
			

			if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns"))
			{
				res = JobRunsService.createAndStartJobRun(auth, req.getPathValue("cloudId"), req.getBody());
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns/search"))
			{
				String jobId = req.getQueryValue("jobId", null);
				String query = req.getQueryValue("query", null);
				String projection = req.getQueryValue("projection", null);
				int limit = Integer.parseInt(req.getQueryValue("limit", "0"));
				if (method.equals("GET"))
					res = JobRunsService.getJobRunsforJob(auth, req.getPathValue("cloudId"), jobId, query, projection, limit);
			}
			else if (resource.matches("/api/v[0-9]+/clouds/\\{cloudId\\}/jobruns/\\{jobId\\}/\\{created\\}"))
			{
				final String jobId = req.getPathValue("jobId");
				final String created = req.getPathValue("created");
				if (method.equals("PUT"))
					res = JobRunsService.updateJobRunStatus(auth, req.getPathValue("cloudId"), jobId, created, req.getBody());
			}
			

			if (res == null)
				throw new NotImplementedError();
			else
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
}
