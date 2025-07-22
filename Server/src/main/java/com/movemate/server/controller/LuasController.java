package com.movemate.server.controller;

import com.movemate.server.service.DartService;
import com.movemate.server.service.LuasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/luas")
@Tag(name = "Luas", description = "Luas line and station")
public class LuasController {

    private final LuasService luasService;

    public LuasController(LuasService luasService) {
        this.luasService = luasService;
    }

    @Operation(summary = "Get all stations")
    @GetMapping("/stations")
    public ResponseEntity<Resource> getStations() {
        ClassPathResource resource = new ClassPathResource("luas-stations.geojson");
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(resource);
    }

    @Operation(summary = "Get lines")
    @GetMapping("/lines")
    public ResponseEntity<Resource> getLines() {
        ClassPathResource resource = new ClassPathResource("luas-lines.geojson");
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(resource);
    }

    @Operation(summary = "Get a specific station with realtime data")
    @CrossOrigin
    @GetMapping("/forecast")
    public ResponseEntity<String> getForecast(@RequestParam String stop) {
        return luasService.getForecast(stop);
    }

    @Operation(summary = "Get stop ID by station name")
    @GetMapping("/stop-id")
    public ResponseEntity<String> getStopId(@RequestParam String name) {
        return luasService.getStopId(name);
    }

}
