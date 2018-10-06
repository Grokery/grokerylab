package io.grokery.lab.api.cloud.secrets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class SecretService {

	private static final Logger LOG = LoggerFactory.getLogger(SecretService.class);

	public static JsonObj createSecret(JsonObj request, CloudContext context) throws InvalidInputException, NotFoundException {
		return null;
	}

	public static JsonObj updateSecret(JsonObj request, CloudContext context) throws InvalidInputException, NotFoundException {
		return null;
	}

	public static JsonObj deleteSecret(String secretId, CloudContext context) {
		return null;
	}

	public static JsonObj getSecrets(String query, CloudContext context) {
		return null;
	}

}
