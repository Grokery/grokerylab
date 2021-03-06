package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
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

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.admin.CloudService;
import io.grokery.lab.api.admin.models.Cloud;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/clouds")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Clouds", produces = "application/json")
public class CloudsProvider {

	private static final Logger LOG = LoggerFactory.getLogger(CloudsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("/")
	@ApiOperation(value = "Create Cloud", response = Cloud.class)
	public Response create(
		@HeaderParam("Authorization") String auth,
		@ApiParam JsonObj req
	) throws Exception {
		LOG.info("POST:{}/clouds", apiVersion);
		JsonObj response = CloudService.getInstance().create(auth, req);
		return Response.status(Status.OK).entity(response).build();
	}

	@GET
	@Path("/{cloudId}")
	@ApiOperation(value = "Get Cloud", response = Cloud.class)
	public Response retreive(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId
	) throws NotFoundException, NotAuthorizedException {
		LOG.info("GET:{}/clouds/{}", apiVersion, cloudId);
		JsonObj response = CloudService.getInstance().retrieve(auth, cloudId);
		return Response.status(Status.OK).entity(response).build();
	}

	@PUT
	@Path("/{cloudId}")
	@ApiOperation(value = "Update Cloud", response = Cloud.class)
	public Response update(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId,
		@ApiParam JsonObj req
	) throws NotFoundException, NotAuthorizedException, InvalidInputException {
		LOG.info("GET:{}/clouds/{}", apiVersion, cloudId);
		JsonObj response = CloudService.getInstance().update(auth, cloudId, req);
		return Response.status(Status.OK).entity(response).build();
	}

	@DELETE
	@Path("/{cloudId}")
	@ApiOperation(value = "Get Cloud", response = Cloud.class)
	public Response delete(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId
	) throws NotAuthorizedException, NotFoundException {
		LOG.info("DELETE:{}/clouds/{}", apiVersion, cloudId);
		JsonObj response = CloudService.getInstance().delete(auth, cloudId);
		return Response.status(Status.OK).entity(response).build();
	}

	@GET
	@Path("/{cloudId}/options")
	@ApiOperation(value = "Get Cloud options", response = JsonObj.class)
	public Response options(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId
	) throws NotFoundException, NotAuthorizedException {
		LOG.info("GET:{}/clouds/{}/options", apiVersion, cloudId);
		JsonObj response = CloudService.getInstance().options(auth, cloudId);
		return Response.status(Status.OK).entity(response).build();
	}

}
