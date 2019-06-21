package io.grokery.lab.api.cloud.nodes.sources;

import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import io.grokery.lab.api.common.CredentialProvider;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.errors.NotImplementedError;

/**
 * Contains fields and logic specific to AWS S3 bucket sources
 *
 * @author hogue
 */
public class AWSS3Source extends JsonSource {

	private static final Logger LOG = LoggerFactory.getLogger(AWSS3Source.class);

	private String s3Path;

	public AWSS3Source() {
		this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(SourceType.AWSS3.toString());
	}

	public void setValues(JsonObj newData) {
		super.setValues(newData);
		this.s3Path = newData.get("s3Path") != null ? newData.getString("s3Path") : this.s3Path;
	}

	public JsonObj query(CloudContext context, JsonObj request) {
		
		// TODO map data to writeRequestObjModel and validate
		// query is path (s3 key)
		// 	if multiple file matches,
		// 		return list,
		//  else if single file and less than 1024 mb
		//  	return file
		// 	else if single file and greater than 1024 mb
		// 		return sample

		if (request.getString("query").endsWith("/")) {
			// TODO get list of files
			JsonObj result = new JsonObj();
			ArrayList<JsonObj> files = new ArrayList<JsonObj>();
			String bucketName = "datatest123456";
	
			try {
				AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
					.withCredentials(new CredentialProvider(context.awsAccessKeyId, context.awsSecretKey))
					.withRegion(context.awsRegion)
					.build();
	
				// maxKeys is set to 2 to demonstrate the use of ListObjectsV2Result.getNextContinuationToken()
				ListObjectsV2Request req = new ListObjectsV2Request()
					.withBucketName(bucketName)
					.withMaxKeys(2);
					// .withPrefix(request.getString("query"));
				ListObjectsV2Result objectSummaries;
				do {
					objectSummaries = s3Client.listObjectsV2(req);
					for (S3ObjectSummary objectSummary : objectSummaries.getObjectSummaries()) {
						JsonObj fileInfo = new JsonObj();
						fileInfo.put("key", objectSummary.getKey());
						fileInfo.put("lastModified", objectSummary.getLastModified());
						fileInfo.put("size", objectSummary.getSize());
						fileInfo.put("storageClass", objectSummary.getStorageClass());
						fileInfo.put("owner", objectSummary.getOwner());
						fileInfo.put("eTag", objectSummary.getETag());
						fileInfo.put("bucketName", objectSummary.getBucketName());
						files.add(fileInfo);
					}
					req.setContinuationToken(objectSummaries.getNextContinuationToken());
				} while (objectSummaries.isTruncated());
			}
			catch(AmazonServiceException e) {
				LOG.error("AmazonServiceException while getting s3 file info", e);
			}
			catch(SdkClientException e) {
				LOG.error("SdkClientException while getting s3 file info", e);
			}
	
			result.put("files", files);
	
			return result;
		} else {
			// TODO get file details
			return new JsonObj();
		}
	}

	public void write(CloudContext context, Object request) {
		// TODO map data to writeRequestObjModel and validate
		// if this.s3Path is folder
		// 	    put new file
		//  else if file
		//  	overwrite existing data with new
		throw new NotImplementedError();
	}

	/**
	 * @return the s3Path
	 */
	public String getS3Path() {
		return s3Path;
	}

	/**
	 * @param s3Path the s3Path to set
	 */
	public void setS3Path(String s3Path) {
		this.s3Path = s3Path;
	}
}
