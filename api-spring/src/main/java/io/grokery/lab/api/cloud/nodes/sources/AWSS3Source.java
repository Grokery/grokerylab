package io.grokery.lab.api.cloud.nodes.sources;

import javax.ws.rs.core.MultivaluedMap;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.errors.NotImplementedError;

/**
 * Contains fields and logic specific to AWS S3 bucket sources
 *
 * @author hogue
 */
public class AWSS3Source extends Source {

	private String s3Path;

    public AWSS3Source() {
        this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(SourceType.AWSS3.toString());
	}

	public JsonObj query(CloudContext context, MultivaluedMap<String, String> request) {
		// TODO map data to writeRequestObjModel and validate
		// query is path (s3 key) 
		// 	if multiple file matches, 
		// 		return list, 
		//  else if single file and less than 1024 mb
		//  	return file
		// 	else if single file and less than 1024 mb
		// 		return sample
		throw new NotImplementedError();
	}

	public void write(CloudContext context, JsonObj request) {
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
