package io.grokery.lab.api.cloud.nodes.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.CreateFunctionResult;
import com.amazonaws.services.lambda.model.DeleteFunctionRequest;
// import com.amazonaws.services.lambda.model.DeleteFunctionResult;
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
		this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(JobType.AWSLAMBDA.toString());
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
			.withMemorySize(3008)
			.withTimeout(300)
			.withPublish(true)
			.withRole("arn:aws:iam::854227434563:role/LambdaJobRole");

		AWSLambda lambdaClient = AWSLambdaClientBuilder.standard()
			.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
			.withRegion(context.awsRegion)
			.build();
		CreateFunctionResult result = lambdaClient.createFunction(request);

		lambdaARN = result.getFunctionArn();
	}

	private String makeDeployPackage(String code) {
		LOG.debug("makeDeployPackage");
		String path = "/tmp/dist.zip";
		try {
			ZipOutputStream out = new ZipOutputStream(new FileOutputStream(new File(path)));

			out.putNextEntry(new ZipEntry("main.py"));
			byte[] data = code.getBytes();
			out.write(data, 0, data.length);
			out.closeEntry();

			// next entry

			out.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return path;
	}

	public void updateExternalResources(CloudContext context, JsonObj data) {
		super.updateExternalResources(context, data);


		String path = this.makeDeployPackage("print('hello')");
		LOG.debug("path: " + path);
		// ? copy path to s3
		// update function with new pkg


		// AWSLambdaAsync lambdaClient = AWSLambdaAsyncClientBuilder.standard()
		// 	.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
		// 	.withRegion(context.awsRegion)
		// 	.build();

		// JsonObj args = this.getArgs();
		// args.put("jobId", this.getJobId());
		// args.put("created", this.getCreated());

		// LOG.info("startRun {}/{}", this.getJobId(), this.getCreated());
		// try {
		// 	InvokeRequest req = new InvokeRequest()
		// 		.withFunctionName(this.getLambdaARN())
		// 		.withPayload(MapperUtil.getInstance().writeValueAsString(args));
		// 	Future<InvokeResult> future_res = lambdaClient.invokeAsync(req);
		// } catch (JsonProcessingException e) {
		// 	e.printStackTrace();
		// }

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
			lambdaClient.deleteFunction(deleteFunctionRequest);
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
