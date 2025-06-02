import './App.css'
import './styles/scrollbar.css'
import HomePage from './compoment/home/HomePage';
import UserPage from './compoment/user/UserPage';
import NavigationBar from './compoment/navigationBar/NavigationBar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './compoment/auth/Login';
import LessonDetail from './compoment/lesson/LessonDetail';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './compoment/navigationBar/PrivateRoute';
import PublicRoute from './compoment/navigationBar/PublicRoute';
import UserDetail from './compoment/user/UserDetail';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />
      <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
                <Route path="/" element={<NavigationBar />}>
                  <Route index element={<Navigate to="/home" />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="user" element={<UserPage />} />
                  <Route path="user/:id" element={<UserDetail />} />
                  <Route path="lesson" element={<LessonDetail />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
