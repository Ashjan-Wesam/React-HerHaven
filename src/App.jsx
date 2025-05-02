// src/App.js

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css';
import PublicLayout from "./User/Layout/PublicLayout";
import UserLayout from "./User/Layout/UserLayout";



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./components/Login";
import RegisterCustomer from "./components/RegisterCustomer";
import RegisterOwner from "./components/RegisterOwner";
import RegisterSelect from "./components/RegisterSelect";
import Home from "./User/Pages/Home";
import CategoryPage from "./User/Pages/CategoryPage";


import OwnerLayout from "./Owner/Layout/OwnerLayout"; 
import AdminLayout from "./Admin/Layout/AdminLayout"; 
import StoreDetail from "./User/Pages/StoreDetail";
import SingleProductPage from "./User/Pages/SingleProductPage";
import About from "./User/Pages/About";
import Contact from "./User/Pages/Contact";


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

      {/*General Routes */}
      <Route element={<PublicLayout />}>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register-customer" element={<RegisterCustomer />} />
             <Route path="/register-owner" element={<RegisterOwner />} />
             <Route path="/register" element={<RegisterSelect />} />
             <Route path="/shop" element={<CategoryPage />} />
             <Route path="/store/:storeId" element={<StoreDetail />} />
             <Route path="/Products/:productId" element={<SingleProductPage />} />
             <Route path="/about-us" element={<About />} />
             <Route path="/contact" element={<Contact />} />

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
       
      {/* Customer Routes */}
      <Route path="/customer/*" element={
          <ProtectedRoute role="customer">
                 <UserLayout />
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
