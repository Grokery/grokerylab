package io.grokery.lab.api.cloud.nodes.sources;

/**
 * Contains fields and logic specific to AWS S3 bucket sources
 *
 * @author hogue
 */
public class AWSS3BucketSource extends Datasource {

	private String s3Path;

    public AWSS3BucketSource() {
        this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(SourceType.AWSS3.toString());
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
