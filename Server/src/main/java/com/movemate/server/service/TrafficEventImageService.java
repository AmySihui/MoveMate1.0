package com.movemate.server.service;

import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.repository.TrafficEventImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrafficEventImageService {

    private final TrafficEventImageRepository repository;

    public TrafficEventImageService(TrafficEventImageRepository repository) {
        this.repository = repository;
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
}
