package io.grokery.lab.api.core.resources;

import java.util.Iterator;
import java.util.UUID;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.core.resources.charts.Chart;
import io.grokery.lab.api.core.resources.dashboards.Dashboard;
import io.grokery.lab.api.core.resources.dataflows.Dataflow;
import io.grokery.lab.api.core.resources.entries.Entry;
import io.grokery.lab.api.core.resources.jobruns.JobRun;
import io.grokery.lab.api.core.resources.jobs.Job;
import io.grokery.lab.api.core.resources.notebooks.Notebook;
import io.grokery.lab.api.core.resources.projects.Project;
import io.grokery.lab.api.core.resources.sources.Datasource;

/**
 * Contains the fields and logic common to all API resource types as well as 
 * defining a common interface for all resources
 * 
 * @author hogue
 */
public class Resource {

	private static final Logger LOGGER = LoggerFactory.getLogger(Resource.class);

	private String cloudId;
	private ResourceTypes collection;
	private UUID guid;
	private String title;
	private String description;
	
	public static String getCloudIdName() {
		return "cloudId";
	}

	public static String getResourceTypeName() {
		return "collection";
	}
	
	public static String getResourceIdName() {
		return "guid";
	}
	
	public Resource() {
		this.collection = ResourceTypes.RESOURCES;
		this.guid = UUID.randomUUID();
	}
	
	protected Resource(ResourceTypes collection) {
		this.collection = collection;
		this.guid = UUID.randomUUID();
	}
	
	/**
	 * 
	 * 
	 */
	public void initialize() {
		
	}
		
	/**
	 * 
	 * 
	 */
	public void transitionTo(Resource other) {
		
	}
	
	/**
	 * 
	 * 
	 */
	public void transitionFrom(Resource other) {
		
	}
		
	/**
	 * 
	 * 
	 */
	public void decomission() {
		
	}
		
	/**
	 * Checks if Resource has required fields
	 * @throws InvalidInputException 
	 * 
	 */
	public void validate() throws InvalidInputException {
		if (this.collection == null) {
			throw new InvalidInputException("Missing required field: '"+Resource.getResourceTypeName()+"'. Must be a valid IAPIResourceType");
		}
		if (this.guid.toString().length() != 36) {
			throw new InvalidInputException("Missing or invalid required field: '"+Resource.getResourceIdName()+"'. Should be valid UUID string.");
		}
	}
	
	/**
	 * Returns a generic Key/Value Map of this object's values
	 * 
	 */
	public Map<String, Object> toMap() {
        return Resource.toMap(this);
    }
	
	/**
	 * Maps an Resource to a generic Key/Value Map
	 * 
	 * @param obj : the Resource object to map
	 * @return obj : a Map<String, Object>
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> toMap(Resource obj) {
        Map<String, Object> result = ResourceMapper.getInstance().convertValue(obj, Map.class);
        return result;
    }
	
	/**
	 * Removes any null values from the map. It makes it easy to do partial updates
	 * 
	 * @param obj : a Map<String, Object>
	 * @return obj : a Map<String, Object>
	 */
	public static Map<String, Object> RemoveNullValues(Map<String, Object> obj) {
      for(Iterator<Map.Entry<String, Object>> it = obj.entrySet().iterator(); it.hasNext(); ) {
          Map.Entry<String, Object> entry = it.next();
          if(entry.getValue() == null) {
              it.remove();
          }
      }
      return obj;
	}
    
	/**
	 * Maps a generic Key/Value Map to the Resource class defined in map
	 * 
	 * @param obj the generic Key/Value Map
	 * @throws UnknownInputException 
	 * @return Resource type
	 */
	public static Resource fromMap(Map<String, Object> obj) throws InvalidInputException {
        return Resource.fromMap(obj, Resource.getClassInstance(obj));
    }
    
	/**
	 * Maps a generic Key/Value Map to the given Resource Class
	 * 
	 * @param obj the generic Key/Value Map
	 * @param toValueType Resource type instance
	 * @return Resource type
	 */
	public static Resource fromMap(Map<String, Object> obj, Resource toValueType) {
		return ResourceMapper.getInstance().convertValue(obj, toValueType.getClass());
    }
	
	/**
	 * Gets correct class instance to map to from generic Key/Value Map
	 * 
	 * @param obj Key/Value Map with "collection" key defined
	 * @throws UnknownInputException 
	 */
    public static Resource getClassInstance(Map<String, Object> obj) throws InvalidInputException {
		try {
			LOGGER.info("Get class instance for collection="+obj.get(Resource.getResourceTypeName()).toString());
			ResourceTypes collection = ResourceTypes.valueOf(obj.get(Resource.getResourceTypeName()).toString());
			switch (collection) {
				case RESOURCES:
					return new Resource();
				case JOBS:
					return Job.getClassInstance(obj);
				case JOBRUNS:
					return new JobRun();
				case DATASOURCES:
					return Datasource.getClassInstance(obj);
				case CHARTS:
					return new Chart();
				case NOTEBOOKS:
					return new Notebook();
				case DASHBOARDS:
					return new Dashboard();
				case PROJECTS:
					return new Project();
				case DATAFLOWS:
					return new Dataflow();
				case ENTRIES:
					return new Entry();
				default:
					throw new NotImplementedError();
			}
		} catch (IllegalArgumentException e) {
			String message = "Unknown ResourceTypes";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);	
		} catch (NullPointerException e) {
			String message = "ResourceTypes specification required";
			LOGGER.error(message, e);
			throw new InvalidInputException(message);	
        }
	}

	/**
	 * @return the cloudId
	 */
	public String getCloudId() {
		return cloudId;
	}

	/**
	 * @param cloudId the cloudId to set
	 */
	public void setCloudId(String cloudId) {
		this.cloudId = cloudId;
	}
	
	/**
	 * @return the collection
	 */
	public ResourceTypes getCollection() {
		return collection;
	}

	/**
	 * @param collection the collection to set
	 */
	public void setCollection(ResourceTypes collection) {
		this.collection = collection;
	}

	/**
	 * @return the guid
	 */
	public UUID getGuid() {
		return guid;
	}

	/**
	 * @param guid the guid to set
	 */
	public void setGuid(UUID guid) {
		this.guid = guid;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	
}
