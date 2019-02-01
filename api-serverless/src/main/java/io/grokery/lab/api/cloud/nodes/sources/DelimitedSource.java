package io.grokery.lab.api.cloud.nodes.sources;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;

/**
 * Text and text based source data like csv, tsv, psv etc
 *
 * @author hogue
 */
public class DelimitedSource extends Source {

	private String delimiter;

	public DelimitedSource() {
		this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(SourceType.DELIMITED.toString());
		this.setDelimiter(",");
	}

	public Object query(CloudContext context, JsonObj request) {
		return this.getData();
	}

	/**
	 * @return the delimiter
	 */
	public String getDelimiter() {
		return delimiter;
	}

	/**
	 * @param delimiter the delimiter to set
	 */
	public void setDelimiter(String delimiter) {
		this.delimiter = delimiter;
	}
}
