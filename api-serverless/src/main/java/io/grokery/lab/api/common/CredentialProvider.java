package io.grokery.lab.api.common;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;

public class CredentialProvider implements AWSCredentialsProvider {

    private String AccessKeyId;
    private String SecretKey;

    public CredentialProvider(String accessKeyId, String secretKey) {
		this.AccessKeyId = accessKeyId;
		this.SecretKey = secretKey;
    }

    public AWSCredentials getCredentials() {
        if (this.AccessKeyId != null && this.SecretKey != null) {
            return new BasicAWSCredentials(this.AccessKeyId, this.SecretKey);
        }
        throw new AmazonClientException("AWS credentials can not be null ");
    }

    public void refresh() {}

    @Override
    public String toString() {
        return getClass().getSimpleName();
    }
}
