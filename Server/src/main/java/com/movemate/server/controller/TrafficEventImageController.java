package com.movemate.server.controller;

import com.movemate.server.dto.EventImageUploadRequest;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.service.TrafficEventImageService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-images")
public class TrafficEventImageController {

    private final TrafficEventImageService service;

    public TrafficEventImageController(TrafficEventImageService service) {
        this.service = service;
    }

    @GetMapping("/event/{eventId}")
    public List<TrafficEventImage> getImagesByEvent(@PathVariable Long eventId) {
        return service.findByEventId(eventId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrafficEventImage> getImageById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TrafficEventImage create(@RequestBody TrafficEventImage image) {
        return service.save(image);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload-complete")
    public TrafficEventImage uploadComplete(@RequestBody EventImageUploadRequest request) {
        return service.handleUploadComplete(request);
    }







}
