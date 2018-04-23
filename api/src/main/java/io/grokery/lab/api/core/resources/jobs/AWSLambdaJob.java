package io.grokery.lab.api.core.resources.jobs;

import java.util.Map;

/**
 * Contains fields and logic specific to AWS Lambda jobs
 * 
 * @author hogue
 */
public class AWSLambdaJob extends Job {
	
    public AWSLambdaJob() {
        super(JobType.AWSDATAPIPELINE);
    }
    
    public AWSLambdaJob(Map<String, Object> obj) {
        super(JobType.AWSDATAPIPELINE);
    }

    
}
