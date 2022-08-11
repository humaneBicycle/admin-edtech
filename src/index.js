import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Courses from './pages/Courses';
import Students from './pages/Students';
import Events from './pages/Events';
import Analytics from './pages/Analytics';
import Discussion from './pages/Discussion';
import Settings from './pages/Settings';
import AdminProfile from './pages/AdminProfile';
import Login from './pages/Login';
import EditCourseModal from './components/EditCourseModal';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/course" element={<Courses />} />
      <Route path="/students" element={<Students />} />
      <Route path="/events" element={<Events />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/discussion" element={<Discussion />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin-profile" element={<AdminProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editcourse" element={<EditCourseModal />} />

    </Routes>
    </BrowserRouter>
    {/* <BrowserRouter>
    <App />
    </BrowserRouter> */}
  </React.StrictMode>
);

// App.use(cors());
// App.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
// })

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
