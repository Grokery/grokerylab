package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
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

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.admin.UserService;
import io.grokery.lab.api.admin.models.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Users", produces = "application/json")
public class UsersProvider {

	private static final Logger LOG = LoggerFactory.getLogger(UsersProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("/")
	@ApiOperation(value = "Create User", response = User.class)
	public Response create(
		@HeaderParam("Authorization") String auth,
		@ApiParam JsonObj req
	) throws Exception {
		LOG.info("POST:{}/users", apiVersion);
		JsonObj response = UserService.getInstance().create(auth, req);
		return Response.status(Status.OK).entity(response).build();
	}

	@GET
	@Path("/{userId}")
	@ApiOperation(value = "Get User", response = User.class)
	public Response retreive(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("userId") String userId
	) throws NotFoundException, NotAuthorizedException {
		LOG.info("GET:{}/users/{}", apiVersion, userId);
		JsonObj response = UserService.getInstance().retrieve(auth, userId);
		return Response.status(Status.OK).entity(response).build();
	}

	@POST
	@Path("/authenticate")
	@ApiOperation(value = "Authenticate User", response = User.class)
	public Response authenticate(
		@ApiParam JsonObj req
	) throws InvalidInputException, NotAuthorizedException {
		LOG.info("POST:{}/authenticate", apiVersion);
		JsonObj response = UserService.getInstance().authenticate(req);
		return Response.status(Status.OK).entity(response).build();
	}

}
