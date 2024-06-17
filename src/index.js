import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
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
import AnswerThisQuestion from "./pages/AnswerThisQuestion";
import Lesson from "./pages/Lesson";
import BlockedUsers from "./pages/BlockedUsers";
import LeaderBoard from "./pages/LeaderBoard";
import Assignments from "./pages/Assignments";
import Payments from "./pages/Payments";
import AddAdditionalUnit from "./pages/AddAdditionalLesson";
import PersonalityTest from "./pages/PersonalityTest";
import MarketingTest from "./pages/MarketingTest";
import PersonalityTestAddQuestions from "./pages/PersonalityTestAddQuestions";
import BlockedDeviceApprovals from "./pages/BlockedDeviceApprovals";
import MarketingTestAddQuestions from "./pages/MarketingTestAddQuestions";
import EditLesson from "./pages/EditLesson";

export const Title = "Admin Panel";
document.title = "Admin Panel";
window.onload = () => {

  localStorage.getItem("darkMode") && document.body.classList.add("darkMode");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact element={<PrivateRoute />}>
        <Route path="/" element={<Courses />} />
        <Route path="/course" element={<Courses />} />
        {/* <Route path="/students" element={<Students />} />
        <Route path="/students/change-device-approvals" element={<BlockedDeviceApprovals />} />
        <Route path="/students/profile" element={<StudentProfile />} />
        <Route path="/students/blocked-users" element={<BlockedUsers />} /> */}
        <Route path="/events" element={<Events />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/payments" element={<Payments />} />
        {/* <Route path="/forum" element={<Discussion />} /> */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/personality-test" element={<PersonalityTest />} />
        <Route path="/marketing-test" element={<MarketingTest />} />
        <Route path="/personality-test/add-questions" element={<PersonalityTestAddQuestions />} />
        <Route path="/marketing-test/add-questions" element={<MarketingTestAddQuestions />} />
        <Route path="/course/editCourse" element={<EditCourseModal />} />
        <Route path="/course/add-unit" element={<AddUnit />} />
        <Route path="/course/edit-unit" element={<EditUnit />} />
        <Route path="/course/add-lesson" element={<AddLesson />} />
        <Route path="/course/lessons" element={<Lessons />} />
        <Route path="/course/lessons/lesson" element={<Lesson />} />
        {/* <Route path="/additional-lessons" element={<AddAdditionalUnit />} /> */}
        <Route path="/admin/forum/add-answer" element={<AnswerThisQuestion />} />
        <Route path="/admin/lesson/edit-lesson" element={<EditLesson />} />
      </Route>


      <Route exact path="/login" element={<Login />} />
      <Route path="*" element={<PathNotFound />} />
      <Route />


    </Routes>
  </BrowserRouter>
)
