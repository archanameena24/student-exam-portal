package com.isquareinfo.portal.model;

import javax.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Answer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Question question;
    private String selectedOption; // "A","B","C","D"
    private Integer marksAwarded;
    private Boolean isCorrect;
}
