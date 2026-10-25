// Home.jsx - the dashboard. Shows how many students and courses exist.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { SERVER_ERROR } from '../api';

function Home() {
  // "state" = values the page remembers. When a setter is called, React
  // redraws the page with the new value.
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [error, setError] = useState('');

  // useEffect with [] runs ONCE, right after the page first appears.
  useEffect(() => {
    // READ: ask the server for all students and all courses.
    const loadCounts = async () => {
      try {
        const [studentRes, courseRes] = await Promise.all([
          api.get('/students'), // GET http://localhost:3001/students
          api.get('/courses'), // GET http://localhost:3001/courses
        ]);
        setStudentCount(studentRes.data.length);
        setCourseCount(courseRes.data.length);
      } catch {
        setError(SERVER_ERROR);
      }
    };
    loadCounts();
  }, []);

  return (
    <div>
      <h2 className="mb-1">Dashboard</h2>
      <p className="text-muted">Manage your students and courses in one place.</p>

      {/* Show the red error box only when "error" has text in it */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Bootstrap grid: 1 column on phones, 2 columns from "md" screens up */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card stat-card shadow-sm h-100">
            <div className="card-body text-center">
              <div className="stat-number text-primary">{studentCount}</div>
              <h5 className="card-title">Students</h5>
              <Link to="/students" className="btn btn-outline-primary me-2">
                View all
              </Link>
              <Link to="/students/add" className="btn btn-primary">
                Add student
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card stat-card shadow-sm h-100">
            <div className="card-body text-center">
              <div className="stat-number text-success">{courseCount}</div>
              <h5 className="card-title">Courses</h5>
              <Link to="/courses" className="btn btn-outline-success me-2">
                View all
              </Link>
              <Link to="/courses/add" className="btn btn-success">
                Add course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
