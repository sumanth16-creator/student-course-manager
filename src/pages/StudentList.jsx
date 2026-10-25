// StudentList.jsx - READ (list + search) and DELETE for students.
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { SERVER_ERROR } from '../api';

function StudentList() {
  const [students, setStudents] = useState([]); // all students from the server
  const [courses, setCourses] = useState([]); // all courses (to show course names)
  const [search, setSearch] = useState(''); // text typed in the search box
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // After adding/editing a student, the form page sends us a success message.
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(location.state?.message || '');

  // Clear the message from the browser history so it does not reappear
  // when the page is refreshed.
  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  // READ: load students and courses once when the page opens.
  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentRes, courseRes] = await Promise.all([
          api.get('/students'), // GET /students
          api.get('/courses'), // GET /courses
        ]);
        setStudents(studentRes.data);
        setCourses(courseRes.data);
      } catch {
        setError(SERVER_ERROR);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Turn a courseId (like 1) into the course title (like "Web Development...").
  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : 'Unknown course';
  };

  // SEARCH: keep only students whose name or email contains the typed text.
  const query = search.trim().toLowerCase();
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
  );

  // DELETE: ask for confirmation, then remove the student from the server.
  const handleDelete = async (student) => {
    if (!window.confirm(`Delete student "${student.name}"?`)) return;
    try {
      await api.delete(`/students/${student.id}`); // DELETE /students/:id
      // Update the screen without reloading: keep everyone except this student.
      setStudents((current) => current.filter((s) => s.id !== student.id));
      setError('');
      setMessage(`Student "${student.name}" was deleted.`);
    } catch {
      setError('Could not delete the student. ' + SERVER_ERROR);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="mb-0">Students</h2>
        <Link to="/students/add" className="btn btn-primary">
          + Add student
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

      {/* Search box: every key typed updates "search" and re-filters the table */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading students...</p>
      ) : (
        // table-responsive lets the table scroll sideways on small phones
        <div className="table-responsive bg-white shadow-sm rounded">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No students found.
                  </td>
                </tr>
              ) : (
                // One table row for every student. "key" helps React track rows.
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{getCourseTitle(student.courseId)}</td>
                    <td className="text-end table-actions">
                      <Link
                        to={`/students/edit/${student.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(student)}
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

export default StudentList;
