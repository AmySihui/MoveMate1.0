package com.movemate.server.service;

import com.movemate.server.dto.EventImageUploadRequest;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.repository.TrafficEventImageRepository;
import com.movemate.server.repository.TrafficEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class TrafficEventImageService {

    private final TrafficEventImageRepository repository;
    private final TrafficEventRepository eventRepository;

    public TrafficEventImageService(TrafficEventImageRepository repository,
                                    TrafficEventRepository eventRepository) {
        this.repository = repository;
        this.eventRepository = eventRepository;
    }

    public List<TrafficEventImage> findByEventId(Long eventId) {
        return repository.findByTrafficEventId(eventId);
    }

    public Optional<TrafficEventImage> findById(Long id) {
        return repository.findById(id);
    }

    public TrafficEventImage save(TrafficEventImage image) {
        return repository.save(image);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public TrafficEventImage handleUploadComplete(EventImageUploadRequest request) {
        TrafficEvent event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        TrafficEventImage image = new TrafficEventImage();
        image.setTrafficEvent(event);
        image.setImageUrl(request.getImageUrl());
        return repository.save(image);
    }
}
