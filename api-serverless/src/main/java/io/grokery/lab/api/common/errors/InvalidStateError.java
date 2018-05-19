package io.grokery.lab.api.common.errors;

public class InvalidStateError extends Error {

	private static final long serialVersionUID = 1L;
	
	public String message;
	
	public InvalidStateError() {
		message = "Invalid state";
	}

	public InvalidStateError(String msg) {
		message = msg;
	}
}
