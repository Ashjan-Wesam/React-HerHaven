import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/admin/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(res => {
      console.log("Order data:", res.data); 
      setOrder(res.data);
    }).catch(err => {
      console.error("Fetch order error:", err);
    });
  }, [id]);
  

  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-details-container">
      <h2>Order #{order.id}</h2>
      <p><strong>User:</strong> {order.user?.full_name}</p>
      <p><strong>Store:</strong> {order.store?.store_name}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Price:</strong> ${order.total_price}</p>

      <h3>Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.order_details.map((item, idx) => (
            <tr key={idx}>
              <td>{item.product?.name}</td>
              <td>{item.quantity}</td>
              <td>${item.unit_price}</td>
              <td>${item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOrder;
