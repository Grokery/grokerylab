package io.grokery.lab.api.cloud.nodes.sources;

/**
 * Defines all data source types
 *
 * @author hogue
 */
public enum SourceType {
	GENERIC("Generic"),
	SQL("SQL Table"),
	MONGO("Mongo Collection"),

	AWSS3("AWS S3"),
	AZUREDATASTORE("Azure Data Store"),
	AWSREDSHIFT("AWS Redshift Table"),
	GOOGLEBIGQUERY("Google BigQuery Table");

	private String typeName;

	SourceType(String typeName) {
		this.typeName = typeName;
	}

	public String getTypeName() {
		return typeName;
	}

}
