package com.isquareinfo.portal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.isquareinfo.portal.repository.ExamRepository;
import com.isquareinfo.portal.repository.ExamAttemptRepository;
import com.isquareinfo.portal.repository.UserRepository;
import com.isquareinfo.portal.repository.QuestionRepository;
import com.isquareinfo.portal.model.Exam;
import com.isquareinfo.portal.model.ExamAttempt;
import com.isquareinfo.portal.model.Answer;
import com.isquareinfo.portal.model.Question;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/exams")
public class ExamController {
    @Autowired private ExamRepository examRepository;
    @Autowired private ExamAttemptRepository attemptRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private QuestionRepository questionRepository;

    @GetMapping
    public List<Exam> listExams() { return examRepository.findAll(); }

    @GetMapping("/{id}")
    public Exam getExam(@PathVariable Long id) { return examRepository.findById(id).orElseThrow(); }

    @PostMapping("/{id}/start")
    public ExamAttempt startExam(@PathVariable Long id, @RequestParam String username) {
        Exam exam = examRepository.findById(id).orElseThrow();
        var user = userRepository.findByUsername(username).orElseThrow();
        ExamAttempt attempt = new ExamAttempt();
        attempt.setExam(exam);
        attempt.setStudent(user);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setSynced(true);
        attempt.setAnswers(new ArrayList<>());
        return attemptRepository.save(attempt);
    }

    @PostMapping("/attempt/{attemptId}/autosave")
    public ExamAttempt autosave(@PathVariable Long attemptId, @RequestBody List<Map<String,String>> answers) {
        ExamAttempt attempt = attemptRepository.findById(attemptId).orElseThrow();
        List<Answer> out = new ArrayList<>();
        for (Map<String,String> a : answers) {
            Long qid = Long.valueOf(a.get("questionId"));
            String opt = a.get("selectedOption");
            Question q = questionRepository.findById(qid).orElseThrow();
            Answer ans = new Answer();
            ans.setQuestion(q);
            ans.setSelectedOption(opt);
            ans.setIsCorrect(opt != null && opt.equals(q.getCorrectOption()));
            ans.setMarksAwarded(ans.getIsCorrect() ? q.getMarks() : 0);
            out.add(ans);
        }
        attempt.setAnswers(out);
        attempt.setSynced(false);
        return attemptRepository.save(attempt);
    }

    @PostMapping("/attempt/{attemptId}/finish")
    public Map<String,Object> finish(@PathVariable Long attemptId) {
        ExamAttempt attempt = attemptRepository.findById(attemptId).orElseThrow();
        int score = attempt.getAnswers().stream().mapToInt(a -> a.getMarksAwarded()==null?0:a.getMarksAwarded()).sum();
        attempt.setScore(score);
        attempt.setFinishedAt(LocalDateTime.now());
        attempt.setSynced(true);
        attemptRepository.save(attempt);
        return Map.of("score", score, "attemptId", attempt.getId());
    }
}
