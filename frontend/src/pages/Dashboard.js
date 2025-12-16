import React, { useEffect, useState } from 'react';
import API from '../services/api';
import TakeExam from './TakeExam';

export default function Dashboard({ onLogout }) {
  const [exams, setExams] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [takingExam, setTakingExam] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    startTime: '',
    endTime: '',
    allowOffline: false,
    questions: []
  });

  useEffect(() => {
    loadUserInfo();
    loadExams();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await API.get('/api/auth/user-info');
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadExams = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/exams');
      setExams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const formattedExam = {
        ...newExam,
        startTime: new Date(newExam.startTime).toISOString(),
        endTime: new Date(newExam.endTime).toISOString()
      };

      await API.post('/api/exams/admin/saveExam', formattedExam);
      alert('Exam created successfully!');
      setShowCreateForm(false);
      setNewExam({
        title: '',
        description: '',
        durationMinutes: 60,
        startTime: '',
        endTime: '',
        allowOffline: false,
        questions: []
      });
      loadExams();
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam. Please try again.');
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await API.delete(`/api/exams/${examId}`);
        alert('Exam deleted successfully!');
        loadExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Failed to delete exam. Please try again.');
      }
    }
  };

  const handleStartExam = async (examId) => {
    try {
      const username = prompt("Enter your username to start the exam:");
      if (!username) return;

      const response = await API.post(`/api/exams/${examId}/start?username=${username}`);
      setTakingExam(response.data);
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Failed to start exam. Please try again.');
    }
  };

  const CreateExamForm = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3>Create New Exam</h3>
        <form onSubmit={handleCreateExam}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Title:
              <input
                type="text"
                value={newExam.title}
                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Description:
              <textarea
                value={newExam.description}
                onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '100px'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Duration (minutes):
              <input
                type="number"
                value={newExam.durationMinutes}
                onChange={(e) => setNewExam({...newExam, durationMinutes: parseInt(e.target.value)})}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Start Time:
              <input
                type="datetime-local"
                value={newExam.startTime}
                onChange={(e) => setNewExam({...newExam, startTime: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              End Time:
              <input
                type="datetime-local"
                value={newExam.endTime}
                onChange={(e) => setNewExam({...newExam, endTime: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <input
                type="checkbox"
                checked={newExam.allowOffline}
                onChange={(e) => setNewExam({...newExam, allowOffline: e.target.checked})}
                style={{ marginRight: '8px' }}
              />
              Allow Offline
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (takingExam) {
    return <TakeExam exam={takingExam} onFinish={() => setTakingExam(null)} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Available Exams</h2>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div>Loading exams...</div>
      ) : (
        <div>
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                marginBottom: '20px',
                cursor: 'pointer'
              }}
            >
              Create New Exam
            </button>
          )}

          {exams.length === 0 ? (
            <div>No exams available</div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {exams.map(exam => (
                <div
                  key={exam.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0' }}>{exam.title}</h3>
                  <p style={{ margin: '0 0 15px 0', color: '#666' }}>
                    {exam.description}
                  </p>
                  <div style={{ marginBottom: '15px', fontSize: '14px', color: '#444' }}>
                    <p>Duration: {exam.durationMinutes} minutes</p>
                    <p>Start: {new Date(exam.startTime).toLocaleString()}</p>
                    <p>End: {new Date(exam.endTime).toLocaleString()}</p>
                    <p>Offline Mode: {exam.allowOffline ? 'Enabled' : 'Disabled'}</p>
                  </div>

                  {userRole === 'ADMIN' ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {/* Add edit logic */}}
                        style={{
                          backgroundColor: '#2196F3',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Start Exam
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCreateForm && <CreateExamForm />}
    </div>
  );
}
