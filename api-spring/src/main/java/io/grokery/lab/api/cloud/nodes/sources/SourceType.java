package io.grokery.lab.api.cloud.nodes.sources;

/**
 * Defines all data source types
 *
 * @author hogue
 */
public enum SourceType {
	GENERIC("Generic"),
	AWSS3BUCKET("AWSS3Bucket"),
	AZUREDATASTORE("AzureDataStore"),
	GOOGLEBIGQUERYTABLE("GoogleBigQueryTable");

	private String typeName;

    SourceType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
	}

}
