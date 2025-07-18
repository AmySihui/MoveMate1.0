package com.movemate.server.service;

import com.movemate.server.dto.EventImageUploadRequest;
import com.movemate.server.enums.EventStatus;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.repository.TrafficEventImageRepository;
import com.movemate.server.repository.TrafficEventRepository;
import jakarta.transaction.Transactional;
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

    public void reportImage(Long imageId) {
        repository.findById(imageId).ifPresent(image -> {
            image.setReportCount(image.getReportCount() + 1);
            if (image.getReportCount() >= 3) {
                image.setStatus(EventStatus.HIDDEN);
            }
            repository.save(image);
        });
    }

}
