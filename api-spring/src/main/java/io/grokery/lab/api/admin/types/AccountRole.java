package io.grokery.lab.api.admin.types;

/**
 * Defines account role types
 * 
 * @author hogue
 */
public enum AccountRole {
    SUPERADMIN("SuperAdmin"),
    ADMIN("Admin"),
    USER("User");

	private String typeName;
 
    AccountRole(String typeName) {
        this.typeName = typeName;
    }
 
    public String getTypeName() {
        return typeName;
	}
	
}
