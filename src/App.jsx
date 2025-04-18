// src/App.js

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css';
import PublicLayout from "./User/Layout/PublicLayout";



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./components/Login";
import RegisterCustomer from "./components/RegisterCustomer";
import RegisterOwner from "./components/RegisterOwner";
import Home from "./User/Pages/Home";
import CategoryPage from "./User/Pages/CategoryPage";


import OwnerLayout from "./Owner/Layout/OwnerLayout"; 
import AdminLayout from "./Admin/Layout/AdminLayout"; 


function RedirectAfterLogin() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  switch (user.role) {
    case "owner":
      return <Navigate to="/owner" />;
    case "customer":
      return <Navigate to="/" />;
    case "admin":
      return <Navigate to="/admin" />;
    default:
      return <Navigate to="/" />;
  }
}

function AppRoutes() {
  return (
    <Routes>

      {/* Pages */}
      <Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register-customer" element={<RegisterCustomer />} />
  <Route path="/register-owner" element={<RegisterOwner />} />
  <Route path="/shop" element={<CategoryPage />} />
</Route>

<Route path="/redirect" element={<RedirectAfterLogin />} />



      {/* Admin Routes */}
      <Route path="/admin/*" element={
          <ProtectedRoute role="admin">
                 <AdminLayout />
          </ProtectedRoute>
       } />


      {/* Owner Routes */}
      <Route path="/owner/*" element={
          <ProtectedRoute role="owner">
                 <OwnerLayout />
          </ProtectedRoute>
       } />


      <Route path="/cart" element={
        <ProtectedRoute role="customer">
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/shop" element={
        <ProtectedRoute role="customer">
          <CategoryPage />
        </ProtectedRoute>
      } />

         
    
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
