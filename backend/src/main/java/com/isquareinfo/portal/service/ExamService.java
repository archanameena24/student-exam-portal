package com.isquareinfo.portal.service;

import com.isquareinfo.portal.model.Answer;
import com.isquareinfo.portal.model.Exam;
import com.isquareinfo.portal.model.ExamAttempt;
import com.isquareinfo.portal.model.Question;
import com.isquareinfo.portal.repository.ExamAttemptRepository;
import com.isquareinfo.portal.repository.ExamRepository;
import com.isquareinfo.portal.repository.QuestionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class ExamService {

    @Autowired
    private ExamAttemptRepository attemptRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public ExamAttempt autoSaveAttempt(Long attemptId, List<Answer> newAnswers) {
        // Get the existing attempt
        ExamAttempt existingAttempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("Attempt not found"));

        // Clear existing answers and flush to ensure changes are synchronized
        existingAttempt.getAnswers().clear();
        entityManager.flush();

        // Process each new answer
        for (Answer sourceAnswer : newAnswers) {
            Answer answer = new Answer();
            answer.setQuestion(sourceAnswer.getQuestion());
            answer.setSelectedOption(sourceAnswer.getSelectedOption());
            answer.setIsCorrect(sourceAnswer.getIsCorrect());
            answer.setMarksAwarded(sourceAnswer.getMarksAwarded());

            // Set both sides of the relationship
            answer.setExamAttempt(existingAttempt);
            existingAttempt.getAnswers().add(answer);
        }

        // Save and return
        return attemptRepository.saveAndFlush(existingAttempt);
    }
    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public Exam saveExam(Exam exam) {
        if (exam.getQuestions() != null && !exam.getQuestions().isEmpty()) {
            Set<Question> managedQuestions = new HashSet<>();

            for (Question question : exam.getQuestions()) {
                if (question.getId() != null) {
                    // For existing questions, fetch from database
                    Question managedQuestion = questionRepository.findById(question.getId())
                            .orElseThrow(() -> new RuntimeException("Question not found with id: " + question.getId()));
                    managedQuestions.add(managedQuestion);
                } else {
                    // For new questions, save them first
                    Question savedQuestion = questionRepository.save(question);
                    managedQuestions.add(savedQuestion);
                }
            }

            exam.setQuestions(managedQuestions);
        }

        return examRepository.save(exam);
    }

    // Method to add questions to an existing exam
    public Exam addQuestionsToExam(Long examId, Set<Long> questionIds) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + examId));

        Set<Question> questions = new HashSet<>();
        for (Long questionId : questionIds) {
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
            questions.add(question);
        }

        exam.setQuestions(questions);
        return examRepository.save(exam);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }
//    public ExamSession startExam(Long examId, String username) {
//        Exam exam = examRepository.findById(examId)
//                .orElseThrow(() -> new RuntimeException("Exam not found"));
//
//        // Create and return exam session
//        return createExamSession(exam, username);
//    }
//
//    private ExamSession createExamSession(Exam exam, String username) {
//        // Implement exam session creation logic
//        ExamSession session = new ExamSession();
//        session.setExam(exam);
//        session.setUsername(username);
//        session.setStartTime(LocalDateTime.now());
//        // Set other necessary fields
//        return session;
//    }
}
