// api.js - ONE place that knows where the backend lives.
// Every component imports this "api" object instead of typing the address
// again and again. If the server port ever changes, edit only this line.
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // where json-server is running
});

// One friendly message reused by every page when the server cannot be reached.
export const SERVER_ERROR =
  'Cannot reach the server. Please make sure json-server is running on port 3001 (run "npm start").';

export default api;
