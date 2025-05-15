import { Routes, Route } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

import OwnerDashboard from "../Pages/AdminDashboard";

import UserList from "../Pages/Users/UserList";
import UserCreate from "../Pages/Users/UserCreate";
import UserEdit from "../Pages/Users/UserEdit";
import UserView from "../Pages/Users/UserView";

import StoresList from "../Pages/Stores/StoresList";
import StoreCreate from "../Pages/Stores/StoreCreate";
import StoreEdit from "../Pages/Stores/StoreEdit";
import StoreDetails from "../Pages/Stores/StoreDetails";
import OrderList from "../Pages/Orders/OrderList";
import ViewOrder from "../Pages/Orders/ViewOrder";
import EditOrder from "../Pages/Orders/EditOrder";
import AdminSiteReviews from "../Pages/Reviews/AdminSiteReviews";
import AdminStoreReviews from "../Pages/Reviews/AdminStoreReviews";
import AdminProductReviews from "../Pages/Reviews/AdminProductReviews";
import CategoriesPage from "../Pages/categories/CategoriesPage";
import ProductAdminPage from "../Pages/Products/ProductAdminPage";
import CreateProduct  from "../Pages/Products/CreateProduct";
import EditProduct  from "../Pages/Products/EditProduct";
import ShowProduct  from "../Pages/Products/ShowProduct";
import DiscountList from "../Pages/Discount/DiscountList";
import AddDiscount from "../Pages/Discount/AddDiscount";
import EditDiscount from "../Pages/Discount/EditDiscount";
import AdminProfile from "../Pages/AdminProfile";






const AdminLayout = () => {
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

              {/* User Management */}
              <Route path="/users" element={<UserList />} />
              <Route path="/users/create" element={<UserCreate />} />
              <Route path="/users/:id/edit" element={<UserEdit />} />
              <Route path="/users/:id" element={<UserView />} />

              {/* Stores Management */}
              <Route path="/stores" element={<StoresList />} />
              <Route path="/stores/create" element={<StoreCreate />} />
              <Route path="/stores/edit/:id" element={<StoreEdit />} />
              <Route path="/stores/:id" element={<StoreDetails />} />

              {/* Categories Management */}
              <Route path="/categories" element={<CategoriesPage />} />

              {/* Products Management */}
               <Route path="/products" element={<ProductAdminPage />} />
               <Route path="/products/create" element={<CreateProduct />} />
               <Route path="/products/edit/:id" element={<EditProduct />} />
               <Route path="/products/show/:id" element={<ShowProduct />} />

              {/* Orders Management */}
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<ViewOrder />} />
              <Route path="/orders/:id/edit" element={<EditOrder />} />

              {/* Discounts Management */}
              <Route path="/discounts" element={<DiscountList />} />
              <Route path="/discounts/add" element={<AddDiscount />} />
              <Route path="/discounts/edit/:id" element={<EditDiscount />} />

              {/* Reviews Management */}
              <Route path="/reviews/sites" element={<AdminSiteReviews />} />
              <Route path="/reviews/stores" element={<AdminStoreReviews />} />
              <Route path="/reviews/products" element={<AdminProductReviews />} />


              {/* Profile Management */}
              <Route path="/profile" element={<AdminProfile />} />





             

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

export default AdminLayout;



