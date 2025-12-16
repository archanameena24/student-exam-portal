package com.isquareinfo.portal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ExamAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Exam exam;

    @ManyToOne
    private User student;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private Integer score;

    // Simple getter
    @OneToMany(mappedBy = "examAttempt",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    // Helper methods to maintain relationship
    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setExamAttempt(this);
    }

    public void removeAnswer(Answer answer) {
        answers.remove(answer);
        answer.setExamAttempt(null);
    }
    public void clearAnswers() {
        for (Answer answer : new ArrayList<>(answers)) {
            removeAnswer(answer);
        }
    }

    public void updateAnswers(List<Answer> newAnswers) {
        clearAnswers();
        if (newAnswers != null) {
            newAnswers.forEach(this::addAnswer);
        }
    }

    public List<Answer> getAnswers() {
        if (answers == null) {
            answers = new ArrayList<>();
        }
        return answers;
    }

    private Boolean synced = true;
}
