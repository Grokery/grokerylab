package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.admin.CloudService;
import io.grokery.lab.api.admin.models.Cloud;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Map;

@Component
@Path("/clouds")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Clouds", produces = "application/json")
public class CloudsProvider {

	private static final Logger LOGGER = LoggerFactory.getLogger(CloudsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("/")
	@ApiOperation(value = "Create Cloud", response = Cloud.class)
	public Response create(
		@HeaderParam("Authorization") String auth,
		@ApiParam Map<String, Object> req) {
		LOGGER.info("POST: {}/clouds", apiVersion);
		try {
			Map<String,Object> response = CloudService.getInstance().create(auth, req);
			return Response.status(Status.OK).entity(response).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@GET
	@Path("/{cloudId}")
	@ApiOperation(value = "Get Cloud", response = Cloud.class)
	public Response retreive(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId) {
		LOGGER.info("GET: {}/clouds/<cloudid>", apiVersion);
		try {
			Map<String,Object> response = CloudService.getInstance().retrieve(auth, cloudId);
			return Response.status(Status.OK).entity(response).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@DELETE
	@Path("/{cloudId}")
	@ApiOperation(value = "Get Cloud", response = Cloud.class)
	public Response delete(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId) {
		LOGGER.info("DELETE: {}/clouds/<cloudId>", apiVersion);
		try {
			Map<String,Object> response = CloudService.getInstance().delete(auth, cloudId);
			return Response.status(Status.OK).entity(response).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

}
