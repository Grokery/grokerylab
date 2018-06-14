package io.grokery.lab.api.spring.providers;

import java.util.Map;

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
import io.grokery.lab.api.core.LookupService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/clouds/{cloudId}/lookups")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Lookups", produces = "application/json")
public class LookupProvider {
	private static final Logger LOGGER = LoggerFactory.getLogger(LookupProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@GET
	@Path("")
	@ApiOperation(value = "Get lookups", response = Object.class)
	public Response get(
		@ApiParam @PathParam("cloudId") String cloudId)  {
		LOGGER.info("{}/lookups", apiVersion);
		try {
			Map<String, Object> result = LookupService.getLookups();
			return Response.status(Status.OK).entity(result).build();
		} catch (InvalidInputException e) {
			return Response.status(Status.BAD_REQUEST).entity(e).build();
		}
	}

}
