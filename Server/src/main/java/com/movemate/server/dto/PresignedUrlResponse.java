package com.movemate.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PresignedUrlResponse {
    private String uploadUrl;
    private String imageUrl;
} 
