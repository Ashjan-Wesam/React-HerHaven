import { useState } from "react";

const CompletedOrders = () => {
    const [search, setSearch] = useState("");
    const [orders] = useState([
        { id: 2, customer: "Customer 2", total: "$30", status: "Completed" },
    ]);

    const filteredOrders = orders.filter(order =>
        order.customer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h2>Completed Orders</h2>
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="orders-list">
                {filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <p><strong>Customer:</strong> {order.customer}</p>
                        <p><strong>Total:</strong> {order.total}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedOrders ;
