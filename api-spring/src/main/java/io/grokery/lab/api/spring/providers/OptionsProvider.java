package io.grokery.lab.api.spring.providers;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.grokery.lab.api.cloud.nodes.NodeType;
import io.grokery.lab.api.cloud.nodes.jobs.JobType;
import io.grokery.lab.api.cloud.nodes.sources.SourceType;
import io.grokery.lab.api.common.JsonObj;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Component
@Path("/options")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "Options", produces = "application/json")
public class OptionsProvider {

	private static final Logger LOGGER = LoggerFactory.getLogger(OptionsProvider.class);

	@Value("${info.api.version}")
	private String apiVersion;

	@GET
	@Path("/")
	@ApiOperation(value = "Get all", response = JsonObj.class)
	public Response getTypes() {
		LOGGER.info("GET: {}", apiVersion);
		try {
			JsonObj response = new JsonObj();

			JsonObj nodeTypes = new JsonObj();
			for (NodeType var : NodeType.values()) {
				nodeTypes.putString(var.name(), var.getTypeName());
			}
			response.putJsonObj("nodetypes", nodeTypes);

			JsonObj jobTypes = new JsonObj();
			for (JobType var : JobType.values()) {
				jobTypes.putString(var.name(), var.getTypeName());
			}
			response.putJsonObj("jobtypes", jobTypes);

			JsonObj sourceTypes = new JsonObj();
			for (SourceType var : SourceType.values()) {
				sourceTypes.putString(var.name(), var.getTypeName());
			}
			response.putJsonObj("sourcetypes", sourceTypes);

			return Response.status(Status.OK).entity(response).build();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@GET
	@Path("/nodetypes")
	@ApiOperation(value = "Get Nodetype Dropdown Options", response = JsonObj.class)
	public Response nodeTypes() {
		LOGGER.info("GET: {}/nodetypes", apiVersion);
		try {
			JsonObj response = new JsonObj();
			for (NodeType var : NodeType.values()) {
				response.put(var.name(), var.getTypeName());
			}
			return Response.status(Status.OK).entity(response).build();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@GET
	@Path("/jobtypes")
	@ApiOperation(value = "Get Jobtype Dropdown Options", response = JsonObj.class)
	public Response jobTypes() {
		LOGGER.info("GET: {}/jobtypes", apiVersion);
		try {
			JsonObj response = new JsonObj();
			for (JobType var : JobType.values()) {
				response.put(var.name(), var.getTypeName());
			}
			return Response.status(Status.OK).entity(response).build();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

	@GET
	@Path("/sourcetypes")
	@ApiOperation(value = "Get Sourcetype Dropdown Options", response = JsonObj.class)
	public Response sourceTypes() {
		LOGGER.info("GET: {}/sourcetypes", apiVersion);
		try {
			JsonObj response = new JsonObj();
			for (SourceType var : SourceType.values()) {
				response.put(var.name(), var.getTypeName());
			}
			return Response.status(Status.OK).entity(response).build();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build();
		}
	}

}
