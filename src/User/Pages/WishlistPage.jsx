import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./WishlistPage.css";
import Loading from "../../Owner/Components/Loading";
import emptyw from "../../userTemplate/img/emptywish.png";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
      Swal.fire({ icon: "success", title: "Removed", text: "Product removed from wishlist." });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops", text: "Failed to remove product." });
    }
  };

  const filteredWishlist = wishlist.filter((item) =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="wishlist-container">
      <h2 className="text-2xl font-bold mb-6 page-user-title">Your Wish List</h2>

      <div className="cat-search-container" style={{ margin: "auto" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="cat-search-input"
        />
        <i className="fas fa-search cat-search-icon"></i>
      </div>

      {loading && <Loading />}

      {!loading && wishlist.length === 0 && (
        <div className="empty-cart">
          <img src={emptyw} alt="Empty Cart" className="empty-cart-image" />
          <h2 className="empty-cart-message">Your Wishlist is empty!</h2>
          <p className="empty-cart-instruction">Add something to make me happy</p>
        </div>
      )}

      {!loading && wishlist.length > 0 && filteredWishlist.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          No products match your search.
        </p>
      )}

      <div className="wishlist-grid">
        {!loading &&
          currentItems.map(({ product }) => (
            <div key={product.id} className="wishlist-card">
              <img src={`http://127.0.0.1:8000/${product.image_url}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} JOD</p>
              <div className="wishlist-buttons">
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="show-category-btn"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="delete-category-btn"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
      </div>

      {totalPages > 1 && !loading && (
        <div className="owner-pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="div-nums">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
