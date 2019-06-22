package io.grokery.lab.api.cloud.nodes.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.exceptions.InvalidInputException;

public class BrowserJs extends Job {

	private static final Logger LOG = LoggerFactory.getLogger(BrowserJs.class);

	private String code;

	// Constructers
	public BrowserJs() {
		this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(JobType.BROWSERJS.toString());
	}

	// Inherited class methods
	public void setValues(JsonObj newData) {
		super.setValues(newData);

		this.code = newData.get("code") != null ? newData.getString("code") : this.code;
	}

	public void validateValues() throws InvalidInputException {
		super.validateValues();
		// TODO make sure I'm good to be saved
	}

	// getters and setters
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}

}
