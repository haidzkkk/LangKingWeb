import './App.css'
import HomePage from './compoment/home/HomePage';
import UserPage from './compoment/user/UserPage';
import NavigationBar from './compoment/navigationBar/navigationBar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './compoment/auth/Login';
import LessonDetail from './compoment/lesson/LessonDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<NavigationBar />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<HomePage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="lesson" element={<LessonDetail />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
