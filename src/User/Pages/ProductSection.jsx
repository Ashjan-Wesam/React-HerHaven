import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ProductSection.css";
import Loading from "../../Owner/Components/Loading";

const ProductSection = () => {
  const navigate = useNavigate();
  const [latestProducts, setLatestProducts] = useState([]);
  const [storesWithDiscount, setStoresWithDiscount] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");

 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/home");
        setLatestProducts(res.data.latest_products);
        setStoresWithDiscount(res.data.stores_with_discount);
        setTopStores(res.data.top_stores);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // دالة لإضافة منتج للويشليست
  const addToWishlist = async (productId) => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Please login to add products to wishlist.",
      });
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/wishlist",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Added",
        text: "Product added to wishlist",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to add product to wishlist",
      });
      console.error("Wishlist add error:", error);
    }
  };

  return (
    <section className="ps-discovery-section">
      <div className="ps-header-wrapper">
        <h2 className="ps-main-title">
          Discover Our Collection
          <span className="ps-title-underline"></span>
        </h2>
        <p className="ps-subtitle">Find the perfect items for your style</p>
      </div>

      {/* Filter buttons */}
      <div className="ps-filter-nav">
        <button
          onClick={() => setActiveTab("latest")}
          className={`ps-filter-btn ${
            activeTab === "latest" ? "ps-active-filter" : ""
          }`}
        >
          Latest Products
        </button>
        <button
          onClick={() => setActiveTab("discount")}
          className={`ps-filter-btn ${
            activeTab === "discount" ? "ps-active-filter" : ""
          }`}
        >
          Stores with Discount
        </button>
        <button
          onClick={() => setActiveTab("top")}
          className={`ps-filter-btn ${
            activeTab === "top" ? "ps-active-filter" : ""
          }`}
        >
          Top Selling Stores
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Latest Products */}
          {activeTab === "latest" && (
            <div className="ps-product-grid">
              {latestProducts.map((product) => (
                <div key={product.id} className="ps-product-card">
                  <div className="ps-product-media">
                    <img
                      src={`http://127.0.0.1:8000/${product.image_url}`}
                      alt={product.name}
                      className="ps-product-image"
                    />
                    <div className="ps-badge-group">
                      <span className="ps-badge ps-new-badge">New</span>
                    </div>
                    <div className="ps-action-buttons">
                      <button
                        className="ps-action-btn ps-quick-view"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <i className="far fa-eye"></i> Quick View
                      </button>
                      <button
                        className="ps-action-btn ps-wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(product.id);
                        }}
                      >
                        <i className="far fa-heart"></i> Save
                      </button>
                    </div>
                  </div>
                  <div className="ps-product-details">
                    <h3 className="ps-product-title">{product.name}</h3>
                    <p className="ps-store-name">{product.store?.name}</p>
                    <div className="ps-price-tag">JOD {product.price}</div>
                    <button
                      className="ps-add-to-cart"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stores with Discount */}
          {activeTab === "discount" && (
            <div className="ps-product-grid">
              {storesWithDiscount.map((store) => (
                <div key={store.id} className="ps-product-card">
                  <div className="ps-product-media">
                    <img
                      src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`}
                      alt={store.store_name}
                      className="ps-product-image"
                    />
                    <div className="ps-badge-group">
                      <span className="ps-badge ps-discount-badge">Discount</span>
                    </div>
                    <div className="ps-action-buttons">
                      <button
                        className="ps-action-btn ps-quick-view"
                        onClick={() => navigate(`/store/${store.id}`)}
                      >
                        <i className="far fa-eye"></i> View Store
                      </button>
                      <button
                        className="ps-action-btn ps-wishlist"
                        onClick={() => navigate("/wishlist")}
                      >
                        <i className="far fa-heart"></i> Save
                      </button>
                    </div>
                  </div>

                  <div className="ps-product-details">
                    <h3 className="ps-product-title">{store.store_name}</h3>
                    <p className="ps-store-description">
                      {store.description?.slice(0, 80)}...
                    </p>
                    <button
                      className="ps-add-to-cart"
                      onClick={() => navigate(`/store/${store.id}`)}
                    >
                      <i className="fas fa-store"></i> Visit Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top Selling Stores */}
          {activeTab === "top" && (
            <div className="ps-product-grid">
              {topStores.map((store) => (
                <div key={store.id} className="ps-product-card">
                  <div className="ps-product-media">
                    <img
                      src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`}
                      alt={store.store_name}
                      className="ps-product-image"
                    />
                    <div className="ps-badge-group">
                      <span className="ps-badge ps-top-badge">Top Seller</span>
                    </div>
                    <div className="ps-action-buttons">
                      <button
                        className="ps-action-btn ps-quick-view"
                        onClick={() => navigate(`/store/${store.id}`)}
                      >
                        <i className="far fa-eye"></i> View Store
                      </button>
                      <button
                        className="ps-action-btn ps-wishlist"
                        onClick={() => navigate("/wishlist")}
                      >
                        <i className="far fa-heart"></i> Save
                      </button>
                    </div>
                  </div>
                  <div className="ps-product-details">
                    <h3 className="ps-product-title">{store.store_name}</h3>
                    <div className="ps-price-tag">{store.completed_orders_count} Orders</div>
                    <button
                      className="ps-add-to-cart"
                      onClick={() => navigate(`/store/${store.id}`)}
                    >
                      <i className="fas fa-store"></i> Visit Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductSection;
