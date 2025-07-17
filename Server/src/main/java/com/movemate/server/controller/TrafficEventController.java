package com.movemate.server.controller;

import com.movemate.server.dto.TrafficEventDTO;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.service.TrafficEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class TrafficEventController {

    private final TrafficEventService service;

    public TrafficEventController(TrafficEventService service) {
        this.service = service;
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
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
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


}
