# Student Course Manager

A beginner-friendly web application for managing **students** and **courses**. Staff can add, view, search, edit and delete records, and every student is linked to one course. It was built as a lab project for the Web Design and Development course.

## Technologies used

| Technology | Purpose in this project |
| --- | --- |
| HTML (JSX) | Page structure: forms, tables, buttons, navigation |
| CSS and Bootstrap 5 | Layout, responsive grid, forms, tables, buttons, plus a small custom stylesheet (`src/index.css`) |
| JavaScript (ES6) | Validation, event handling, searching and filtering |
| React 19 | Reusable components, state, props and event handlers |
| react-router-dom | Moving between pages without reloading the browser |
| Axios | Sending HTTP requests from React to the API |
| JSON Server 0.17.4 | Mock REST API that stores data in `db.json` |
| Vite | Development server and build tool |

## Prerequisites

- Node.js 22 LTS (Node.js 20.19 or newer also works) and npm. Check with `node -v` and `npm -v`.
- A modern web browser such as Chrome, Edge or Firefox.

## Installation

```bash
# 1. Open a terminal in the project folder (the one that contains package.json)
cd student-course-manager

# 2. Install all libraries (this creates the node_modules folder)
npm install
```

## Running the application

Both the React app (frontend) and JSON Server (mock backend) must be running.

**Option A: one command**

```bash
npm start
```

**Option B: two terminals**

```bash
# Terminal 1 - mock backend (JSON Server)
npm run server

# Terminal 2 - React frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

| Part | Address |
| --- | --- |
| React frontend | http://localhost:5173 |
| JSON Server API (base URL) | http://localhost:3001 |

The API address is set in one place, `src/api.js` (`baseURL: 'http://localhost:3001'`). Change it there if you run the server on a different port, and change the `server` script in `package.json` to match.

## API endpoints

| Method | Endpoint | Action |
| --- | --- | --- |
| GET | `/students`, `/students/:id` | List or read students |
| POST | `/students` | Create a student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |
| GET | `/courses`, `/courses/:id` | List or read courses |
| POST | `/courses` | Create a course |
| PUT | `/courses/:id` | Update a course |
| DELETE | `/courses/:id` | Delete a course |

## Project structure

```
student-course-manager/
├── db.json                  # mock database (students and courses)
├── package.json             # libraries and npm scripts
├── index.html               # page shell for the React app
└── src/
    ├── main.jsx             # starts React, loads Bootstrap
    ├── App.jsx              # routes (which page for which URL)
    ├── api.js               # Axios instance with the base URL
    ├── index.css            # small custom styles
    ├── components/
    │   └── Navbar.jsx       # top navigation bar
    └── pages/
        ├── Home.jsx         # dashboard with counts
        ├── StudentList.jsx  # read, search, delete students
        ├── StudentForm.jsx  # create and update students
        ├── CourseList.jsx   # read and delete courses
        └── CourseForm.jsx   # create and update courses
```

## Test credentials

None. The application has no login.

## Known limitations

- JSON Server is a **mock backend**. Data lives in the local `db.json` file, so there is no real database, no authentication and no multi-user safety.
- Business rules (form validation, "a course with enrolled students cannot be deleted") are enforced only in the React code. Calling the API directly, for example from Postman, bypasses them.
- JSON Server automatically removes students whose course no longer exists, which is why the app blocks deleting a course that still has students.
- Email addresses are checked for format only, not for duplicates.
- Editing `db.json` by hand while the server is running is possible, but stop the server first if you want to reset the sample data.
