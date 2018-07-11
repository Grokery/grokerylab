package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
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
import io.grokery.lab.api.admin.UserService;
import io.grokery.lab.api.admin.models.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Authenticate", produces = "application/json")
public class AuthenticationProvider {

	private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("/signin")
	@ApiOperation(value = "Authenticate User", response = User.class)
	public Response signin(@ApiParam JsonObj req) {
		LOGGER.info("POST: {}/signin", apiVersion);
		try {
			JsonObj response = UserService.getInstance().authenticate(req);
			return Response.status(Status.OK).entity(response).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e.getMessage()).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e.getMessage()).build();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return Response.status(Status.UNAUTHORIZED).entity(e.getMessage()).build();
		}
	}

}
