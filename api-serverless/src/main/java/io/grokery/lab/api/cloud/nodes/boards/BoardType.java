package io.grokery.lab.api.cloud.nodes.boards;

/**
 * Defines dashboard types
 *
 * @author hogue
 */
public enum BoardType {
	GENERIC("Generic");

	private String typeName;

	BoardType(String typeName) {
		this.typeName = typeName;
	}

	public String getTypeName() {
		return typeName;
	}

}
