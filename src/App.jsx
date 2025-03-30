
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Owner/Components/Sidebar";
import Header from "./Owner/Components/Header";
import Footer from "./Owner/Components/Footer";
import Dashboard from "./Owner/Pages/Dashboard";
import ProductsManagement from "./Owner/Pages/Products/ProductsManagement";
import AddProduct from "./Owner/Pages/Products/AddProduct"; 
import EditProduct from "./Owner/Pages/Products/EditProduct"; 
import OrdersManagement from "./Owner/Pages/Orders/OrdersManagement";
import PendingOrders from "./Owner/Pages/Orders/PendingOrders";
import CompletedOrders from "./Owner/Pages/Orders/CompletedOrders";
import DiscountsManagement from "./Owner/Pages/Discounts/DiscountsManagement";
import ReviewsManagement from "./Owner/Pages/Reviews/ReviewsManagement";
import StoreSetting from "./Owner/Pages/StoreSetting";
import Home from "./User/Pages/Home";
import CartPage from "./User/Pages/CartPage";

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // التحقق إذا كان داخل لوحة التحكم

  return (
    <div className="wrapper">
      {isAdminRoute && <Sidebar />}
      <div className={isAdminRoute ? "main-panel" : ""}>
        {isAdminRoute && <Header />}
        <div className="content">
          <Routes>
            {/* راوتات الأدمن */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/pending-orders" element={<PendingOrders />} />
            <Route path="/admin/completed-orders" element={<CompletedOrders />} />
            <Route path="/admin/discounts" element={<DiscountsManagement />} />
            <Route path="/admin/reviews" element={<ReviewsManagement />} />
            <Route path="/admin/settings" element={<StoreSetting />} />

            {/* راوتات المستخدم */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            {/* <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} /> */}
          </Routes>
        </div>
        {isAdminRoute && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
