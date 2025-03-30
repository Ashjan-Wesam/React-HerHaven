import { useState } from "react";

const PendingOrders = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [orders, setOrders] = useState([
        { id: 1, customer: "Customer 1", total: "$50", status: "Pending" },
        { id: 3, customer: "Customer 3", total: "$80", status: "Pending" },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setOrders(orders.filter(order => order.id !== id));
    };

    const filteredOrders = orders.filter(order =>
        order.customer.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "" || order.status === statusFilter)
    );

    return (
        <div className="container">
            <h2>Pending Orders</h2>
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
            <div className="orders-list">
                {filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <p><strong>Customer:</strong> {order.customer}</p>
                        <p><strong>Total:</strong> {order.total}</p>
                        <button onClick={() => handleStatusChange(order.id, "Completed")}>Accept</button>
                        <button onClick={() => handleStatusChange(order.id, "Rejected")}>Reject</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingOrders;