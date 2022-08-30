import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Courses from "./pages/Courses";
import Students from "./pages/Students";
import Events from "./pages/Events";
import Analytics from "./pages/Analytics";
import Discussion from "./pages/Forum";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import EditCourseModal from "./components/EditCourseModal";
import AddUnit from "./pages/AddUnit";
import EditUnit from "./pages/EditUnit";
import AddLesson from "./pages/AddLesson";
import Lessons from "./pages/Lessons";
import StudentProfile from "./pages/StudentProfile";
import Notifications from "./pages/Notifications";
import PrivateRoute from "./utils/PrivateRoute";
import PathNotFound from "./pages/PathNotFound";

// let [isLogin, setIsLogin] = useState(false);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact element={<PrivateRoute />}>
        <Route exact path="/" element={<App />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/profile" element={<StudentProfile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/forum" element={<Discussion />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/course/editCourse" element={<EditCourseModal />} />
        <Route path="/course/add-unit" element={<AddUnit />} />
        <Route path="/course/edit-unit" element={<EditUnit />} />
        <Route path="/course/add-lesson" element={<AddLesson />} />
        <Route path="/course/lessons" element={<Lessons />} />
      </Route>
      

      <Route exact path="/login" element={<Login />} />
      <Route path="*" element={<PathNotFound />} />
      <Route />

      
    </Routes>

    {/* <BrowserRouter>
    <App />
    </BrowserRouter> */}
  </BrowserRouter>
);

// App.use(cors());
// App.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
// })

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
