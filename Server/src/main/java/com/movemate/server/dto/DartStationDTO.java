package com.movemate.server.dto;

import lombok.Data;

@Data
public class DartStationDTO {
    private String stationDesc;
    private String stationCode;
    private Double latitude;
    private Double longitude;
}
