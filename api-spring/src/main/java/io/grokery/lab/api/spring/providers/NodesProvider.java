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
import io.grokery.lab.api.common.dao.DAO; import io.grokery.lab.api.common.context.CloudContext;


@Component
@Path("/clouds/{cloudId}/nodes")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Nodes", produces = "application/json")
public class NodesProvider {

	private static final Logger LOGGER = LoggerFactory.getLogger(NodesProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("{nodeType}")
	@ApiOperation(value = "Create node", response = Node.class)
	public Response create(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam JsonObj nodeData) {
		LOGGER.info("POST: apiVersion={} cloudId={}", apiVersion, cloudId);
		try {
			CloudContext context = new CloudContext(authorization);
			nodeData.put(Node.getNodeTypeName(), nodeType);
			JsonObj result = NodesService.create(nodeData, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		} catch (NotFoundException e) {
			LOGGER.error(e.message);
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@PUT
	@Path("{nodeType}/{nodeId}")
	@ApiOperation(value = "Update node", response = Node.class)
	public Response update(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam @PathParam("nodeId") String nodeId,
			@ApiParam JsonObj nodeData) {
		LOGGER.info("PUT: {}/nodes/{}", apiVersion, nodeId);
		try {
			CloudContext context = new CloudContext(authorization);
			nodeData.put(Node.getNodeTypeName(), nodeType);
			nodeData.put(Node.getNodeIdName(), nodeId);
			JsonObj result = NodesService.update(nodeData, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (NotFoundException e) {
			LOGGER.error(e.message);
			return Response.status(Status.NOT_FOUND).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}

	@DELETE
	@Path("{nodeType}/{nodeId}")
	@ApiOperation(value = "Delete node", response = Node.class)
	public Response delete(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam @PathParam("nodeId") String nodeId) {
		LOGGER.info("DELETE: {}/nodes/{}", apiVersion, nodeId);
		try {
			CloudContext context = new CloudContext(authorization);
			JsonObj result = NodesService.delete(nodeType, nodeId, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (NotFoundException e) {
			LOGGER.error(e.message);
			return Response.status(Status.NOT_FOUND).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}

	@GET
	@Path("{nodeType}/{nodeId}")
	@ApiOperation(value = "Get node", response = Node.class)
	public Response read(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("nodeType") String nodeType,
			@ApiParam @PathParam("nodeId") String nodeId,
			@DefaultValue("") @QueryParam("projection") String projection) {
		LOGGER.info("GET: {}/nodes/{}/{}", apiVersion, nodeId);
		try {
			CloudContext context = new CloudContext(authorization);
			JsonObj result = NodesService.read(nodeType, nodeId, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (NotFoundException e) {
			LOGGER.error(e.message);
			return Response.status(Status.NOT_FOUND).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}

	@GET
	@Path("")
	@ApiOperation(value = "Get nodes", response = Node.class)
	public Response readAll(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@DefaultValue("") @QueryParam("nodeType") String nodeType,
			@DefaultValue("") @QueryParam("projection") String projection) {
		LOGGER.info("GET: {}/nodes", apiVersion);
		try {
			CloudContext context = new CloudContext(authorization);
			JsonObj result = NodesService.readAll(context);
			return Response.status(Status.OK).entity(result).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}

}
