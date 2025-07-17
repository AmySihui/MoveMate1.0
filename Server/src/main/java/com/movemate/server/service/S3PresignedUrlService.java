package com.movemate.server.service;

import com.movemate.server.dto.PresignedUrlResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URL;
import java.time.Duration;
import java.util.UUID;

@Service
public class S3PresignedUrlService {

    private final S3Presigner presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.base-url}")
    private String baseUrl;

    public S3PresignedUrlService(S3Presigner presigner) {
        this.presigner = presigner;
    }

    public PresignedUrlResponse generatePresignedUrl(String folder, String fileName, String contentType) {
        String key = folder + "/" + UUID.randomUUID() + "-" + fileName;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(objectRequest)
                .build();

        URL uploadUrl = presigner.presignPutObject(presignRequest).url();
        String imageUrl = baseUrl + "/" + key;

        return new PresignedUrlResponse(uploadUrl.toString(), imageUrl);
    }
}