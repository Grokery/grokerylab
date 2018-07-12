package io.grokery.lab.api.cloud;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.cloud.nodes.NodeType;
import io.grokery.lab.api.cloud.nodes.jobs.JobType;
import io.grokery.lab.api.cloud.nodes.sources.SourceType;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class OptionsService {

	private static final Logger logger = LoggerFactory.getLogger(OptionsService.class);

	public static JsonObj getOptions() throws InvalidInputException{
		logger.info("get options");
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

		return response;
	}

}
