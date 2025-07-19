package com.movemate.server.repository;

import com.movemate.server.model.TrafficEventImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficEventImageRepository extends JpaRepository<TrafficEventImage, Long> {
    List<TrafficEventImage> findByTrafficEventId(Long eventId);
}
