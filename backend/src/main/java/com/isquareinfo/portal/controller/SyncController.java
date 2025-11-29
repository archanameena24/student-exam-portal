package com.isquareinfo.portal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.isquareinfo.portal.repository.ExamAttemptRepository;
import com.isquareinfo.portal.model.ExamAttempt;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sync")
public class SyncController {
    @Autowired private ExamAttemptRepository attemptRepository;

    @PostMapping("/attempts")
    public Map<String,Object> syncAttempts(@RequestParam String username, @RequestBody List<ExamAttempt> attempts) {
        attempts.forEach(a -> a.setId(null));
        List<ExamAttempt> saved = attemptRepository.saveAll(attempts);
        return Map.of("syncedCount", saved.size());
    }
}
