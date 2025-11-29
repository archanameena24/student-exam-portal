package com.isquareinfo.portal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.isquareinfo.portal.repository.QuestionRepository;
import com.isquareinfo.portal.model.Question;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public List<Question> list() {
        return questionRepository.findAll();
    }

    @PostMapping
    public Question create(@RequestBody Question q) {
        q.setId(null);
        return questionRepository.save(q);
    }

    @GetMapping("/{id}")
    public Question get(@PathVariable Long id) {
        return questionRepository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable Long id, @RequestBody Question q) {
        Question existing = questionRepository.findById(id).orElseThrow();
        existing.setText(q.getText());
        existing.setOptionA(q.getOptionA());
        existing.setOptionB(q.getOptionB());
        existing.setOptionC(q.getOptionC());
        existing.setOptionD(q.getOptionD());
        existing.setCorrectOption(q.getCorrectOption());
        existing.setMarks(q.getMarks());
        existing.setTopic(q.getTopic());
        existing.setDifficulty(q.getDifficulty());
        return questionRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        questionRepository.deleteById(id);
    }
}
