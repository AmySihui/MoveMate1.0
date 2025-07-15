package com.movemate.server.repository;

import com.movemate.server.model.TrafficEventImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficEventImageRepository extends JpaRepository<TrafficEventImage, Long> {
    // 根据事件查询对应图片列表
    List<TrafficEventImage> findByTrafficEventId(Long eventId);
}
