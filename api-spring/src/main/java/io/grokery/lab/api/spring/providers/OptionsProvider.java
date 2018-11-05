package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
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

import io.grokery.lab.api.cloud.options.OptionsService;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/clouds/{cloudId}/options")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Options", produces = "application/json")
public class OptionsProvider {

	private static final Logger LOG = LoggerFactory.getLogger(OptionsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@GET
	@Path("/")
	@ApiOperation(value = "Get all", response = JsonObj.class)
	public Response getTypes(
		@HeaderParam("Authorization") String auth,
		@ApiParam @PathParam("cloudId") String cloudId
	) throws InvalidInputException {
		LOG.info("GET:{}/clouds/{}/options", apiVersion, cloudId);
		return Response.status(Status.OK).entity(OptionsService.getOptions(auth, cloudId)).build();
	}

}
