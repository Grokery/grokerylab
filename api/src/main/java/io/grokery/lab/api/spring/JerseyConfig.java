package io.grokery.lab.api.spring;

import io.grokery.lab.api.spring.providers.CloudsProvider;
import io.grokery.lab.api.spring.providers.UsersProvider;
import io.grokery.lab.api.spring.providers.CommentsProvider;
import io.grokery.lab.api.spring.providers.JobRunsProvider;
import io.grokery.lab.api.spring.providers.HistoryProvider;
import io.grokery.lab.api.spring.providers.NodesProvider;
import io.grokery.lab.api.spring.providers.SourceProvider;
import io.grokery.lab.api.spring.ApiExceptionHandler;

import javax.annotation.PostConstruct;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.wadl.internal.WadlResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.swagger.jaxrs.config.BeanConfig;
import io.swagger.jaxrs.listing.ApiListingResource;
import io.swagger.jaxrs.listing.SwaggerSerializers;

/**
 * Jersey Configuration
 *
 * <p>
 *
 * The endpoint will expose not only the real APPs,
 * but also two important documents:
 * <li> - swagger spec: /swagger.json</li>
 * <li> - WADL spec: /application.wadl</li>
 *
 * </p>
 *
 * @author dan.hogue
 *
 */
@Component
public class JerseyConfig extends ResourceConfig {

	@Value("${info.api.version}")
	private String apiVersion;
	@Value("${spring.jersey.application-path}")
	private String apiPath;

	public JerseyConfig() {
		this.register(CloudsProvider.class);
		this.register(UsersProvider.class);
		this.register(NodesProvider.class);
		this.register(SourceProvider.class);
		this.register(JobRunsProvider.class);
		this.register(HistoryProvider.class);
		this.register(CommentsProvider.class);
		this.register(CORSFilter.class);
		this.register(ApiExceptionHandler.class);
		this.register(WadlResource.class);
	}

	@PostConstruct
	public void init() {
		this.configureSwagger();
	}

	private void configureSwagger() {
		this.register(ApiListingResource.class);
		this.register(SwaggerSerializers.class);

		BeanConfig config = new BeanConfig();
		config.setTitle("GrokeryLab API");
		config.setVersion(this.apiVersion);
		config.setContact("Dan Hogue");
		config.setSchemes(new String[] { "http", "https" });
		config.setBasePath(this.apiPath);
		config.setResourcePackage("io.grokery.lab.api.spring.providers");
		config.setPrettyPrint(true);
		config.setScan(true);
	}

}
