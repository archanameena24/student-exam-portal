package com.isquareinfo.portal.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition="TEXT")
    private String text;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption; // "A","B","C","D"
    private Integer marks = 1;
    private String topic;
    private String difficulty;

    @ManyToMany(mappedBy = "questions")
    private Set<Exam> exams;
}
