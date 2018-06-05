package io.grokery.lab.api.spring.providers;

import java.util.Map;

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

import io.grokery.lab.api.common.GrokeryContext;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.core.resources.Resource;
import io.grokery.lab.api.core.ResourcesService;


@Component
@Path("/clouds/{cloudId}/resources")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Resources", produces = "application/json")
public class ResourcesProvider {

	private static final Logger LOGGER = LoggerFactory.getLogger(ResourcesProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;
	
	@POST
	@Path("/{resourceType}")	
	@ApiOperation(value = "Create resource", response = Resource.class)  
	public Response create(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId, 
			@ApiParam @PathParam("resourceType") String resourceType, 
			@ApiParam Map<String, Object> resourceData) {
		LOGGER.info("POST: apiVersion={} cloudId={} resourceType={}", apiVersion, cloudId, resourceType);
		try {
			GrokeryContext context = new GrokeryContext(authorization);
			resourceData.put(Resource.getCloudIdName(), cloudId);
			resourceData.put(Resource.getResourceTypeName(), resourceType.toUpperCase());
			Map<String, Object> result = ResourcesService.create(resourceData, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}
	
	@PUT
	@Path("/{resourceType}/{guid}")	
	@ApiOperation(value = "Update resource", response = Resource.class)  
	public Response update(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId, 
			@ApiParam @PathParam("resourceType") String resourceType,
			@ApiParam @PathParam("guid") String guid, 
			@ApiParam Map<String, Object> resourceData) {
		LOGGER.info("PUT: {}/resources/{}/{}", apiVersion, resourceType, guid);
		try {
			GrokeryContext context = new GrokeryContext(authorization);
			resourceData.put(Resource.getResourceTypeName(), resourceType.toUpperCase());
			resourceData.put(Resource.getResourceIdName(), guid);
			Map<String, Object> result = ResourcesService.update(resourceData, context);
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
	@Path("/{resourceType}/{guid}")	
	@ApiOperation(value = "Delete resource", response = Resource.class)  
	public Response delete(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId, 
			@ApiParam @PathParam("resourceType") String resourceType,
			@ApiParam @PathParam("resourceSubType") String resourceSubType,
			@ApiParam @PathParam("guid") String guid) {
		LOGGER.info("DELETE: {}/resources/{}/{}/{}", apiVersion, resourceType, resourceSubType, guid);
		try {
			GrokeryContext context = new GrokeryContext(authorization);
			Map<String, Object> result = ResourcesService.delete(resourceType, guid, context);
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
	@Path("/{resourceType}/{guid}")	
	@ApiOperation(value = "Get resource", response = Resource.class)  
	public Response read(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId, 
			@ApiParam @PathParam("resourceType") String resourceType, 
			@ApiParam @PathParam("guid") String guid,
			@DefaultValue("") @QueryParam("projection") String projection) {
		LOGGER.info("GET: {}/resources/{}/{}", apiVersion, resourceType, guid);
		try {
			GrokeryContext context = new GrokeryContext(authorization);
			Map<String, Object> result = ResourcesService.read(resourceType, guid, context);
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
	@Path("/{resourceType}")	
	@ApiOperation(value = "Get <resourceType> as paginated list", response = Resource.class)  
	public Response readMultiple(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId, 
			@ApiParam @PathParam("resourceType") String resourceType,
			@DefaultValue("") @QueryParam("query") String query,
			@DefaultValue("") @QueryParam("projection") String projection,
			@DefaultValue("0") @QueryParam("pageNum") int pageNum,
			@DefaultValue("100")@QueryParam("pageSize") int pageSize) {
		LOGGER.info("GET: {}/resources/{}", apiVersion, resourceType);
		try {
			GrokeryContext context = new GrokeryContext(authorization);
			// TODO add cloudId to query by default
			Map<String, Object> result = ResourcesService.readMultiple(resourceType, query, pageNum, pageSize, context);
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
