package io.grokery.api.lab.resources;

import java.util.Map;

import org.junit.Test;

import io.grokery.api.common.exceptions.InvalidInputException;

public class Resource_UnitTest {
	
	@Test
	public void testMap() throws InvalidInputException {
		Resource foo = new Resource();
		foo.setTitle("hello");
		foo.setDescription("world");
		
		Map<String, Object> bar = foo.toMap();
		assert(bar != null);
		assert(bar.get(Resource.getResourceTypeName()).toString().equals(foo.getCollection().toString()));
		assert(bar.get(Resource.getResourceIdName()).toString().equals(foo.getGuid().toString()));
		assert(bar.get("title").toString().equals("hello"));
		assert(bar.get("description").toString().equals("world"));
		
		Map<String, Object> bar1 = Resource.toMap(foo);
		assert(bar1 != null);
		assert(bar1.get(Resource.getResourceTypeName()) == foo.getCollection().toString());
		assert(bar1.get(Resource.getResourceIdName()).toString().equals(foo.getGuid().toString()));
		assert(bar1.get("title").toString().equals("hello"));
		assert(bar1.get("description").toString().equals("world"));
		
		Resource foo1 = Resource.fromMap(bar);
		assert(foo1 != null);
		assert(foo1.getCollection() == foo.getCollection());
		assert(foo1.getCollection() == ResourceTypes.RESOURCES);
		assert(foo1.getGuid().toString().equals(foo.getGuid().toString()));
		assert(foo1.getTitle().equals("hello"));
		assert(foo1.getDescription().equals("world"));
		
		Resource foo2 = Resource.fromMap(foo1.toMap());
		assert(foo2 != null);
		assert(foo2.getCollection() == foo.getCollection());
		assert(foo2.getCollection() == ResourceTypes.RESOURCES);
		assert(foo2.getGuid().toString().equals(foo.getGuid().toString()));
		assert(foo2.getTitle().equals("hello"));
	}
	
	@Test
	public void testGenerateUUID() {
		Resource item = new Resource();
		assert(item.getGuid().toString().length() == 36);
	}
	
	@Test
	public void testGetResourceTypeName() {
		String resourceTypeName = Resource.getResourceTypeName();
		assert(resourceTypeName.length() > 3);
	}
	
	@Test
	public void testGetResourceIdName() {
		String resourceIdName = Resource.getResourceIdName();
		assert(resourceIdName.length() > 3);
	}

}
