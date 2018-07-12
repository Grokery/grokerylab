package io.grokery.lab.api.cloud.nodes.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.CreateFunctionResult;
import com.amazonaws.services.lambda.model.CreateFunctionRequest;
import com.amazonaws.services.lambda.model.FunctionCode;
import com.amazonaws.services.lambda.model.Runtime;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CreateBucketRequest;

import io.grokery.lab.api.cloud.context.CloudContext;
import io.grokery.lab.api.common.CredentialProvider;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class AWSLambdaJob extends Job {

	private static final Logger LOGGER = LoggerFactory.getLogger(AWSLambdaJob.class);

	private String lambdaARN;
	private String runControl;
	private JsonObj schedule;

	// Constructers
	public AWSLambdaJob() {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	public AWSLambdaJob(JsonObj obj) {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	private void initializeDefaults() {
		this.runControl = "manual";
		this.schedule = new JsonObj();
	}

	// Inherited class methods
	public void setValues(JsonObj newData) {
		super.setValues(newData);
		this.lambdaARN = newData.get("lambdaARN")!= null ? newData.get("lambdaARN").toString() : this.lambdaARN;
		this.runControl = newData.get("runControl") != null ? newData.get("runControl").toString() : this.runControl;
		this.schedule = newData.get("schedule") != null ? MapperUtil.getInstance().convertValue(newData.get("schedule"), JsonObj.class) : this.schedule;
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
		// TODO make sure I'm good to be saved
	}

	public void setupExternalResources(CloudContext context) {
		super.setupExternalResources(context);

		// TODO:
		// check if jobs/<id>/packages/<version> exists and create if not
		// check if jobs/<id>/packages/<version>/package.zip and copy from default if not
		// check if jobs/<id>/runs exists and create if not
		AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
		.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
		.withRegion(context.awsRegion)
		.build();

		if (!s3Client.doesBucketExistV2(context.s3BucketName)) {
			s3Client.createBucket(new CreateBucketRequest(context.s3BucketName));
		}
		String key = this.getS3PkgPath();
		final CreateFunctionRequest request = new CreateFunctionRequest()
			.withRuntime(Runtime.Python36)
			.withCode(new FunctionCode().withS3Bucket(context.s3BucketName).withS3Key(key))
			.withHandler("lambda_function.lambda_handler")
			.withFunctionName(this.getFunctionName())
			.withDescription(this.getDescription())
			.withMemorySize(128)
			.withPublish(true)
			.withRole("arn:aws:iam::854227434563:role/grokerylab-api-dev-us-west-2-lambdaRole");

		AWSLambda lambdaClient = AWSLambdaClientBuilder.standard()
			.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
			.withRegion(context.awsRegion)
			.build();
		CreateFunctionResult result = lambdaClient.createFunction(request);

		lambdaARN = result.getFunctionArn();
	}

	public void updateExternalResources(CloudContext context, JsonObj data) {
		super.updateExternalResources(context, data);
	}

	public void cleanupExternalResources(CloudContext context) {
		super.cleanupExternalResources(context);
		// TODO de allocate any external resources
	}

	// Getters and Setters
	public String getS3Path() {
		return "jobs/" + this.getNodeId() + "/v" + Integer.toString(this.getVersion());
	}
	public String getS3PkgPath() {
		return this.getS3Path() + "/pkg/dist.zip";
	}

	public String getFunctionName() {
		return this.getNodeId() + Integer.toString(this.getVersion());
	}

	public String getLambdaARN() {
		return lambdaARN;
	}
	public void setLambdaARN(String lambdaARN) {
		this.lambdaARN = lambdaARN;
	}

	public String getRunControl() {
		return runControl;
	}
	public void setRunControl(String runControl) {
		this.runControl = runControl;
	}

	public JsonObj getSchedule() {
		return schedule;
	}
	public void setSchedule(JsonObj schedule) {
		this.schedule = schedule;
	}

}
