package io.grokery.lab.api.cloud.jobruns;

import io.grokery.lab.api.common.JsonObj;

public class JobRun {

    String jobrunId;
    String jobId;
    String s3LogPath;
    String runStatus;
    String startTime;
    String endTime;

    public JobRun() {

    }

    public JobRun(JsonObj obj) {
        // TODO get field values from obj
    }

}
