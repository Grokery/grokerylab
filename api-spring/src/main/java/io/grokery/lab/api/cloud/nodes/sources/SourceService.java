package io.grokery.lab.api.cloud.nodes.sources;

import javax.ws.rs.core.MultivaluedMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.grokery.lab.api.cloud.nodes.dao.NodesDAO;
import io.grokery.lab.api.common.JsonObj;
import io.grokery.lab.api.common.context.CloudContext;
import io.grokery.lab.api.common.dao.DAO;
import io.grokery.lab.api.common.exceptions.InvalidInputException;
import io.grokery.lab.api.common.exceptions.NotAuthorizedException;
import io.grokery.lab.api.common.exceptions.NotFoundException;

public class SourceService {

    private static final Logger LOG = LoggerFactory.getLogger(SourceService.class);

    public static JsonObj query(String auth, String cloudId, String sourceId, MultivaluedMap<String, String> request) throws NotAuthorizedException, InvalidInputException, NotFoundException {
        CloudContext context = new CloudContext(cloudId, auth);

        DAO dao = NodesDAO.getInst(context);
		Source source = (Source) Source.fromJsonObj(dao.get("SOURCE", sourceId), context);

        return source.query(context, request);
    }

    public static JsonObj write(String auth, String cloudId, String sourceId, JsonObj request) throws NotAuthorizedException, InvalidInputException, NotFoundException {
        CloudContext context = new CloudContext(cloudId, auth);

        DAO dao = NodesDAO.getInst(context);
		Source source = (Source) Source.fromJsonObj(dao.get("SOURCE", sourceId), context);

        source.write(context, request);
        return null;
    }

}