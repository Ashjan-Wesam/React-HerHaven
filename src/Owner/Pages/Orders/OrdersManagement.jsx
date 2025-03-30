import { useNavigate } from "react-router-dom";
import "../../../assets/css/ownerStyles/Orders.css";

const OrdersManagement = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Orders Management</h2>
            <div className="stats">
                <div className="order-card" onClick={() => navigate("/orders/pending")}>
                    <h3>Pending Orders</h3>
                    <p>View and manage pending orders</p>
                </div>
                <div className="order-card" onClick={() => navigate("/orders/completed")}>
                    <h3>Completed Orders</h3>
                    <p>View all completed orders</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersManagement;


  