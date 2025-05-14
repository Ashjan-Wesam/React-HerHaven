import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./OrderRequests.css";
import no_order from  "../../userTemplate/img/noOrder.jpg"
import Loading from "../../Owner/Components/Loading"

const OrderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [cartAdded, setCartAdded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/my-design-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
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

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.design_details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || req.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
  return <Loading />;
}

  return (
    <div className="orders-container">
      <h2  className="text-2xl font-bold mb-6 page-user-title">Your Design Requests</h2>

      <div className="filters">
        <div className="cat-search-container">
        <input
          type="text"
          placeholder="Search by product or details..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
         className="cat-search-input"
          />
          <i className="fas fa-search cat-search-icon"></i>
</div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="input-filter"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="order-requests">
        {filteredRequests.length === 0 ? (
          <div style={{ margin: "auto" }} className="cat-no-products">
                <img src={no_order} alt="No products" className="cat-no-products-img" />
                <p>No requests match your search.</p>
              </div>
         
        ) : (
          <ul>
            {paginatedRequests.map((req) => (
              <li key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                <strong>{req.product.name}</strong>
                <p>{req.design_details}</p>
                </div>
                <span className={`status ${req.status}`}>Status: {req.status}</span>
                {req.status === "approved" && (
                  <div>
                    <button
                      className="requestAdd"
                      onClick={() => handleAddToCart(req.id, req.product.id, req.design_details)}
                      disabled={cartAdded[req.id]}
                    >
                      {cartAdded[req.id] ? "Added to Cart" : "Add to Cart"}
                    </button>
                    {cartAdded[req.id] && (
                      <span className="cart-message">
                        Product added to cart. Please complete your payment!
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="owner-pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
           <div className='div-nums'>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}</div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
               <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderRequests;
