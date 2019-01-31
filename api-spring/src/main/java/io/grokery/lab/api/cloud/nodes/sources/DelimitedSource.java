package io.grokery.lab.api.cloud.nodes.sources;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.errors.NotImplementedError;

/**
 * Text and text based source data like csv, tsv, psv etc
 *
 * @author hogue
 */
public class DelimitedSource extends Source {

	private String source;
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
		return this.source;
	}

	public void write(CloudContext context, Object request) {
		JsonObj jRequest = new JsonObj(request);
		this.source = jRequest.getString("data");
	}

	/**
	 * @return the source
	 */
	public String getSource() {
		return source;
	}

	/**
	 * @param s3Path the source to set
	 */
	public void setSource(String source) {
		this.source = source;
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
