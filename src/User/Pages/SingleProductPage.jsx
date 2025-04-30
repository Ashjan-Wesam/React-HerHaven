import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./SingleProductPage.css";

const SingleProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customDesign, setCustomDesign] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/owner/products/${productId}`);
        setProduct(response.data);

        const related = await axios.get(`http://127.0.0.1:8000/api/related-products/${response.data.category_id}/${response.data.store_id}`);
        setRelatedProducts(related.data);

        const resReviews = await axios.get(`http://127.0.0.1:8000/api/reviews/${productId}`);
        setReviews(resReviews.data);

        const token = localStorage.getItem("token");
        if (token) {
          const check = await axios.get(`http://127.0.0.1:8000/api/can-review/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Can Review Status:", check.data.allowed);

          setCanReview(check.data.allowed);
        }
      } catch (error) {
        console.error("Error loading product details:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const sendDesignRequest = async (same = false) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/design-requests",
        {
          product_id: product.id,
          design_details: same ? "Same as product design" : customDesign,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your request has been sent to the owner. Please wait for approval.",
      });

      navigate("/customer/order-requests");
    } catch (error) {
      console.error("Failed to send request:", error);
      Swal.fire({ icon: "error", title: "Oops", text: "Something went wrong!" });
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
  
    try {
      // 1. تحقق من المتجر
      const matchResponse = await axios.get(
        `http://127.0.0.1:8000/api/cart/check-store/${product.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const isMatch = matchResponse.data.match;
  
      if (isMatch) {
        // ✅ نفس المتجر، أضف المنتج
        return await addProductToCart();
      } else {
        // ❌ متجر مختلف، اعرض خيارات للمستخدم
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
  
          await addProductToCart();
        }
      }
    } catch (error) {
      console.error("Error checking store match:", error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong!" });
    }
  };
  
  
  
  const addProductToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/add",
        {
          product_id: product.id,
          quantity: 1,             
          price: product.price,    
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
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
  if (!product) return <div>Loading...</div>;
  return (
    <div className="single-product-wrapper">
      <div className="single-product-content">
        <div className="product-image-section">
          <img src={`http://127.0.0.1:8000/${product.image_url}`} alt={product.name} />
        </div>

        <div className="product-info-section">
          <h2>{product.name}</h2>
          <p className="product-price">${product.price}</p>
          <p className="product-description">{product.description || "No description available."}</p>

          <div className="quantity-section">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          {product.request === "yes" && (
            <div className="custom-design-section">
              <label>Custom Design Request:</label>
              <textarea
                value={customDesign}
                onChange={(e) => setCustomDesign(e.target.value)}
                placeholder="Enter your custom design here..."
              ></textarea>

              <button className="send-request" onClick={() => sendDesignRequest(false)} disabled={customDesign.trim() === ""}>
                SEND DESIGN REQUEST
              </button>

              <button className="send-request" onClick={() => sendDesignRequest(true)}>
                SEND SAME DESIGN
              </button>
            </div>
          )}

          {product.request === "no" && (
            <button className="add-to-cart" onClick={handleAddToCart}>
              ORDER NOW
            </button>
          )}
        </div>
      </div>

      <div className="product-reviews-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.user.full_name}</strong>
                  <div className="review-stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} style={{ color: index < review.rating ? "#ffc107" : "#e4e5e9" }}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {canReview && (
        <div className="add-review-form">
          <h4>Leave a Review</h4>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Write your review..."
          ></textarea>
          <div className="rating-stars">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                onClick={() => setReviewRating(index + 1)}
                style={{
                  cursor: "pointer",
                  fontSize: "1.8rem",
                  color: index < reviewRating ? "#ffc107" : "#e4e5e9",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <button
            className="send-request"
            onClick={async () => {
              const token = localStorage.getItem("token");
              if (!token) return navigate("/login");

              const user = JSON.parse(localStorage.getItem("user"));
              if (!user || !user.id) return navigate("/login");

              if (!token) {
                console.log("Token not found");
                return navigate("/login");
              }

              console.log("Sending review with token:", token);

              try {
                await axios.post(
                  "http://127.0.0.1:8000/api/reviews",
                  {
                    product_id: product.id,
                    review_text: reviewComment,
                    rating: reviewRating,
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    'Content-Type': 'application/json',
                  }
                );

                Swal.fire("Thank you!", "Your review was submitted.", "success");
                setReviewComment("");
                setReviewRating(5);
              } catch (err) {
                console.error("Error Submitting review:", err);
                Swal.fire("Error", "There was an error submitting your review.", "error");
              }
            }}
          >
            Submit Review
          </button>
        </div>
      )}
      <div className="related-products-section">
        <h3>Related Products</h3>
        <div className="related-products-list">
          {relatedProducts.slice(0, 4).map((p) => (
            <div key={p.id} className="related-product-card">
              <img src={`http://127.0.0.1:8000/${p.image_url}`} alt={p.name} />
              <p>{p.name}</p>
              <span>${p.price}</span>
            </div>
          ))}
        </div>
        <button className="show-more-btn" onClick={() => navigate(`/store/${product.store_id}`)}>
          Show More
        </button>
      </div>
    </div>
  );
};
export default SingleProductPage;