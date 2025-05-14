import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./OrderRequests.css";

const OrderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [cartAdded, setCartAdded] = useState({}); 
  const navigate = useNavigate();

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

  const handleAddToCart = async (designRequestId, productId, designDetails) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const matchResponse = await axios.get(
        `http://127.0.0.1:8000/api/cart/check-store/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const isMatch = matchResponse.data.match;

      if (isMatch) {
        await addProductToCart(designRequestId, productId, designDetails);
      } else {
        const result = await Swal.fire({
          title: "Different Store Detected",
          text: "Your cart has items from another store. What would you like to do?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Go to Checkout",
          cancelButtonText: "Clear Cart and Add New Product",
        });

        if (result.isConfirmed) {
          return navigate("/cart");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          await axios.delete("http://127.0.0.1:8000/api/cart/clear", {
            headers: { Authorization: `Bearer ${token}` },
          });
          await addProductToCart(designRequestId, productId, designDetails);
        }
      }
    } catch (error) {
      console.error("Error checking store match:", error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong!" });
    }
  };

  const addProductToCart = async (designRequestId, productId, designDetails) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
     await axios.post(
  "http://127.0.0.1:8000/api/cart/add",
  {
    product_id: productId,
    quantity: 1,
    price: 100,
    design_details: designDetails,
    design_request_id: designRequestId, 
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);


      setCartAdded((prevState) => ({
        ...prevState,
        [designRequestId]: true, 
      }));

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "Your product has been added to the cart!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to add the product to the cart." });
    }
  };

  return (
    <div>
    <h2 style={{ textAlign: "center" }}>Your Design Requests</h2>
    <div className="order-requests">
      
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <strong>{req.product.name}</strong>
              <p>{req.design_details}</p>
              <span className={`status ${req.status}`}>Status: {req.status}</span>
              {req.status === "approved" && (
                <div>
                  <button className="requestAdd"
                    onClick={() => handleAddToCart(req.id, req.product.id, req.design_details)}
                    disabled={cartAdded[req.id]} 
                  >
                    {cartAdded[req.id] ? "Added to Cart" : "Add to Cart"}
                  </button>
                  {cartAdded[req.id] && (
                    <span className="cart-message">Product added to cart. Please complete your payment!</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default OrderRequests;
