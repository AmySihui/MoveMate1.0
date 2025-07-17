package com.movemate.server.controller;

import com.movemate.server.dto.PresignedUrlResponse;
import com.movemate.server.service.S3PresignedUrlService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class S3Controller {

    private final S3PresignedUrlService presignedUrlService;

    public S3Controller(S3PresignedUrlService presignedUrlService) {
        this.presignedUrlService = presignedUrlService;
    }

    @GetMapping("/api/s3/presigned-url")
    public PresignedUrlResponse getPresignedUrl(@RequestParam String folder, @RequestParam String fileName, @RequestParam String contentType) {
        return presignedUrlService.generatePresignedUrl(folder, fileName, contentType);
    }
}
