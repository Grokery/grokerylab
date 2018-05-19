package io.grokery.lab.api.common;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;

import io.grokery.lab.api.common.GrokeryContext;

public class ContextCredentialUtil implements AWSCredentialsProvider {
   
    private String AccessKeyId;
    private String SecretKey;
    
    public ContextCredentialUtil(GrokeryContext context) {
		this.AccessKeyId = context.awsAccessKeyId;
		this.SecretKey = context.awsSecretKey;
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
