import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "./StoreDetail.css";
import Swal from 'sweetalert2';

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
  const [stats, setStats] = useState(null);
  
  // Pagination states
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const reviewsPerPage = 6;
  const productsPerPage = 8;

  // Calculate pagination for reviews
  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  // Calculate pagination for products
  const indexOfLastProduct = currentProductPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleReviewPageChange = (pageNumber) => {
    setCurrentReviewPage(pageNumber);
  };

  const handleProductPageChange = (pageNumber) => {
    setCurrentProductPage(pageNumber);
  };
  

  // Reset product page when filters change
  useEffect(() => {
    setCurrentProductPage(1);
  }, [search, selectedCategory, sortOption]);

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
        setReviews(reviewsRes.data);

        const statsres = await axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/stat`);
        setStats(statsres.data);

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
  
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to submit a review.",
      });
      return;
    }
  
    if (!newReview.review_text.trim()) {
      Swal.fire({
        icon: "error",
        title: "Empty Review",
        text: "Review text cannot be empty.",
      });
      return;
    }
  
    if (newReview.review_text.length > 100) {
      Swal.fire({
        icon: "error",
        title: "Too Long",
        text: "Review text cannot exceed 100 characters.",
      });
      return;
    }
  
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/stores/reviews",
        { store_id: storeId, ...newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setReviews([res.data.review, ...reviews]);
      setNewReview({ rating: 5, review_text: "" });
      setCurrentReviewPage(1); // Reset to first page after new review
  
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Review submitted successfully.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Error submitting review.",
      });
    }
  };

  if (!store) return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
    if (totalPages <= 1) return null;
  
    return (
      <div className={`pagination ${className}`}>
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          <FaAngleLeft />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          <FaAngleRight />
        </button>
      </div>
    );
  };

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
            <div className="store-stats-box">
              <div className="store-stats">
                {[
                  { icon: "fa-box", value: stats?.products_count || "0", label: "Products" },
                  { icon: "fa-star", value: stats?.average_rating?.toFixed(1) || "0.0", label: "Rating" },
                  { icon: "fa-calendar-alt", value: stats?.completed_orders_count || 0, label: "Orders" }
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
        <nav className="store-tabs-wrapper">
          {["all-products", "reviews", "about"].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                // Reset to first page when switching tabs
                if (tab === "all-products") setCurrentProductPage(1);
                if (tab === "reviews") setCurrentReviewPage(1);
              }}
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
           
            
            <div className="reviews-list">
            <h2 style={{ color: "#444", marginBottom: "20px", textAlign: "start" }}>
  Customer Reviews <span style={{ color: "#aa7ad0", fontSize: "0.8em" }}>({reviews.length} Reviews)</span>
</h2>
              {reviews.length > 0 ? (
                currentReviews.map(rev => (
                  <div key={rev.id} className="review-card-oo">
                    <div className="rev-card-con">
                      <div className="rev-card-info">
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
                        <p>{rev.user?.full_name || "Anonymous"}</p>
                        <div className="rev-star">
                          {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="review-text">
                      {rev.review_text}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#444" }}>No reviews yet.</p>
              )}
               {/* Reviews Pagination */}
            {reviews.length > reviewsPerPage && (
              <Pagination
                currentPage={currentReviewPage}
                totalPages={totalReviewPages}
                onPageChange={handleReviewPageChange}
                className="reviews-pagination"
              />
            )}

            </div>

           
            {canReview && (
              <form onSubmit={handleReviewSubmit} className="rev-form">
                <h2 style={{fontSize:"21px", color: "#777", marginBottom: "0" , textAlign : "start"}}>We'd love to hear your thoughts</h2>
                <textarea
                  value={newReview.review_text}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 100) {
                      setNewReview(prev => ({ ...prev, review_text: value }));
                    }
                  }}
                  placeholder="Write your review..."
                  required
                  className="textarea-rev"
                  maxLength={100}
                />
                <small style={{fontSize:"15px", textAlign:"start", color: newReview.review_text.length === 100 ? "red" : "#888" }}>
                  {newReview.review_text.length}/100 characters
                </small>
                <div className="rating-section" style={{ marginBottom: "15px" }}>
                  {[1, 2, 3, 4, 5].map(r => (
                    <span
                      key={r}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: r }))}
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
                <button
                  type="submit"
                  className="rev-submit"
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
          <h2 className="about-title">About {store.store_name}</h2>
          <p className="about-description">{store.description}</p>
          <div style={{ display: "flex", width:"100%" , gap: "20px" }}>
          <div className="owner-section" style={{ width:"40%" }}>
            <h3 className="section-title">{store.store_name} Owner</h3>
            <div className="owner-info">
              <div className="owner-avatar">
                {store.owner.full_name.charAt(0)}
              </div>
              <div className="owner-info-details">
                <h4>{store.owner.full_name}</h4>
                <p className="owner-email">{store.owner.email}</p>
              </div>
            </div>
          </div>
        
          <div className="contact-section" style={{ width:"60%" }}>
            <h3 className="section-title">Contact Information</h3>
            <ul className="contact-list">
              <li className="contact-item">
                <i className="fas fa-phone"></i>
                {store.owner.phone_number || "Not provided"}
              </li>
              <li className="contact-item">
                <i className="fas fa-envelope"></i>
                {store.owner.email}
              </li>
              <li className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                {store.owner.shipping_address || "Address not provided"}
              </li>
            </ul>
          </div>
        </div></div>
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
                </select>
              </div>
            </div>

            <div className="product-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container">
                      <img
                        src={`http://127.0.0.1:8000/${product.image_url}`}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                      <div className="product-rating">
  {product.reviews_count > 0 ? (
    
    [1, 2, 3, 4, 5].map((star) => {
      const rating = product.average_rating || 0; 

      if (star <= Math.floor(rating)) {
        return <span key={star} className="star full">★</span>; 
      } else if (star - rating <= 0.5 && star > rating) {
        return <span key={star} className="star half">★</span>; 
      } else {
        return <span key={star} className="star empty">★</span>; 
      }
    })
  ) : (
    <p style={{ color: "#777", fontSize: "1.5rem" }}>No reviews yet</p> 
  )}
</div>



                        <Link className="view-button" to={`/products/${product.id}`}>View</Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-stores">
                  <p>No products found</p>
                  <button onClick={() => { setSearch(""); setSelectedCategory(""); }}  className="btn btn-outline-secondary mt-3">
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Products Pagination */}
            {filteredProducts.length > productsPerPage && (
              <Pagination
                currentPage={currentProductPage}
                totalPages={totalProductPages}
                onPageChange={handleProductPageChange}
                className="products-pagination"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;