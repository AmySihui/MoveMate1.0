package com.movemate.server.controller;

import com.movemate.server.dto.DartRealtimeDTO;
import com.movemate.server.dto.DartStationDTO;
import com.movemate.server.service.DartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dart")
@Tag(name = "Dart", description = "Dart line and station")
public class DartController {

    private final DartService dartService;

    public DartController(DartService dartService) {
        this.dartService = dartService;
    }

    @Operation(summary = "Get all stations")
    @GetMapping("/stations")
    public List<DartStationDTO> getStations() {
        return dartService.getAllStations();
    }

    @Operation(summary = "Get a specific station with realtime data")
    @GetMapping("/station/{station}")
    public List<DartRealtimeDTO> getRealtimeByStation(@PathVariable String station) {
        return dartService.getRealtimeByStation(station);
    }

    @Operation(summary = "Get lines")
    @GetMapping(value = "/lines", produces = "application/json")
    public String getLines() {
        return dartService.getLinesGeoJson();
    }

}




