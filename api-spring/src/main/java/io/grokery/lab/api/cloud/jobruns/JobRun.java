package io.grokery.lab.api.cloud.jobruns;

import java.util.Map;

public class JobRun {

    String jobrunId;
    String jobId;
    String s3LogPath;
    String runStatus;
    String startTime;
    String endTime;

    public JobRun() {

    }

    public JobRun(Map<String, Object> obj) {
        // TODO get field values from obj
    }

}
