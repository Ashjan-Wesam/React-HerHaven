import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./WishlistPage.css";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
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

  const filteredWishlist = wishlist.filter((item) => {
    const nameMatch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategory === "all" || item.product.category?.name === selectedCategory;
    return nameMatch && categoryMatch;
  });

  const categories = [...new Set(wishlist.map((item) => item.product.category?.name).filter(Boolean))];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWishlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>

      <div className="wishlist-controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="wishlist-grid">
        {currentItems.map(({ product }) => (
          <div key={product.id} className="wishlist-card">
            <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price} USD</p>

            <div className="wishlist-buttons">
              <button onClick={() => navigate(`/products/${product.id}`)}>View</button>
              <button onClick={() => handleDelete(product.id)} className="delete-btn">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
