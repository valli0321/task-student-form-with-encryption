import './App.css'

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";
import StudentList from "@/components/StudentList";
import { StudentRegistrationForm } from "@/components/StudentForm";

const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {

  return (
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<StudentRegistrationForm />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <StudentList />
            </PrivateRoute>
          }
        />
       
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={isLoggedIn() ? "/" : "/login"} replace />} />
      </Routes>
  );
};

export default App;