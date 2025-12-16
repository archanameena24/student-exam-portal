package com.isquareinfo.portal.controller;

import com.isquareinfo.portal.service.ExamService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STUDENT')")
public class ExamController {
    @Autowired private ExamRepository examRepository;
    @Autowired private ExamAttemptRepository attemptRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private QuestionRepository questionRepository;

    @Autowired
    private ExamService examService;

//   @GetMapping
//   public List<Exam> listExams() { return examRepository.findAll(); }

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        try {
            List<Exam> exams = examService.getAllExams();
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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
    public ResponseEntity<ExamAttempt> autosave(@PathVariable Long attemptId,
                                                @RequestBody List<Map<String,String>> answers) {
        try {
            // Convert the incoming map to Answer objects
            List<Answer> answersList = answers.stream()
                    .map(a -> {
                        Long qid = Long.valueOf(a.get("questionId"));
                        String opt = a.get("selectedOption");
                        Question q = questionRepository.findById(qid)
                                .orElseThrow(() -> new EntityNotFoundException("Question not found: " + qid));

                        Answer ans = new Answer();
                        ans.setQuestion(q);
                        ans.setSelectedOption(opt);
                        ans.setIsCorrect(opt != null && opt.equals(q.getCorrectOption()));
                        ans.setMarksAwarded(ans.getIsCorrect() ? q.getMarks() : 0);
                        return ans;
                    })
                    .collect(Collectors.toList());

            // Call the service method
            ExamAttempt savedAttempt = examService.autoSaveAttempt(attemptId, answersList);
            return ResponseEntity.ok(savedAttempt);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
/*    @PostMapping("/saveExam")
    public Exam create(@RequestBody Exam exam) {
        return examRepository.save(exam);
    }*/
    @PostMapping("/admin/saveExam")
    public ResponseEntity<Exam> saveExam(@RequestBody Exam exam) {
        try {
            Exam savedExam = examService.saveExam(exam);
            return ResponseEntity.ok(savedExam);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/admin/{examId}/questions")
    public ResponseEntity<?> addQuestionsToExam(
            @PathVariable Long examId,
            @RequestBody Set<Long> questionIds) {
        try {
            Exam updatedExam = examService.addQuestionsToExam(examId, questionIds);
            return ResponseEntity.ok(updatedExam);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error adding questions: " + e.getMessage());
        }
    }




}
