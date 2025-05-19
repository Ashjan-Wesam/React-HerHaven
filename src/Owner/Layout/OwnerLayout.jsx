import { Routes, Route } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

import OwnerDashboard from "../Pages/OwnerDashboard";
import OwnerProfile from "../Pages/OwnerProfile";
import Product from "../Pages/Products/Product";
import OrdersManagement from "../Pages/Orders/OrdersManagement";
import ReviewsManagement from "../Pages/Reviews/ReviewsManagement";
import StoreSetting from "../Pages/StoreSetting";
import CategoriesPage from "../Pages/Categories/CategoriesPage";
import CreateProduct from "../Pages/Products/CreateProduct";
import ShowCategory from "../Pages/Categories/ShowCategory";
import ProductShow from "../Pages/Products/ProductShow";
import EditProduct from "../Pages/Products/EditProduct";
import DiscountsPage from "../Pages/Discounts/DiscountsPage";
import DiscountForm from "../Pages/Discounts/DiscountForm";
import DesignRequests from "../Pages/Orders/DesignRequests";
import StoreReviews from "../Pages/Reviews/StoreReviews";
import ProductReviews from "../Pages/Reviews/ProductReviews";


const OwnerLayout = () => {
  return (
    <div className="wrapper" >
      
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
            <Route path="products/show/:id" element={<ProductShow />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="orders-req" element={<DesignRequests />} />
            
            <Route path="reviews" element={<ReviewsManagement />} />
            <Route path="reviewsStore" element={<StoreReviews />} />
            <Route path="productsStore" element={<ProductReviews />} />

            <Route path="settings" element={<StoreSetting />} />


            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/show/:id" element={<ShowCategory />} />

            <Route path="discounts" element={<DiscountsPage />} />
            <Route path="discounts/create" element={<DiscountForm />} />
            <Route path="discounts/edit/:id" element={<DiscountForm />} />


          </Routes>

        <footer className="footer" style={{ marginTop: "20rem" }}>
          <div className="container-fluid"> 
               <Footer />
          </div>
        </footer>
         
        </div>
        
    </div>
  );
};

export default OwnerLayout;



