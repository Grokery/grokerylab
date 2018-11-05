package io.grokery.lab.api.spring;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

@Provider
public class ApiExceptionHandler implements ExceptionMapper<Throwable> {

  private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);

	public Response toResponse(Throwable ex) {

		if (ex instanceof NotAuthorizedException) {
    	LOG.error(ex.getMessage());
			return Response.status(Status.UNAUTHORIZED).build();
		} else if (ex instanceof InvalidInputException)  {
    	LOG.error(ex.getMessage());
    	return Response.status(Status.BAD_REQUEST).build();
    } else if (ex instanceof NotFoundException)  {
    	LOG.error(ex.getMessage());
    	return Response.status(Status.NOT_FOUND).build();
    } else {
      LOG.error(ex.getMessage());
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
	}

}