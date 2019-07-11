package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.grokery.lab.api.cloud.history.HistoryService;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/clouds/{cloudId}/history")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "History", produces = "application/json")
public class HistoryProvider {

	private static final Logger LOG = LoggerFactory.getLogger(HistoryProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@GET
	@Path("/search")
	@ApiOperation(value = "Query history for items", response = JsonObj.class)
	public Response get(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @QueryParam("nodeId") String nodeId, 
			@ApiParam @QueryParam("query") String query,
			@ApiParam @QueryParam("projection") String projection,
			@ApiParam @QueryParam("limit") int limit
	) throws NotAuthorizedException {
		LOG.info("GET:{}/clouds/{}/history/search/{}?query={}&projection={}&limit={}", apiVersion, cloudId, nodeId, query, projection, limit);
		JsonObj result = HistoryService.queryHistoryItems(auth, cloudId, nodeId, query, projection, limit);
		return Response.status(Status.OK).entity(result).build();
	}

	@GET
	@Path("/{nodeId}/{created}")
	@ApiOperation(value = "Get history item details", response = JsonObj.class)
	public Response update(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeId") String nodeId,
			@ApiParam @PathParam("created") String created,
			@ApiParam @PathParam("projection") String projection
	) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		LOG.info("GET:{}/clouds/{}/history/{}/{}", apiVersion, cloudId, nodeId, created);
		JsonObj result = HistoryService.getHistoryItemDetails(auth, cloudId, nodeId, created, projection);
		return Response.status(Status.OK).entity(result).build();
	}

}
