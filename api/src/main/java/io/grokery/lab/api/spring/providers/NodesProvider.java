package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
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

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodesService;


@Component
@Path("/clouds/{cloudId}/nodes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Nodes", produces = "application/json")
public class NodesProvider {

	private static final Logger LOG = LoggerFactory.getLogger(NodesProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("{nodeType}")
	@ApiOperation(value = "Create node", response = Node.class)
	public Response create(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam JsonObj data
			) throws InvalidInputException, NotFoundException, NotAuthorizedException {
		LOG.info("POST:{}/clouds/{}/nodes/{}", apiVersion, cloudId, nodeType);
		JsonObj result = NodesService.create(auth, cloudId, nodeType, data);
		return Response.status(Status.OK).entity(result).build();
	}

	@PUT
	@Path("{nodeType}/{nodeId}")
	@ApiOperation(value = "Update node", response = Node.class)
	public Response update(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam @PathParam("nodeId") String nodeId,
			@ApiParam JsonObj nodeData) throws NotAuthorizedException, InvalidInputException, NotFoundException {
		LOG.info("PUT:{}/clouds/{}/nodes/{}/{}", apiVersion, cloudId, nodeType, nodeId);
		JsonObj result = NodesService.update(auth, cloudId, nodeType, nodeId, nodeData);
		return Response.status(Status.OK).entity(result).build();
	}

	@DELETE
	@Path("{nodeType}/{nodeId}")
	@ApiOperation(value = "Delete node", response = Node.class)
	public Response delete(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam @PathParam("nodeId") String nodeId) throws NotAuthorizedException, NotFoundException, InvalidInputException {
		LOG.info("DELETE:{}/clouds/{}/nodes/{}/{}", apiVersion, cloudId, nodeType, nodeId);
		JsonObj result = NodesService.delete(auth, cloudId, nodeType, nodeId);
		return Response.status(Status.OK).entity(result).build();
	}

	@GET
	@Path("{nodeType}/{nodeId}")
	@ApiOperation(value = "Get node", response = Node.class)
	public Response read(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam @PathParam("nodeId") String nodeId,
			@DefaultValue("") @QueryParam("projection") String projection) throws NotAuthorizedException, NotFoundException, InvalidInputException {
		LOG.info("GET:{}/clouds/{}/nodes/{}/{}", apiVersion, cloudId, nodeType, nodeId);
		JsonObj result = NodesService.read(auth, cloudId, nodeType, nodeId);
		return Response.status(Status.OK).entity(result).build();
	}

	@GET
	@Path("search")
	@ApiOperation(value = "Get nodes", response = Node.class)
	public Response readAll(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@DefaultValue("") @QueryParam("nodeType") String nodeType,
			@DefaultValue("") @QueryParam("projection") String projection) throws NotAuthorizedException, InvalidInputException {
		LOG.info("GET:{}/clouds/{}/nodes?nodeType={}&projection={}", apiVersion, cloudId, nodeType, projection);
		JsonObj result = NodesService.readAll(auth, cloudId);
		return Response.status(Status.OK).entity(result).build();
	}

}
