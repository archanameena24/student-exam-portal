import React, { useState, useEffect } from 'react';
import API from '../services/api';

const OFFLINE_KEY = "offline_attempts";

export default function TakeExam({ attempt, onFinish }) {
  const [answers, setAnswers] = useState([]);
  const [exam, setExam] = useState(null);

  useEffect(()=> {
    async function load() {
      try {
        const ex = await API.get(`/exams/${attempt.exam.id}`);
        setExam(ex.data);
        setAnswers([]);
      } catch(e){ alert('Failed to load exam'); onFinish(); }
    }
    load();
  },[attempt]);

  function setAnswer(questionId, option) {
    setAnswers(prev => {
      const others = prev.filter(a=>a.questionId !== questionId);
      const next = [...others, { questionId, selectedOption: option }];
      // Try autosave
      API.post(`/exams/attempt/${attempt.id}/autosave`, next).catch(()=>{
        const stored = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
        stored.push({ attemptId: attempt.id, examId: attempt.exam.id, answers: next, username: attempt.student?.username });
        localStorage.setItem(OFFLINE_KEY, JSON.stringify(stored));
      });
      return next;
    });
  }

  async function finish() {
    try {
      const res = await API.post(`/exams/attempt/${attempt.id}/finish`);
      alert("Finished. Score: " + res.data.score);
      onFinish();
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
      stored.push({ attemptId: attempt.id, examId: attempt.exam.id, answers: answers, finishedAt: new Date().toISOString(), username: attempt.student?.username });
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(stored));
      alert("You are offline. Attempt saved locally and will be synced later.");
      onFinish();
    }
  }

  async function syncLocal() {
    const stored = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
    if (stored.length === 0) { alert('No local attempts'); return; }
    try {
      const username = stored[0].username || prompt("username for sync");
      await API.post(`/sync/attempts?username=${username}`, stored);
      localStorage.removeItem(OFFLINE_KEY);
      alert('Synced '+stored.length+' attempts');
    } catch (err) {
      alert('Sync failed');
    }
  }

  if (!exam) return <div>Loading exam...</div>;

  return (
    <div style={{marginTop:16}}>
      <h3>Taking: {exam.title}</h3>
      <button onClick={syncLocal}>Sync Local Attempts</button>
      {Array.from(exam.questions || []).map(q=>(
        <div key={q.id} style={{border:'1px solid #ddd',padding:10,margin:8}}>
          <div><b>{q.text}</b></div>
          {['optionA','optionB','optionC','optionD'].map((opt,idx)=>(
            <div key={opt}>
              <label>
                <input type="radio" name={q.id} onChange={()=>setAnswer(q.id, ['A','B','C','D'][idx])} />
                {q[opt]}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={finish}>Finish</button>
    </div>
  );
}
