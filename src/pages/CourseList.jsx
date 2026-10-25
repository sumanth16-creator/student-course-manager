// CourseList.jsx - READ (list) and DELETE for courses.
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { SERVER_ERROR } from '../api';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]); // needed to count enrolled students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Success message sent by the course form after add/edit.
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  // READ: load courses and students once when the page opens.
  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseRes, studentRes] = await Promise.all([
          api.get('/courses'), // GET /courses
          api.get('/students'), // GET /students
        ]);
        setCourses(courseRes.data);
        setStudents(studentRes.data);
      } catch {
        setError(SERVER_ERROR);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // How many students are enrolled in a given course?
  const enrolledCount = (courseId) =>
    students.filter((s) => s.courseId === courseId).length;

  // DELETE a course - but only when nobody is enrolled in it.
  const handleDelete = async (course) => {
    const count = enrolledCount(course.id);
    if (count > 0) {
      // Business rule: protect students from being left in a missing course.
      window.alert(
        `"${course.title}" cannot be deleted because ${count} student(s) are enrolled. ` +
          'Move or delete those students first.'
      );
      return;
    }
    if (!window.confirm(`Delete course "${course.title}"?`)) return;

    try {
      await api.delete(`/courses/${course.id}`); // DELETE /courses/:id
      setCourses((current) => current.filter((c) => c.id !== course.id));
      setError('');
      setMessage(`Course "${course.title}" was deleted.`);
    } catch {
      setError('Could not delete the course. ' + SERVER_ERROR);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="mb-0">Courses</h2>
        <Link to="/courses/add" className="btn btn-success">
          + Add course
        </Link>
      </div>

      {message && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{message}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Instructor</th>
                <th>Duration</th>
                <th>Students</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>{course.durationWeeks} weeks</td>
                    <td>{enrolledCount(course.id)}</td>
                    <td className="text-end table-actions">
                      <Link
                        to={`/courses/edit/${course.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(course)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CourseList;
