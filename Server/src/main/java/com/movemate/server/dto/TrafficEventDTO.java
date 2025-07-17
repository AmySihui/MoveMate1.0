package com.movemate.server.dto;

import com.movemate.server.model.TrafficEventImage;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TrafficEventDTO {
    private Long id;
    private String eventType;
    private String description;
    private String lineName;
    private String stopName;
    private Double latitude;
    private Double longitude;
    private String status;
    private String userSub;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
}
