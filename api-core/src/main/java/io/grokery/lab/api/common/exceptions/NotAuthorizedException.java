package io.grokery.lab.api.common.exceptions;

public class NotAuthorizedException extends GrokeryException {
	
	private static final long serialVersionUID = 1L;

	public NotAuthorizedException() {
		super();
	}
	
	public NotAuthorizedException(String msg) {
		super(msg);
	}
	
}
