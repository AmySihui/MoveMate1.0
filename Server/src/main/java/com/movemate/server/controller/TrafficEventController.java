package com.movemate.server.controller;

import com.movemate.server.dto.EventWithImageRequest;
import com.movemate.server.dto.TrafficEventDTO;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.repository.TrafficEventRepository;
import com.movemate.server.service.RateLimiterService;
import com.movemate.server.service.TrafficEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Traffic Events", description = "Events management")
public class TrafficEventController {

    private final TrafficEventService service;
    private final RateLimiterService rateLimiter;
    private final TrafficEventService trafficEventService;

    @Operation(summary = "Get all events")
    @GetMapping
    public List<TrafficEvent> getAll() {
        return service.findAllActive();
    }

    @Operation(summary = "Find a specific event")
    @GetMapping("/{id}")
    public ResponseEntity<TrafficEvent> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "User upload event")
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody TrafficEvent event,
                                         @RequestHeader("X-User-Sub") String userSub,
                                         @RequestHeader("X-Forwarded-For") String ip) {
        if (!rateLimiter.canSubmit(userSub, ip)) {
            return ResponseEntity.status(429).body("Rate limit exceeded");
        }
        event.setUserSub(userSub);
        service.saveWithModeration(event);
        rateLimiter.recordSubmit(userSub, ip);
        return ResponseEntity.ok(event.getId().toString());
    }

    @Operation(summary = "flag inappropriate event")
    @PostMapping("/report/{id}")
    public ResponseEntity<String> reportEvent(@PathVariable Long id) {
        service.reportEvent(id);
        return ResponseEntity.ok("Event reported successfully");
    }

    // not provide maybe next version
    @Operation(summary = "User modify event")
    @PutMapping("/{id}")
    public ResponseEntity<TrafficEvent> update(@PathVariable Long id, @RequestBody TrafficEvent event) {
        return service.findById(id)
                .map(existing -> {
                    existing.setEventType(event.getEventType());
                    existing.setDescription(event.getDescription());
                    existing.setLineName(event.getLineName());
                    existing.setStopName(event.getStopName());
                    existing.setLatitude(event.getLatitude());
                    existing.setLongitude(event.getLongitude());
                    existing.setStatus(event.getStatus());
                    existing.setUserSub(event.getUserSub());
                    return ResponseEntity.ok(service.saveWithModeration(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "User delete event")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam String userSub) {
        boolean deleted = service.deleteByIdAndUserSub(id, userSub);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @Operation(summary = "Get all events with images")
    @GetMapping("/with-images")
    public List<TrafficEventDTO> getAllWithImages() {
        return service.findAllWithImages();
    }

    @Operation(summary = "Get specific event with images")
    @GetMapping("/{id}/with-images")
    public ResponseEntity<TrafficEventDTO> getByIdWithImages(@PathVariable Long id) {
        return service.findByIdWithImages(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get today's announcements")
    @GetMapping("/announcements")
    public ResponseEntity<List<TrafficEventDTO>> getTodayEvents() {
        return trafficEventService.getTodayEvents();
    }

    @Operation(summary = "Create event with images")
    @PostMapping("/create-with-image")
    public TrafficEvent createWithImage(@RequestBody EventWithImageRequest request) {
        return service.createWithImage(request);
    }

}
