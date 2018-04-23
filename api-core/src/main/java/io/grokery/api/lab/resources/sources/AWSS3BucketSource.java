package io.grokery.api.lab.resources.sources;

import java.util.Map;

/**
 * Contains fields and logic specific to AWS S3 bucket sources
 * 
 * @author hogue
 */
public class AWSS3BucketSource extends Datasource {

	private String s3Path;
	
    public AWSS3BucketSource() {
        super(SourceType.AWSS3BUCKET);
	}
	
	public AWSS3BucketSource(Map<String, Object> obj) {
        super(SourceType.AWSS3BUCKET);
        // TODO get field values from obj
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
