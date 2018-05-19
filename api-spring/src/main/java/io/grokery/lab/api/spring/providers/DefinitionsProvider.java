package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/definitions")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Definitions", produces = "application/json")
public class DefinitionsProvider {
	private static final Logger LOGGER = LoggerFactory.getLogger(DefinitionsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;
	
	@GET
	@Path("")	
	@ApiOperation(value = "Get definitions", response = Object.class)  
	public Response get(@ApiParam @PathParam("resourceType") String resourceType)  {
		LOGGER.info("{}/definitions/{}", apiVersion, resourceType);
		try {
			if (resourceType == null) {
				throw new InvalidInputException();
			}
			return Response.status(Status.OK).entity(new Object()).build();
		} catch (InvalidInputException e) {
			LOGGER.error(e.message);
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}
	
}
