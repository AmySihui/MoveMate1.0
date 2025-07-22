package com.movemate.server.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class HuggingfaceModerationService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    private WebClient webClient;

    @PostConstruct
    private void init() {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public boolean isFlagged(String content) {
        try {
            Map<String, String> requestBody = Map.of("inputs", content);

            List<List<Map<String, Object>>> response = webClient.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (response == null || response.isEmpty()) return false;
            List<Map<String, Object>> predictions = response.get(0);
            if (predictions == null || predictions.isEmpty()) return false;

            for (Map<String, Object> result : predictions) {
                String label = (String) result.get("label");
                double score = Double.parseDouble(result.get("score").toString());
                log.info("label={}, score={}", label, score);
                if ("toxic".equalsIgnoreCase(label) && score >= 0.7) {
                    log.warn("Detected toxic content with score {}", score);
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            log.error("Huggingface moderation failed", e);
            return false;
        }
    }
}
