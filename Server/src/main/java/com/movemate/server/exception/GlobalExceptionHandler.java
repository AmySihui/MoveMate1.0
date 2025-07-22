package com.movemate.server.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getReason() != null ? ex.getReason() : "Bad Request");
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Operation failed due to data integrity violation.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex, HttpServletRequest request) throws Exception {
        String path = request.getRequestURI();
        // 放行 OpenAPI 相关请求
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
            throw ex;
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Server error, please try again later.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
