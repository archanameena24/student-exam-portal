import React, { useEffect, useState } from 'react';
import API from '../services/api';
import TakeExam from './TakeExam';

export default function Dashboard({ onLogout }) {
  const [exams,setExams] = useState([]);
  const [takingExam, setTakingExam] = useState(null);

  useEffect(()=> {
    API.get('/exams').then(r=>setExams(r.data)).catch(()=>setExams([]));
  },[]);

  return (
    <div style={{padding:20}}>
      <button onClick={()=>{ localStorage.removeItem('token'); onLogout(); }}>Logout</button>
      <h2>Available Exams</h2>
      <ul>
        {exams.map(e=> <li key={e.id}>
          <b>{e.title}</b> - {e.description}
          <button onClick={async()=> {
            const username = prompt("Enter your username for demo (must exist)");
            const res = await API.post(`/exams/${e.id}/start?username=${username}`);
            setTakingExam(res.data);
          }}>Start</button>
        </li>)}
      </ul>
      {takingExam && <TakeExam attempt={takingExam} onFinish={() => setTakingExam(null)} />}
    </div>
  );
}
