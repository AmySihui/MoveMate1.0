package com.movemate.server.controller;

import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.service.TrafficEventImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-images")
@RequiredArgsConstructor
@Tag(name = "Traffic Event Images", description = "Event Images management")
public class TrafficEventImageController {

    private final TrafficEventImageService service;

    @Operation(summary = "Get images for a event")
    @GetMapping("/event/{eventId}")
    public List<TrafficEventImage> getImagesByEvent(@PathVariable Long eventId) {
        return service.findByEventId(eventId);
    }

    @Operation(summary = "Get event image by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TrafficEventImage> getImageById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new event image")
    @PostMapping
    public TrafficEventImage create(@RequestBody TrafficEventImage image) {
        return service.save(image);
    }

    @Operation(summary = "Delete event image")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Report a event image")
    @PostMapping("/report/{id}")
    public ResponseEntity<String> reportImage(@PathVariable Long id) {
        service.reportImage(id);
        return ResponseEntity.ok("Image reported successfully.");
    }
}
