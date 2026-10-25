// App.jsx - the root component. It decides WHICH page to show for each web
// address (URL) by using react-router-dom.
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import CourseList from './pages/CourseList';
import CourseForm from './pages/CourseForm';

function App() {
  return (
    // BrowserRouter turns on page navigation without reloading the browser.
    <BrowserRouter>
      {/* The navigation bar is outside <Routes>, so it appears on every page. */}
      <Navbar />

      {/* Bootstrap "container" centres the page content and adds side margins. */}
      <div className="container py-4">
        {/* <Routes> shows exactly ONE <Route> - the one matching the URL. */}
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Students: list, add form, edit form (":id" is the record number) */}
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/add" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />

          {/* Courses: list, add form, edit form */}
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/add" element={<CourseForm />} />
          <Route path="/courses/edit/:id" element={<CourseForm />} />

          {/* "*" matches any other URL, so wrong addresses show a message. */}
          <Route path="*" element={<h3>Page not found</h3>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
