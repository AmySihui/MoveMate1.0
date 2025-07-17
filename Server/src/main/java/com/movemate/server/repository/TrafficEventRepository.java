package com.movemate.server.repository;

import com.movemate.server.model.TrafficEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrafficEventRepository extends JpaRepository<TrafficEvent, Long> {
    void deleteByIdAndUserSub(Long id, String userSub);
    List<TrafficEvent> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
