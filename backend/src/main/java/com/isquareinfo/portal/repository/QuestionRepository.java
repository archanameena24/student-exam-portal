package com.isquareinfo.portal.repository;

import com.isquareinfo.portal.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
