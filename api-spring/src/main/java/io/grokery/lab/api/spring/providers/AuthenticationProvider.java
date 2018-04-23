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
import io.grokery.api.admin.Auth;
import io.grokery.api.common.exceptions.InvalidInputException;
import io.grokery.api.common.exceptions.NotAuthorizedException;
import io.grokery.api.common.exceptions.NotFoundException;
import io.grokery.api.admin.models.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Map;

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
	public Response signin(@ApiParam Map<String, Object> req) {
		LOGGER.info("POST: {}/signin", apiVersion);
		try {
			Map<String,Object> response = Auth.getInstance().signin(req);
			return Response.status(Status.OK).entity(response).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		} catch (NotAuthorizedException e) {
			LOGGER.error(e.message);
			return Response.status(Status.UNAUTHORIZED).entity(e).build();
		}
	}

	// @POST
	// @Path("/resetpass")	
	// @ApiOperation(value = "Reset password")  
	// public Response resetpass(@ApiParam Map<String, Object> req) {
	// 	LOGGER.info("POST: {}/resetpass", apiVersion);
	// 	try {
	// 		Map<String,Object> response = Auth.getInstance().resetpass(req);
	// 		return Response.status(Status.OK).entity(response).build();
	// 	} catch (InvalidInputException e) {
	// 		LOGGER.error(e.message);
	// 		return Response.status(Status.BAD_REQUEST).entity(e).build();
	// 	} catch (NotAuthorizedException e) {
	// 		LOGGER.error(e.message);
	// 		return Response.status(Status.UNAUTHORIZED).entity(e).build();
	// 	}
	// }

}
