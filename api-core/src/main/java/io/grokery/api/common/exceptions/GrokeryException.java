package io.grokery.api.common.exceptions;

public class GrokeryException extends Exception {

	private static final long serialVersionUID = 1L;

	public String message;

	public GrokeryException() {
		message = "";
	}
	
	public GrokeryException(String msg) {
		message = msg;
	}
}
