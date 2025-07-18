package com.movemate.server.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private static final int DAILY_LIMIT = 100;
    private static final long IP_INTERVAL_SECONDS = 5;

    private final Map<String, Integer> userDailyCount = new ConcurrentHashMap<>();
    private final Map<String, LocalDate> userLastDate = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> ipLastSubmitTime = new ConcurrentHashMap<>();

    public boolean canSubmit(String userSub, String ip) {
        // Check daily count
        LocalDate today = LocalDate.now();
        if (!today.equals(userLastDate.get(userSub))) {
            userLastDate.put(userSub, today);
            userDailyCount.put(userSub, 0);
        }
        int count = userDailyCount.getOrDefault(userSub, 0);
        if (count >= DAILY_LIMIT) return false;

        // Check IP frequency
        LocalDateTime lastSubmit = ipLastSubmitTime.getOrDefault(ip, LocalDateTime.MIN);
        if (lastSubmit.plusSeconds(IP_INTERVAL_SECONDS).isAfter(LocalDateTime.now())) {
            return false;
        }

        return true;
    }

    public void recordSubmit(String userSub, String ip) {
        userDailyCount.put(userSub, userDailyCount.getOrDefault(userSub, 0) + 1);
        ipLastSubmitTime.put(ip, LocalDateTime.now());
    }
} 
