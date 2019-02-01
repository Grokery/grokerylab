package io.grokery.lab.api.cloud.nodes.sources;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import io.grokery.lab.api.cloud.nodes.dao.NodesDAO;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.exceptions.NotFoundException;

/**
 * Json data
 *
 * @author hogue
 */
public class JsonSource extends Source {

	private JsonObj jsonData;

	public JsonSource() {
		this.initializeDefaults();
	}

	protected void initializeDefaults() {
		super.initializeDefaults();

		this.setSubType(SourceType.JSON.toString());
	}

	public void setValues(JsonObj newData) {
		super.setValues(newData);

		// TODO limit input data size to something reasonable
		this.jsonData = newData.get("jsonData") != null ? new JsonObj(newData.get("jsonData")) : this.jsonData;
	}

	public Object query(CloudContext context, JsonObj request) {
		// TODO validate query
		return this.getJsonData();
	}

	public void write(CloudContext context, JsonObj request) throws NotFoundException {
		// TODO limit input data size to something reasonable
		// this.setJsonData(request.getJsonObj("jsonData"));
		// DAO dao = NodesDAO.getInst(context);
		// this.setUpdated(new DateTime(DateTimeZone.UTC).toString());
		// dao.update(this.getNodeType(), this.getNodeId(), this.toJsonObj());
	}

	/**
	 * @return the data
	 */
	public JsonObj getJsonData() {
		return jsonData;
	}

	/**
	 * @param data the data to set
	 */
	public void setJsonData(JsonObj jsonData) {
		this.jsonData = jsonData;
	}

}
