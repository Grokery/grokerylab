package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
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

import io.grokery.lab.api.cloud.jobruns.JobRunsService;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

@Component
@Path("/clouds/{cloudId}/jobruns")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "JobRuns", produces = "application/json")
public class JobRunsProvider {

	private static final Logger LOG = LoggerFactory.getLogger(OptionsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@POST
	@Path("/")
	@ApiOperation(value = "Create new job run", response = JsonObj.class)
	public Response create(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam JsonObj request) {
		LOG.info("POST: apiVersion={} cloudId={}", apiVersion, cloudId);
		try {
			CloudContext context = new CloudContext(authorization);
			JsonObj result = JobRunsService.createAndStartJobRun(request, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@PUT
	@Path("/{jobId}/{created}")
	@ApiOperation(value = "Update job run", response = JsonObj.class)
	public Response update(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("jobId") String jobId,
			@ApiParam @PathParam("created") String created,
			@ApiParam JsonObj request) {
		LOG.info("POST: apiVersion={} cloudId={} jobRunId={} created={}", apiVersion, cloudId, jobId, created);
		try {
			CloudContext context = new CloudContext(authorization);
			request.put("jobId", jobId);
			request.put("created", created);
			JsonObj result = JobRunsService.updateJobRunStatus(request, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@GET
	@Path("/{jobRunId}")
	@ApiOperation(value = "Get job run info", response = JsonObj.class)
	public Response get(
			@HeaderParam("Authorization") String authorization,
			@ApiParam @PathParam("cloudId") String cloudId,
			@ApiParam @PathParam("jobRunId") String jobRunId, 
			@ApiParam @QueryParam("query") String query,
			@ApiParam @QueryParam("projection") String projection,
			@ApiParam @QueryParam("limit") int limit) {
		LOG.info("POST: apiVersion={} cloudId={} jobRunId={}", apiVersion, cloudId, jobRunId);
		try {
			CloudContext context = new CloudContext(authorization);
			JsonObj result = JobRunsService.getJobRunsforJob(jobRunId, query, projection, limit, context);
			return Response.status(Status.OK).entity(result).build();
		} catch (Exception e) {
			LOG.error(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

}
