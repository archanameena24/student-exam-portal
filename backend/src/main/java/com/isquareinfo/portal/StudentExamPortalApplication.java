package com.isquareinfo.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.isquareinfo.portal.repository")
@EntityScan(basePackages = "com.isquareinfo.portal.model")
public class StudentExamPortalApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentExamPortalApplication.class, args);
    }
}
