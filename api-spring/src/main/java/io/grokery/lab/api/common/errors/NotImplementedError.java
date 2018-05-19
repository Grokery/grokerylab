package io.grokery.lab.api.common.errors;

public class NotImplementedError extends Error {
	
	private static final long serialVersionUID = 1L;
	
	public String message;

	public NotImplementedError() {
		message = "Not implemented";
	}
	
	public NotImplementedError(String msg) {
		message = msg;
	}
	
}
