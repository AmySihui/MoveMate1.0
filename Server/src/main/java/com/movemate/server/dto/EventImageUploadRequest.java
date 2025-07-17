package com.movemate.server.dto;

import lombok.Data;

@Data
public class EventImageUploadRequest {
    private Long eventId;
    private String imageUrl;
}
