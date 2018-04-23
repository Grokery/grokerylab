package io.grokery.api.lab.resources;

/**
 * Defines top level API resource type collections
 * 
 * @author hogue
 */
public enum ResourceTypes {
	RESOURCES("Resource"),
	JOBS("Job"),
	JOBRUNS("JobRun"),
	DATASOURCES("DataSource"),
	CHARTS("Chart"),
	NOTEBOOKS("NoteBook"),
	DASHBOARDS("DashBoard"),
	PROJECTS("Project"),
	DATAFLOWS("DataFlow"),
	ENTRIES("Entry");

	private String typeName;
 
    ResourceTypes(String typeName) {
        this.typeName = typeName;
    }
 
    public String getTypeName() {
        return typeName;
	}
	
}
