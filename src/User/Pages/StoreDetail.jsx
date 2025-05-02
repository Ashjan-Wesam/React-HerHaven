import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./StoreDetail.css";
import { FaStar, FaRegStar } from "react-icons/fa";

const StoreDetail = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [activeTab, setActiveTab] = useState("all-products");
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, review_text: "" });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const storeRes = await axios.get(`http://127.0.0.1:8000/api/stores/${storeId}`);
        setStore(storeRes.data);
        setFilteredProducts(storeRes.data.products);

        const categoriesRes = await axios.get(`http://127.0.0.1:8000/api/store-categories/${storeId}`);
        setCategories(categoriesRes.data.categories);

        const reviewsRes = await axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/reviews`);
        console.log(reviewsRes.data)
        setReviews(reviewsRes.data);

        if (token) {
          const canReviewRes = await axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/can-review`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCanReview(canReviewRes.data.allowed);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [storeId]);

  useEffect(() => {
    if (store?.products) {
      let filtered = [...store.products];
      
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedCategory || product.category?.toLowerCase() === selectedCategory.toLowerCase())
      );
      if (sortOption === "price-asc") filtered.sort((a, b) => a.price - b.price);
      else if (sortOption === "price-desc") filtered.sort((a, b) => b.price - a.price);
      else if (sortOption === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
      else if (sortOption === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));

      setFilteredProducts(filtered);
    }
  }, [search, store, selectedCategory, sortOption]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) return alert("Please login to submit a review");
    if (!newReview.review_text.trim()) return alert("Review text cannot be empty");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/stores/reviews",
        { store_id: storeId, ...newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReviews([res.data.review, ...reviews]);
      setNewReview({ rating: 5, review_text: "" });
      alert("Review submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting review");
    }
  };

  if (!store) return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="store-header">
        <div className="store-container">
          <div className="store-top">
            <div className="store-info">
              <img 
                src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`} 
                alt={store.store_name}
                className="store-logo-img"
              />
              <div>
                <h1 className="store-name">{store.store_name}</h1>
                <p className="store-description">{store.description}</p>
              </div>
            </div>
            <div  className="store-stats-box">
            <div className="store-stats">
              {[
                { icon: "fa-box", value: store.products?.length || 0, label: "Products" },
                { icon: "fa-star", value: "4.8", label: "Rating" },
                { icon: "fa-calendar-alt", value: "2+", label: "Years" }
              ].map((stat, i) => (
                <div key={i} className="store-stat-item">
                  <p className="stat-number-store"><i className={`fas ${stat.icon}`} /> {stat.value}</p>
                  <p className="stat-label-store">{stat.label}</p>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="store-tabs-container">
        <nav className="store-tabs-wrapper ">
          {["all-products", "reviews", "about"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
            >
              {tab.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="store-content">
  {activeTab === "reviews" ? (
    <div className="reviews-container">
      <h2 style={{ color: "#444", marginBottom: "20px" }}>Customer Reviews</h2>
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map(rev => (
            <div key={rev.id} className="review-card-oo" style={{
              background: "linear-gradient(to right, rgb(240, 249, 255) 0%, rgb(170, 122, 208) 0%, rgb(208, 122, 205) 100%)",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              color: "#444"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "2px solid #fff"
                }}>
                  {rev.user?.profile_picture ? (
                    <img 
                      src={rev.user.profile_picture} 
                      alt={rev.user.full_name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "20px", color: "#aa7ad0" }}>
                      {rev.user?.full_name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#444" }}>{rev.user?.full_name || "Anonymous"}</p>
                  <div style={{ color: "#ffc107", fontSize: "18px" }}>
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                </div>
              </div>
              <p className="review-text" style={{
                margin: 0,
                padding: "10px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: "10px",
                lineHeight: "1.5"
              }}>
                {rev.review_text}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#444" }}>No reviews yet.</p>
        )}
      </div>
      
      {canReview && (
        <form onSubmit={handleReviewSubmit} style={{
          background: "linear-gradient(to right, rgb(240, 249, 255) 0%, rgb(170, 122, 208) 0%, rgb(208, 122, 205) 100%)",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "30px"
        }}>
          <h3 style={{ color: "#444", marginTop: 0 }}>Write a Review</h3>
          <div className="rating-section" style={{ marginBottom: "15px" }}>
            {[1, 2, 3, 4, 5].map(r => (
              <span 
                key={r} 
                onClick={() => setNewReview(prev => ({...prev, rating: r}))}
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: r <= newReview.rating ? "#ffc107" : "#ddd",
                  marginRight: "5px"
                }}
              >
                {r <= newReview.rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
          </div>
          <textarea
            value={newReview.review_text}
            onChange={(e) => setNewReview(prev => ({...prev, review_text: e.target.value}))}
            placeholder="Write your review..."
            required
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              minHeight: "100px",
              marginBottom: "15px",
              backgroundColor: "rgba(255,255,255,0.7)"
            }}
          />
          <button 
            type="submit" 
            style={{
              background: "#444",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => e.target.style.opacity = "0.8"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
 
        ) : activeTab === "about" ? (
          <div className="about-container">
            <h2>About {store.store_name}</h2>
            <p>{store.description}</p>
            
            <h3>Store Owner</h3>
            <div className="owner-info">
              <div className="owner-avatar">
                {store.owner.full_name.charAt(0)}
              </div>
              <div>
                <h4>{store.owner.full_name}</h4>
                <p>{store.owner.email}</p>
              </div>
            </div>

            <h3>Contact Information</h3>
            <ul>
              <li>{store.owner.phone_number || "Not provided"}</li>
              <li>{store.owner.email}</li>
              <li>{store.owner.shipping_address || "Address not provided"}</li>
            </ul>
          </div>
        ) : (
          <>
            <div className="store-filter-box">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <div className="store-selects">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-box"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="select-box"
              >
                <option value="">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select></div>
            </div>

            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    
                    <div className="product-image-container">
                    <img
                      src={`http://127.0.0.1:8000/${product.image_url}`}
                      alt={product.name}
                      className="product-image"
                    />
                    {product.on_sale && <div className="sale-badge">SALE</div>}
                    {product.is_featured && <div className="featured-badge">FEATURED</div>}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name ">{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-footer">
                        <div className="product-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= product.rating ? 'filled' : ''}>★</span>
                          ))}
                        </div>
                        <Link className="view-button" to={`/products/${product.id}`}>View</Link>
                      </div>
                    </div>
                    </div>
                ))
              ) : (
                <div className="no-products">
                  <p>No products found</p>
                  <button onClick={() => { setSearch(""); setSelectedCategory(""); }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;