package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
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

import io.grokery.lab.api.cloud.history.comments.CommentsService;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/clouds/{cloudId}/comments")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Comments", produces = "application/json")
public class CommentsProvider {

	private static final Logger LOG = LoggerFactory.getLogger(CommentsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("/")
	@ApiOperation(value = "Create new comment", response = JsonObj.class)
	public Response create(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam JsonObj request
	) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		LOG.info("POST:{}/clouds/{}/comments", apiVersion, cloudId);
		JsonObj result = CommentsService.createComment(auth, cloudId, request);
		return Response.status(Status.OK).entity(result).build();
	}

	@GET
	@Path("/search")
	@ApiOperation(value = "Query comments for node", response = JsonObj.class)
	public Response get(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @QueryParam("nodeId") String nodeId, 
			@ApiParam @QueryParam("query") String query,
			@ApiParam @QueryParam("projection") String projection,
			@ApiParam @QueryParam("limit") int limit
	) throws NotAuthorizedException {
		LOG.info("GET:{}/clouds/{}/comments/search/{}?query={}&projection={}&limit={}", apiVersion, cloudId, nodeId, query, projection, limit);
		JsonObj result = CommentsService.getCommentsforNode(auth, cloudId, nodeId, query, projection, limit);
		return Response.status(Status.OK).entity(result).build();
	}

}
