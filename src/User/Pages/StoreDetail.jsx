import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./StoreDetail.css";

const StoreDetail = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [activeTab, setActiveTab] = useState("all-products");
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  


  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/stores/${storeId}`);
        setStore(response.data);
        setFilteredProducts(response.data.products);
        
        setReviews([
          { id: 1, user: "Sarah M.", rating: 5, comment: "Amazing store with great quality products!", date: "2023-05-15" },
          { id: 2, user: "Alex K.", rating: 4, comment: "Good selection but delivery was slow", date: "2023-04-22" },
          { id: 3, user: "Jamie L.", rating: 5, comment: "Will definitely shop here again!", date: "2023-03-10" }
        ]);
      } catch (error) {
        console.error("Failed to fetch store details:", error);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/store-categories/${storeId}`)
      .then(res => {
        setCategories(res.data.categories);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
      });
  }, [storeId]);

  

  useEffect(() => {
    if (store && store.products){
      let filtered = [...store.products]; // إنشاء نسخة جديدة من المصفوفة
    
      console.log('All products:', filtered);
      console.log('Selected category:', selectedCategory);
      console.log('Available categories:', categories);
  
      console.log('Before filters:', filtered); // فحص البيانات قبل الفلاتر
  
      // Apply activeTab filter if selected
      if (activeTab === "sale") {
        filtered = filtered.filter(p => p.on_sale);
      } else if (activeTab === "featured") {
        filtered = filtered.filter(p => p.is_featured);
      }
  
      // Apply search filter
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
  
      // Apply category filter
      if (selectedCategory) {
        filtered = filtered.filter(product => {
          const productCategory = product.category?.toLowerCase() || '';
          return productCategory === selectedCategory.toLowerCase();
        });
      }
  
      // Apply sort option if any
      if (sortOption === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortOption === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === "name-desc") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }
  
      console.log('After filters:', filtered); // فحص البيانات بعد الفلاتر
  
      // Set filtered products state
      setFilteredProducts(filtered);
    }
  }, [search, store, selectedCategory, sortOption, activeTab]);
  
  

  if (!store) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="store-header">
  <div className="store-container">
    <div className="store-top">
      <div className="store-info">
        <div className="store-logo">
          <img 
            src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`} 
            alt={store.store_name}
            className="store-logo-img"
          />
        </div>
        <div>
          <h1 className="store-name">{store.store_name}</h1>
          <p className="store-description">{store.description}</p>
        </div>
      </div>
      <div className="store-stats-box">
      <div className="store-stats">
  <div className="store-stat-item">
    <p className="stat-number">
      <i className="fas fa-box icon-product"></i>
      {store.products?.length || 0}
    </p>
    <p className="stat-label">Products</p>
  </div>
  <div className="store-stat-item">
    <p className="stat-number">
      <i className="fas fa-star icon-star"></i>
      4.8
    </p>
    <p className="stat-label">Average Rating</p>
  </div>
  <div className="store-stat-item">
    <p className="stat-number">
      <i className="fas fa-calendar-alt icon-year"></i>
      2+
    </p>
    <p className="stat-label">Years</p>
  </div>
</div>

      </div>
    </div>
  </div>
</div>


      {/* Navigation Tabs */}
      <div className="store-tabs-container">
  <div className="store-tabs-wrapper">
    <nav className="store-tabs">
      <button
        onClick={() => setActiveTab("all-products")}
        className={`tab-button ${activeTab === "all-products" ? "active" : ""}`}
      >
        All Products
      </button>
      <button
        onClick={() => setActiveTab("sale")}
        className={`tab-button ${activeTab === "sale" ? "active" : ""}`}
      >
        Sale Items
      </button>
      <button
        onClick={() => setActiveTab("featured")}
        className={`tab-button ${activeTab === "featured" ? "active" : ""}`}
      >
        Featured
      </button>
      <button
        onClick={() => setActiveTab("reviews")}
        className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
      >
        Reviews
      </button>
      <button
        onClick={() => setActiveTab("about")}
        className={`tab-button ${activeTab === "about" ? "active" : ""}`}
      >
        About Store
      </button>
    </nav>
  </div>
</div>

{/* Main Content */}
<div className="store-content">
  {activeTab !== "reviews" && activeTab !== "about" && (
    <div className="store-filter-box">
      <div className="store-filter-inner">
        <div className="store-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="store-selects">
        <select
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="select-box"
  value={selectedCategory} 
>
  <option value="">All Categories</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>

          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="select-box"
            defaultValue=""
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>
    </div>
  )}
</div>


        {/* Tab Content */}
        {activeTab === "reviews" ? (
  <div className="reviews-container">
    <div className="reviews-header">
      <h2 className="reviews-title">Customer Reviews</h2>
      <div className="reviews-summary">
        <div className="reviews-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`star-icon ${star <= 4.8 ? 'filled' : 'empty'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="rating-value">4.8 out of 5</span>
        <span className="dot">•</span>
        <span className="reviews-count">{reviews.length} reviews</span>
      </div>
    </div>
    <div className="reviews-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div className="review-user-info">
              <div className="user-avatar">{review.user.charAt(0)}</div>
              <div>
                <h4 className="user-name">{review.user}</h4>
                <div className="user-rating">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`rating-star ${i < review.rating ? 'filled' : 'empty'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <span className="review-date">{review.date}</span>
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
    <div className="write-review">
      <button className="write-review-button">
        Write a Review
      </button>
    </div>
  </div>
) 
: activeTab === "about" ? (
  <div className="about-container">
    <div className="about-header">
      <h2 className="store-title">About {store.store_name}</h2>
    </div>
    <div className="about-body">
      <p className="store-description">{store.description}</p>
      
      <h3 className="section-title">Store Owner</h3>
      <div className="owner-info">
        <div className="owner-avatar">
          {store.owner.full_name.charAt(0)}
        </div>
        <div>
          <h4 className="owner-name">{store.owner.full_name}</h4>
          <p className="owner-email">{store.owner.email}</p>
        </div>
      </div>

      <h3 className="section-title">Contact Information</h3>
      <ul className="contact-list">
        <li className="contact-item">{store.owner.phone_number || "Not provided"}</li>
        <li className="contact-item">{store.owner.email}</li>
        <li className="contact-item">{store.owner.shipping_address || "Address not provided"}</li>
      </ul>

      <h3 className="section-title">Store Policies</h3>
      <div className="policies">
        <div className="policy-item">
          <h4 className="policy-title">Shipping Policy</h4>
          <p className="policy-description">Standard shipping takes 3-5 business days. Express shipping available for an additional fee.</p>
        </div>
        <div className="policy-item">
          <h4 className="policy-title">Return Policy</h4>
          <p className="policy-description">30-day return policy. Items must be unused and in original condition.</p>
        </div>
      </div>
    </div>
  </div>
) : (
  <div className="product-grid">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div key={product.id} className="product-card">
        <div className="product-image-container">
          <img
            src={`http://127.0.0.1:8000/${product.image_url}`} 
            // src={HeroImg2}
            alt={product.name}
            className="product-image"
          />
          {product.on_sale && (
            <div className="sale-badge">SALE</div>
          )}
          {product.is_featured && (
            <div className="featured-badge">FEATURED</div>
          )}
        </div>
        <div className="product-details" style={{ margin: "0" }}>
          <div className="product-header">
            <h3 className="product-name">{product.name}</h3>
            <span className="product-price">${product.price}</span>
          </div>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <div className="product-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`star-icon ${star <= product.rating ? 'filled' : 'empty'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="review-count">({product.review_count})</span>
            </div>
            <Link to={`/products/${product.id}`} className="view-button">
              View
            </Link>
          </div>
        </div>
      </div>
    ))
            ) : (
              <div className="no-products-container">
  <svg
    className="no-products-icon"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  <h3 className="no-products-title">No products found</h3>
  <p className="no-products-description">
    {search || selectedCategory
      ? "Try adjusting your search or filter criteria"
      : "This store currently has no products available"}
  </p>
  <button
    onClick={() => {
      setSearch("");
      setSelectedCategory("");
    }}
    className="clear-filters-button"
  >
    Clear filters
  </button>
</div>

            )}
          </div>
        )}
      </div>
  );
};

export default StoreDetail;