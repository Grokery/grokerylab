package io.grokery.api.common.exceptions;

public class InvalidInputException extends GrokeryException {
	
	private static final long serialVersionUID = 1L;

	public InvalidInputException() {
		super();
	}
	
	public InvalidInputException(String msg) {
		super(msg);
	}
	
}
