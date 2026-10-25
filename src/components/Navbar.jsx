// Navbar.jsx - the blue bar at the top with links to the main pages.
import { NavLink } from 'react-router-dom';

function Navbar() {
  // NavLink tells us whether it is the current page (isActive), so we can
  // highlight the link of the page the user is on.
  const linkClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' active fw-semibold' : '');

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Student Course Manager
        </NavLink>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            {/* "end" makes Home active only on exactly "/" and not on every page */}
            <NavLink className={linkClass} to="/" end>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={linkClass} to="/students">
              Students
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={linkClass} to="/courses">
              Courses
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
