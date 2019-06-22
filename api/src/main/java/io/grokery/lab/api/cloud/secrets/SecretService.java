package io.grokery.lab.api.cloud.secrets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;

public class SecretService {

	private static final Logger LOG = LoggerFactory.getLogger(SecretService.class);

	public static JsonObj createSecret(String auth, String cloudId, JsonObj request) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		return null;
	}

	public static JsonObj updateSecret(String auth, String cloudId, JsonObj request) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		return null;
	}

	public static JsonObj deleteSecret(String auth, String cloudId, String secretId) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		return null;
	}

	public static JsonObj getSecrets(String auth, String cloudId, String query) throws NotAuthorizedException {
		CloudContext context = new CloudContext(cloudId, auth);
		return null;
	}

}
