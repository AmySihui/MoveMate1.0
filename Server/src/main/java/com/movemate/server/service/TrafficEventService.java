package com.movemate.server.service;

import com.movemate.server.dto.EventWithImageRequest;
import com.movemate.server.dto.TrafficEventDTO;
import com.movemate.server.enums.EventStatus;
import com.movemate.server.model.TrafficEvent;
import com.movemate.server.model.TrafficEventImage;
import com.movemate.server.repository.TrafficEventImageRepository;
import com.movemate.server.repository.TrafficEventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TrafficEventService {

    private final TrafficEventRepository eventRepository;
    private final TrafficEventImageRepository imageRepository;
    private final HuggingfaceModerationService moderationService;
    private final TrafficEventRepository trafficEventRepository;


    private static final int REPORT_THRESHOLD = 3;
    private static final int EXPIRE_DAYS = 7;

    public List<TrafficEvent> findAllActive() {
        return eventRepository.findByStatus(EventStatus.ACTIVE).stream()
                .filter(this::notExpired)
                .collect(Collectors.toList());
    }

    public Optional<TrafficEvent> findById(Long id) {
        return eventRepository.findById(id);
    }


    public List<TrafficEventDTO> findAllWithImages() {
        return findAllActive().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public Optional<TrafficEventDTO> findByIdWithImages(Long id) {
        return eventRepository.findById(id)
                .filter(event -> event.getStatus() == EventStatus.ACTIVE)
                .filter(this::notExpired)
                .map(this::mapToDTO);
    }

    public TrafficEvent saveWithModeration(TrafficEvent event) {
        if (moderationService.isFlagged(event.getDescription())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Your event contains sensitive words, please modify and try again."
            );
        }
        return eventRepository.save(event);
    }

    public void reportEvent(Long eventId) {
        eventRepository.findById(eventId).ifPresent(event -> {
            event.setReportCount(event.getReportCount() + 1);
            if (event.getReportCount() >= REPORT_THRESHOLD) {
                event.setStatus(EventStatus.REPORTED);
            }
            eventRepository.save(event);
        });
    }

    public void reportImage(Long imageId) {
        imageRepository.findById(imageId).ifPresent(image -> {
            image.setReportCount(image.getReportCount() + 1);
            if (image.getReportCount() >= REPORT_THRESHOLD) {
                image.setStatus(EventStatus.HIDDEN);
            }
            imageRepository.save(image);
        });
    }

    private TrafficEventDTO mapToDTO(TrafficEvent event) {
        List<String> imageUrls = imageRepository.findByTrafficEventId(event.getId()).stream()
                .filter(image -> image.getStatus() == EventStatus.ACTIVE)
                .map(TrafficEventImage::getImageUrl)
                .collect(Collectors.toList());

        TrafficEventDTO dto = new TrafficEventDTO();
        dto.setId(event.getId());
        dto.setEventType(event.getEventType());
        dto.setDescription(event.getDescription());
        dto.setLineName(event.getLineName());
        dto.setStopName(event.getStopName());
        dto.setLatitude(event.getLatitude());
        dto.setLongitude(event.getLongitude());
        dto.setStatus(String.valueOf(event.getStatus()));
        dto.setUserSub(event.getUserSub());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setImageUrls(imageUrls);
        return dto;
    }

    private boolean notExpired(TrafficEvent event) {
        return event.getCreatedAt().plusDays(EXPIRE_DAYS).isAfter(LocalDateTime.now());
    }

    public boolean deleteByIdAndUserSub(Long id, String userSub) {
        eventRepository.deleteByIdAndUserSub(id, userSub);
        return true;
    }

    public TrafficEvent createWithImage(EventWithImageRequest request) {
        if (moderationService.isFlagged(request.getDescription())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your event contains sensitive words, please modify and try again.");
        }

        TrafficEvent event = new TrafficEvent();
        event.setEventType(request.getEventType());
        event.setDescription(request.getDescription());
        event.setStopName(request.getStopName());
        event.setLatitude(request.getLatitude());
        event.setLongitude(request.getLongitude());
        event.setLineName(request.getLineName());
        event.setUserSub(request.getUserSub());

        TrafficEvent savedEvent = eventRepository.saveAndFlush(event);
        log.info("Event saved with ID={}", savedEvent.getId());

        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            TrafficEventImage image = new TrafficEventImage();
            image.setTrafficEvent(savedEvent);
            image.setImageUrl(request.getImageUrl());
            imageRepository.save(image);
            log.info("Image saved for Event ID={}, Image URL={}", savedEvent.getId(), request.getImageUrl());
        }

        return savedEvent;
    }

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
            dto.setStatus(String.valueOf(event.getStatus()));
            dto.setUserSub(event.getUserSub());
            dto.setCreatedAt(event.getCreatedAt());
            dto.setImageUrls(List.of());
            return dto;
        }).toList();

        return ResponseEntity.ok(eventDTOs);
    }


}
