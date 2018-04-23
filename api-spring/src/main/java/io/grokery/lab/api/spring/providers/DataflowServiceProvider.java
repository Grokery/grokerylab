package io.grokery.lab.api.spring.providers;

import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.grokery.api.common.GrokeryContext;
import io.grokery.api.common.exceptions.InvalidInputException;
import io.grokery.api.common.exceptions.NotAuthorizedException;
import io.grokery.api.lab.DataflowService;

@Component
@Path("/clouds/{cloudId}/dataflowservice")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Dataflowservice", produces = "application/json")
public class DataflowServiceProvider {
	private static final Logger LOGGER = LoggerFactory.getLogger(DataflowServiceProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;
	
	@GET
	@Path("")	
	@ApiOperation(value = "Get nodes", response = Object.class)  
	public Response get(
		@HeaderParam("Authorization") String authorization,
		@ApiParam @PathParam("cloudId") String cloudId)  {
		LOGGER.info("{}/clouds/{}/dataflowservice", apiVersion, cloudId);
		try {
			GrokeryContext context = new GrokeryContext(authorization);
			Map<String,Object> results = DataflowService.getNodesForFlow(context);
			return Response.status(Status.OK).entity(results).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}
	
}
