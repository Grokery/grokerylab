package io.grokery.lab.api.cloud.nodes.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.CreateFunctionResult;
import com.amazonaws.services.lambda.model.DeleteFunctionRequest;
import com.amazonaws.services.lambda.model.DeleteFunctionResult;
import com.amazonaws.services.lambda.model.CreateFunctionRequest;
import com.amazonaws.services.lambda.model.FunctionCode;
import com.amazonaws.services.lambda.model.Runtime;

import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.CredentialProvider;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.MapperUtil;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class AWSLambdaJob extends Job {

	private static final Logger LOG = LoggerFactory.getLogger(AWSLambdaJob.class);

	private String lambdaARN;
	private String runControl;
	private JsonObj schedule;

	// Constructers
	public AWSLambdaJob() {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	protected AWSLambdaJob(JobType subType) {
		super(subType);
		this.initializeDefaults();
		this.setSubType(subType.toString());
	}

	public AWSLambdaJob(JsonObj obj) {
		super(JobType.AWSLAMBDA);
		this.initializeDefaults();
	}

	protected void initializeDefaults() {
		this.runControl = "manual";
		this.schedule = new JsonObj();
	}

	// Inherited class methods
	public void setValues(JsonObj newData) {
		super.setValues(newData);
		this.lambdaARN = newData.get("lambdaARN")!= null ? newData.getString("lambdaARN") : this.lambdaARN;
		this.runControl = newData.get("runControl") != null ? newData.getString("runControl") : this.runControl;
		this.schedule = newData.get("schedule") != null ? MapperUtil.getInstance().convertValue(newData.get("schedule"), JsonObj.class) : this.schedule;
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
		// TODO make sure I'm good to be saved
	}

	public void setupExternalResources(CloudContext context) {
		super.setupExternalResources(context);

		// AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
		// .withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
		// .withRegion(context.awsRegion)
		// .build();

		// if (!s3Client.doesBucketExistV2(getS3BucketName(context))) {
		// 	s3Client.createBucket(new CreateBucketRequest(getS3BucketName(context)));
		// }

		// TODO:
		// check if jobs/<id>/dist.zip and copy from default if not

		final CreateFunctionRequest request = new CreateFunctionRequest()
			.withRuntime(Runtime.Python36)
			.withCode(new FunctionCode().withS3Bucket(getS3BucketName(context)).withS3Key(this.getS3PkgPath()))
			.withHandler("lambda_function.lambda_handler")
			.withFunctionName(this.getFunctionName())
			.withDescription(this.getFunctionDescription())
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
		try {
			AWSLambda lambdaClient = AWSLambdaClientBuilder.standard()
			.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
			.withRegion(context.awsRegion)
			.build();
			DeleteFunctionRequest deleteFunctionRequest = new DeleteFunctionRequest()
				.withFunctionName(this.getFunctionName());
			DeleteFunctionResult result = lambdaClient.deleteFunction(deleteFunctionRequest);
		} catch (Exception e) {

		}
		lambdaARN = null;
	}

	// Getters and Setters
	public String getS3BucketName(CloudContext context) {
		return "grokery";//context.cloudId;
	}
	public String getS3Path() {
		return "lambda_default";//"jobs/" + this.getNodeId();
	}
	public String getS3PkgPath() {
		return this.getS3Path() + "/dist.zip";
	}

	public String getFunctionName() {
		return this.getNodeId();
	}

	public String getFunctionDescription() {
		return this.getTitle() + ": " + this.getDescription();
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
