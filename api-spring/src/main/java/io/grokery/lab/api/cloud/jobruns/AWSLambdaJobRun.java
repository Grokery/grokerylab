package io.grokery.lab.api.cloud.jobruns;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.model.InvokeResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.CredentialProvider;

public class AWSLambdaJobRun extends JobRun {

	private static final Logger LOG = LoggerFactory.getLogger(AWSLambdaJobRun.class);

	private String s3LogPath;
	private String lambdaARN;

	public AWSLambdaJobRun() {
		super(JobRunType.AWSLAMBDA);
	}

	public void startRun(CloudContext context) {
		AWSLambda lambdaClient = AWSLambdaClientBuilder.standard()
			.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
			.withRegion(context.awsRegion)
			.build();

		InvokeRequest request = new InvokeRequest()
			.withFunctionName(this.getLambdaARN());
		InvokeResult result = lambdaClient.invoke(request);
	}

	public String getS3LogPath() {
		return s3LogPath;
	}
	public void setS3LogPath(String s3LogPath) {
		this.s3LogPath = s3LogPath;
	}
	public String getLambdaARN() {
		return lambdaARN;
	}
	public void setLambdaARN(String lambdaARN) {
		this.lambdaARN = lambdaARN;
	}

}
