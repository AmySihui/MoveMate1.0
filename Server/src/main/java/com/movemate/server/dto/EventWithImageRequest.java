package com.movemate.server.dto;

import lombok.Data;

@Data
public class EventWithImageRequest {
    private String eventType;
    private String description;
    private String stopName;
    private Double latitude;
    private Double longitude;
    private String lineName;
    private String imageUrl;
    private String userSub;
}
