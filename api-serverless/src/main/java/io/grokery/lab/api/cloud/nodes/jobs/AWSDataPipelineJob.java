package io.grokery.lab.api.cloud.nodes.jobs;

import java.util.Map;

/**
 * Contains fields and logic specific to AWS DataPipeline jobs
 *
 * @author hogue
 */
public class AWSDataPipelineJob extends Job {

	private String dataPipelineId;

    public AWSDataPipelineJob() {
        super(JobType.AWSDATAPIPELINE);
    }

    public AWSDataPipelineJob(Map<String, Object> obj) {
        super(JobType.AWSDATAPIPELINE);
    }

	/**
	 * @return the dataPipelineId
	 */
	public String getDataPipelineId() {
		return dataPipelineId;
	}

	/**
	 * @param dataPipelineId the dataPipelineId to set
	 */
	public void setDataPipelineId(String dataPipelineId) {
		this.dataPipelineId = dataPipelineId;
	}

}
