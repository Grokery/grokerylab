package io.grokery.api.lab.resources;

import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.grokery.api.lab.resources.ResourceMapper;

public class ResourceMapper_UnitTest {

	@Test
	public void testgetInstance() {
		ObjectMapper mapper = ResourceMapper.getInstance();
		assert(mapper != null);
		ObjectMapper mapper2 = ResourceMapper.getInstance();
		assert(mapper == mapper2);
	}

}
