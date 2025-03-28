import { useState } from "react";
import Sidebar from "./Owner/Components/Sidebar";
import Header from "./Owner/Components/Header";
import Footer from "./Owner/Components/Footer";
import Dashboard from "./Owner/Pages/Dashboard";
import ProductsManagement from "./Owner/Pages/Products/ProductsManagement";
import OrdersManagement from "./Owner/Pages/Orders/OrdersManagement";
import DiscountsManagement from "./Owner/Pages/Discounts/DiscountsManagement";
import ReviewsManagement from "./Owner/Pages/Reviews/ReviewsManagement";
import StoreSetting from "./Owner/Pages/StoreSetting";

function App() {

  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <ProductsManagement />;
      case "Orders":
        return <OrdersManagement />;
      case "Discounts":
        return <DiscountsManagement />;
      case "Reviews":
        return <ReviewsManagement />;
      case "Settings":
        return <StoreSetting />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="wrapper">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="main-panel">
        <Header />
        <div className="content">{renderComponent()}</div>
        <Footer />
      </div>
    </div>
  );
}

export default App;

