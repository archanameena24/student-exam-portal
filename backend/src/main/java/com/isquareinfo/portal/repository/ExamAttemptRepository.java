package com.isquareinfo.portal.repository;

import com.isquareinfo.portal.model.ExamAttempt;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
}
