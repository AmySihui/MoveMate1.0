package com.movemate.server.dto;

import lombok.Data;

@Data
public class DartRealtimeDTO {
    private String trainCode;
    private String origin;
    private String destination;
    private String expArrival;
    private String expDeparture;
    private String status;
    private String direction;
    private Integer dueIn;
    private Integer late;
    private String lastLocation;
}
