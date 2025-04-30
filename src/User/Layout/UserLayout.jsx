import Header from "../components/Header"; 
import Footer from "../Components/Footer"
import { Routes, Route } from "react-router-dom";
import CartPage from "../Pages/CartPage";
import CheckoutPage from "../Pages/CheckoutPage";
import UserOrders from "../Pages/UserOrders";
import OrderRequests from "../Pages/OrderRequests";
import EditProfile from "../Pages/EditProfile";

const UserLayout = () => {
  return (
    <>
    <div style={{ marginBottom: "100px" }}>
      <Header />
      </div>
      
      <main>
        <Routes>

          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="my-orders" element={<UserOrders />} />
          <Route path="order-requests" element={<OrderRequests />} />
          <Route path="edit-profile" element={<EditProfile />} />
 

        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
