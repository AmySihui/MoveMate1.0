package com.movemate.server.controller;

import com.movemate.server.dto.TrafficEventDTO;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.repository.TrafficEventRepository;
import com.movemate.server.service.TrafficEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class TrafficEventController {

    private final TrafficEventService service;
    private final TrafficEventRepository trafficEventRepository;

    public TrafficEventController(TrafficEventService service, TrafficEventRepository trafficEventRepository) {
        this.service = service;
        this.trafficEventRepository = trafficEventRepository;
    }

    @GetMapping
    public List<TrafficEvent> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrafficEvent> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TrafficEvent create(@RequestBody TrafficEvent event) {
        return service.save(event);
    }

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
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam String userSub) {
        boolean deleted = service.deleteByIdAndUserSub(id, userSub);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(403).build(); // 没权限
        }
    }

    @GetMapping("/with-images")
    public List<TrafficEventDTO> getAllWithImages() {
        return service.findAllWithImages();
    }

    @GetMapping("/{id}/with-images")
    public ResponseEntity<TrafficEventDTO> getByIdWithImages(@PathVariable Long id) {
        return service.findByIdWithImages(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<TrafficEventDTO>> getTodayEvents() {
        LocalDateTime startOfDay = LocalDate.now(ZoneOffset.UTC).atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<TrafficEvent> events = trafficEventRepository.findByCreatedAtBetween(startOfDay, endOfDay);

        List<TrafficEventDTO> eventDTOs = events.stream().map(event -> {
            TrafficEventDTO dto = new TrafficEventDTO();
            dto.setId(event.getId());
            dto.setEventType(event.getEventType());
            dto.setDescription(event.getDescription());
            dto.setLineName(event.getLineName());
            dto.setStopName(event.getStopName());
            dto.setLatitude(event.getLatitude());
            dto.setLongitude(event.getLongitude());
            dto.setStatus(event.getStatus());
            dto.setUserSub(event.getUserSub());
            dto.setCreatedAt(event.getCreatedAt());
            dto.setImageUrls(List.of());
            return dto;
        }).toList();

        return ResponseEntity.ok(eventDTOs);
    }




}
