package io.grokery.lab.api.cloud.nodes.sources;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.errors.NotImplementedError;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotFoundException;
import io.grokery.lab.api.cloud.nodes.Node;
import io.grokery.lab.api.cloud.nodes.NodeType;
import io.grokery.lab.api.cloud.nodes.dao.NodesDAO;

/**
 * Contains the fields and logic common to all DataSource types
 *
 * @author hogue
 */
public class Source extends Node {

	private static final Logger LOG = LoggerFactory.getLogger(Source.class);

	private String data;

	public Source() {
		this.initializeDefaults();
	}

    protected void initializeDefaults() {
		super.initializeDefaults();

		this.setNodeType(NodeType.SOURCE.toString());
		this.setSubType(SourceType.GENERIC.toString());
	}

	public void setValues(JsonObj newData) {
		super.setValues(newData);

		// TODO limit input data size to something reasonable
		this.data = newData.get("data") != null ? newData.getString("data") : this.data;
	}

	public Object query(CloudContext context, JsonObj request) {
		// TODO validate query
		return this.getData();
	}

	public void write(CloudContext context, JsonObj request) throws NotFoundException {
		// TODO limit input data size to something reasonable
		this.setData(request.getString("data"));
		DAO dao = NodesDAO.getInst(context);
		this.setUpdated(new DateTime(DateTimeZone.UTC).toString());
		dao.update(this.getNodeType(), this.getNodeId(), this.toJsonObj());
	}

	public static Source getClassInstance(JsonObj obj) throws InvalidInputException  {
        try {
			String subTypeStr = obj.getString(Source.getNodeSubTypeName());
			SourceType subType = SourceType.valueOf(subTypeStr);
			switch (subType) {
				case GENERIC:
					return new Source();
				case DELIMITED:
					return new DelimitedSource();
				case JSON:
					return new JsonSource();
				case AWSS3:
					return new AWSS3Source();
				default:
					throw new NotImplementedError("Following valid Source type not implemented: " + subType.toString());
			}
        } catch (IllegalArgumentException e) {
			String message = "Unknown APIResourceSubType";
			LOG.error(message, e);
			throw new InvalidInputException(message);
		} catch (NullPointerException e) {
			String message = "APIResourceSubType specification required";
			LOG.error(message, e);
			throw new InvalidInputException(message);
        }

    }

	/**
	 * @return the data
	 */
	public String getData() {
		return data;
	}

	/**
	 * @param data the data to set
	 */
	public void setData(String data) {
		this.data = data;
	}
}
