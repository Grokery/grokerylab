package io.grokery.api.lab.dao;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;

import io.grokery.api.common.GrokeryContext;

public class ContextCredentialProvider implements AWSCredentialsProvider {
   
    private String AccessKeyId;
    private String SecretKey;
    
    public ContextCredentialProvider(GrokeryContext context) {
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
