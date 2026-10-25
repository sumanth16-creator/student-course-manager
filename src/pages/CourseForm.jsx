// CourseForm.jsx - CREATE and UPDATE for courses.
// Same idea as StudentForm: one form, two jobs.
//   /courses/add        -> empty form, saves with POST  (Create)
//   /courses/edit/:id   -> filled form, saves with PUT  (Update)
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { SERVER_ERROR } from '../api';

const emptyForm = { title: '', instructor: '', durationWeeks: '' };

// VALIDATION: returns an object of error messages ({} means all good).
function validate(form) {
  const errors = {};
  if (form.title.trim().length < 3) {
    errors.title = 'Course title is required (at least 3 characters).';
  }
  if (!form.instructor.trim()) {
    errors.instructor = 'Instructor name is required.';
  }
  const weeks = Number(form.durationWeeks);
  if (form.durationWeeks === '') {
    errors.durationWeeks = 'Duration is required.';
  } else if (!Number.isInteger(weeks) || weeks < 1 || weeks > 52) {
    errors.durationWeeks = 'Duration must be a whole number between 1 and 52 weeks.';
  }
  return errors;
}

function CourseForm() {
  const { id } = useParams(); // course number from the URL when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(isEdit); // only need to load when editing
  const [saving, setSaving] = useState(false);

  // When editing, fetch the saved course and fill the form with it.
  useEffect(() => {
    if (!isEdit) return;
    const loadCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`); // GET /courses/:id
        const c = res.data;
        setForm({
          title: c.title,
          instructor: c.instructor,
          durationWeeks: String(c.durationWeeks),
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setServerError('That course was not found. It may have been deleted.');
        } else {
          setServerError(SERVER_ERROR);
        }
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, isEdit]);

  // Copy the form and change only the field that was typed in.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Runs when "Save" is pressed.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Validate. Stop if there are errors.
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // 2) Build the course object. Duration is saved as a number, not text.
    const course = {
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      durationWeeks: Number(form.durationWeeks),
    };

    // 3) Send to the server.
    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/courses/${id}`, course); // UPDATE: PUT /courses/:id
      } else {
        await api.post('/courses', course); // CREATE: POST /courses
      }
      navigate('/courses', {
        state: {
          message: isEdit
            ? 'Course updated successfully.'
            : 'Course added successfully.',
        },
      });
    } catch {
      setServerError('Could not save the course. ' + SERVER_ERROR);
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">{isEdit ? 'Edit course' : 'Add course'}</h3>

            {serverError && <div className="alert alert-danger">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Course title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="instructor" className="form-label">
                  Instructor
                </label>
                <input
                  id="instructor"
                  name="instructor"
                  type="text"
                  className={`form-control ${errors.instructor ? 'is-invalid' : ''}`}
                  value={form.instructor}
                  onChange={handleChange}
                />
                {errors.instructor && (
                  <div className="invalid-feedback">{errors.instructor}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="durationWeeks" className="form-label">
                  Duration (weeks)
                </label>
                <input
                  id="durationWeeks"
                  name="durationWeeks"
                  type="number"
                  className={`form-control ${errors.durationWeeks ? 'is-invalid' : ''}`}
                  value={form.durationWeeks}
                  onChange={handleChange}
                />
                {errors.durationWeeks && (
                  <div className="invalid-feedback">{errors.durationWeeks}</div>
                )}
              </div>

              <button type="submit" className="btn btn-success me-2" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <Link to="/courses" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseForm;
