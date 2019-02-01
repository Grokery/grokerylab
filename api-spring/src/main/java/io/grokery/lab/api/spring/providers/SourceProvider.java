package io.grokery.lab.api.spring.providers;

import java.util.Iterator;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
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
import io.grokery.lab.api.cloud.nodes.sources.SourceService;


@Component
@Path("/clouds/{cloudId}/nodes/source/{sourceId}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "DataSource", produces = "application/json")
public class SourceProvider {

	private static final Logger LOG = LoggerFactory.getLogger(SourceProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@GET
	@Path("/query")
	@ApiOperation(value = "Query source data", response = Object.class)
	public Response query(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("sourceId") String sourceId,
			@Context UriInfo uriInfo
	) throws NotAuthorizedException, InvalidInputException, NotFoundException {
		MultivaluedMap<String, String> queryValues = uriInfo.getQueryParameters();
		LOG.info("GET:{}/clouds/{}/nodes/source/{}/query", apiVersion, cloudId, sourceId);
		JsonObj query = new JsonObj();
		Iterator it = queryValues.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            query.put(pair.getKey().toString(), pair.getValue());
        }
		Object result = SourceService.query(auth, cloudId, sourceId, query);
		return Response.status(Status.OK).entity(result).build();
	}

	@PUT
	@Path("/write")
	@ApiOperation(value = "Write source data", response = JsonObj.class)
	public Response write(
			@HeaderParam("Authorization") String auth,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("sourceId") String sourceId,
			@ApiParam JsonObj request
	) throws NotAuthorizedException, InvalidInputException, NotFoundException {
		LOG.info("GET:{}/clouds/{}/nodes/source/{}/write", apiVersion, cloudId, sourceId);
		JsonObj result = SourceService.write(auth, cloudId, sourceId, request);
		return Response.status(Status.OK).entity(result).build();
	}

}
