package com.movemate.server.repository;

import com.movemate.server.model.TrafficEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrafficEventRepository extends JpaRepository<TrafficEvent, Long> {

}
