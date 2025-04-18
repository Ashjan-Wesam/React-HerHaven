import { Routes, Route } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

import OwnerDashboard from "../Pages/OwnerDashboard";
import OwnerProfile from "../Pages/OwnerProfile";
import Product from "../Pages/Products/Product";
import OrdersManagement from "../Pages/Orders/OrdersManagement";
import DiscountsManagement from "../Pages/Discounts/DiscountsManagement";
import ReviewsManagement from "../Pages/Reviews/ReviewsManagement";
import StoreSetting from "../Pages/StoreSetting";
import CategoriesPage from "../Pages/Categories/CategoriesPage";
import CreateCategory from "../Pages/Categories/CreateCategory";
import CreateProduct from "../Pages/Products/CreateProduct";
import EditCategory from "../Pages/Categories/EditCategory";
import ShowCategory from "../Pages/Categories/ShowCategory";


const OwnerLayout = () => {
  return (
    <div className="wrapper">
      
        <Sidebar />

        <div className="main-panel">
        <nav className="navbar navbar-default navbar-fixed">
             <div className="container-fluid"> 
                 <Header />
            </div>
        </nav>
           
          <Routes>
            <Route path="/" element={<OwnerDashboard />} />
            <Route path="edit-profile" element={<OwnerProfile />} />

            <Route path="products" element={<Product />} />
            <Route path="products/create" element={<CreateProduct />} />
            
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="discounts" element={<DiscountsManagement />} />
            <Route path="reviews" element={<ReviewsManagement />} />
            <Route path="settings" element={<StoreSetting />} />
            <Route path="categories" element={<CategoriesPage />} />

            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />
            <Route path="categories/show/:id" element={<ShowCategory />} />




          </Routes>

        <footer className="footer">
          <div className="container-fluid"> 
               <Footer />
          </div>
        </footer>
         
        </div>
        
    </div>
  );
};

export default OwnerLayout;



