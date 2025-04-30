import { useEffect, useState } from "react";
import axios from "axios";
import "./OrderRequests.css";

const OrderRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:8000/api/my-design-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    };

    fetchRequests();
  }, []);

  return (
    <div className="order-requests">
      <h2>Your Design Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <strong>{req.product.name}</strong>
              <p>{req.design_details}</p>
              <span className={`status ${req.status}`}>Status: {req.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderRequests;
