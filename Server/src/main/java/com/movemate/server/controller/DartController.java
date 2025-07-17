package com.movemate.server.controller;

import com.movemate.server.dto.DartRealtimeDTO;
import com.movemate.server.dto.DartStationDTO;
import com.movemate.server.service.DartService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dart")
public class DartController {

    private final DartService dartService;

    public DartController(DartService dartService) {
        this.dartService = dartService;
    }

    //@GetMapping("/stations")
//    public List<DartStationDTO> getStations() {
//        return dartService.getAllStations();
//    }

    @GetMapping("/station/{station}")
    public List<DartRealtimeDTO> getRealtimeByStation(@PathVariable String station) {
        return dartService.getRealtimeByStation(station);
    }

    @GetMapping(value = "/lines", produces = "application/json")
    public String getLines() {
        return dartService.getLinesGeoJson();
    }

    @GetMapping("/stations")
    public String getStations() {
        return dartService.getStationsGeoJson();
    }
}




