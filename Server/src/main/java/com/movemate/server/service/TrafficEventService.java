package com.movemate.server.service;

import com.movemate.server.dto.TrafficEventDTO;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.repository.TrafficEventImageRepository;
import com.movemate.server.repository.TrafficEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrafficEventService {

    private final TrafficEventRepository eventRepository;
    private final TrafficEventImageRepository imageRepository;


    public TrafficEventService(TrafficEventRepository eventRepository,
                               TrafficEventImageRepository imageRepository) {
        this.eventRepository = eventRepository;
        this.imageRepository = imageRepository;
    }

    public List<TrafficEvent> findAll() {
        return eventRepository.findAll();
    }

    public Optional<TrafficEvent> findById(Long id) {
        return eventRepository.findById(id);
    }

    public TrafficEvent save(TrafficEvent event) {
        return eventRepository.save(event);
    }

    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    public List<TrafficEventDTO> findAllWithImages() {
        List<TrafficEvent> events = eventRepository.findAll();

        return events.stream().map(event -> {
            List<TrafficEventImage> images = imageRepository.findByTrafficEventId(event.getId());
            List<String> imageUrls = images.stream()
                    .map(TrafficEventImage::getImageUrl)
                    .toList();

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
            dto.setImageUrls(imageUrls);

            return dto;
        }).toList();
    }

    public Optional<TrafficEventDTO> findByIdWithImages(Long id) {
        return eventRepository.findById(id).map(event -> {
            List<TrafficEventImage> images = imageRepository.findByTrafficEventId(event.getId());
            List<String> imageUrls = images.stream()
                    .map(TrafficEventImage::getImageUrl)
                    .toList();

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
            dto.setImageUrls(imageUrls);
            return dto;
        });
    }

}
