package io.grokery.lab.api.common.exceptions;

public class NotFoundException extends GrokeryException {
	
	private static final long serialVersionUID = 1L;

	public NotFoundException() {
		super();
	}
	
	public NotFoundException(String msg) {
		super(msg);
	}
	
}
