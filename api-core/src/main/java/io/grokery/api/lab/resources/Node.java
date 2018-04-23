package io.grokery.api.lab.resources;

import java.util.List;
import java.util.Map;

/**
 * Contains the fields and logic common to all Nodes
 * 
 * @author hogue
 */
public class Node extends Resource {

	private Double x;
	private Double y;
	private List<Map<String, Object>> upstream;
	private List<Map<String, Object>> downstream;

	public Node() {
		super();
	}
	protected Node(ResourceTypes collection) {
		super(collection);
	}

	public Double getX() {
		return x;
	}
	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return y;
	}
	public void setY(Double y) {
		this.y = y;
	}
	public List<Map<String, Object>> getUpstream() {
		return this.upstream;
	}
	public void setUpstream(List<Map<String, Object>> upstream) {
		this.upstream = upstream;
	}
	public List<Map<String, Object>> getDownstream() {
		return this.downstream;
	}
	public void setDownstream(List<Map<String, Object>> downstream) {
		this.downstream = downstream;
	}
}
