// StudentForm.jsx - CREATE and UPDATE for students.
// ONE form is used for both jobs:
//   /students/add        -> empty form, saves with POST   (Create)
//   /students/edit/:id   -> filled form, saves with PUT   (Update)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { SERVER_ERROR } from '../api';

// Starting values of an empty form.
const emptyForm = { name: '', email: '', courseId: '' };

// VALIDATION: check the typed values and return a list of error messages.
// An empty object {} means "everything is fine".
function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) {
    errors.name = 'Name is required (at least 2 characters).';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address, for example name@example.com.';
  }
  if (form.courseId === '') {
    errors.courseId = 'Please select a course.';
  }
  return errors;
}

function StudentForm() {
  const { id } = useParams(); // the ":id" from the URL (undefined when adding)
  const isEdit = Boolean(id); // true when we are editing an existing student
  const navigate = useNavigate(); // lets us jump to another page from code

  const [form, setForm] = useState(emptyForm);
  const [courses, setCourses] = useState([]); // options for the course dropdown
  const [errors, setErrors] = useState({}); // validation messages per field
  const [serverError, setServerError] = useState(''); // problems talking to the server
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load the course list (for the dropdown) and, when editing, the student.
  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await api.get('/courses'); // GET /courses
        setCourses(courseRes.data);

        if (isEdit) {
          const studentRes = await api.get(`/students/${id}`); // GET /students/:id
          const s = studentRes.data;
          // Fill the form with the saved values. A <select> works with text,
          // so the course number is converted to a string.
          setForm({
            name: s.name,
            email: s.email,
            courseId: String(s.courseId),
          });
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setServerError('That student was not found. It may have been deleted.');
        } else {
          setServerError(SERVER_ERROR);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  // Runs on every key press. Copies the form and changes just the typed field.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Runs when the "Save" button is pressed.
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page

    // 1) Validate first. If anything is wrong, show messages and stop.
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // 2) Build the object we will save. courseId links the student to a
    // course (it is a "foreign key") and is saved as a number.
    const student = {
      name: form.name.trim(),
      email: form.email.trim(),
      courseId: Number(form.courseId),
    };

    // 3) Send it to the server.
    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/students/${id}`, student); // UPDATE: PUT /students/:id
      } else {
        await api.post('/students', student); // CREATE: POST /students
      }
      // 4) Go back to the list and show a success message there.
      navigate('/students', {
        state: {
          message: isEdit
            ? 'Student updated successfully.'
            : 'Student added successfully.',
        },
      });
    } catch {
      setServerError('Could not save the student. ' + SERVER_ERROR);
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">{isEdit ? 'Edit student' : 'Add student'}</h3>

            {serverError && <div className="alert alert-danger">{serverError}</div>}

            {/* noValidate turns off the browser's own pop-ups so OUR messages show */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full name
                </label>
                {/* "is-invalid" is a Bootstrap class that draws a red border */}
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="courseId" className="form-label">
                  Course
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  className={`form-select ${errors.courseId ? 'is-invalid' : ''}`}
                  value={form.courseId}
                  onChange={handleChange}
                >
                  <option value="">-- Select a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <div className="invalid-feedback">{errors.courseId}</div>
                )}
                {/* Students must belong to a course, so courses must exist first */}
                {courses.length === 0 && !serverError && (
                  <div className="form-text text-danger">
                    There are no courses yet. <Link to="/courses/add">Add a course</Link>{' '}
                    first.
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary me-2" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <Link to="/students" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;
