import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./SingleProductPage.css";
import Loading from "../../Owner/Components/Loading";

const SingleProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customDesign, setCustomDesign] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [charsRemaining, setCharsRemaining] = useState(150); 
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 6;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/single-product/${productId}`);
        setProduct(response.data);

        const related = await axios.get(`http://127.0.0.1:8000/api/related-products/${response.data.category_id}/${response.data.store_id}/${productId}`);
        setRelatedProducts(related.data);

        const resReviews = await axios.get(`http://127.0.0.1:8000/api/reviews/${productId}`);
        setReviews(resReviews.data);

        const token = localStorage.getItem("token");
        if (token) {
          const check = await axios.get(`http://127.0.0.1:8000/api/can-review/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCanReview(check.data.allowed);
        
          const wishlistCheck = await axios.get(`http://127.0.0.1:8000/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const isInWishlist = wishlistCheck.data.some(item => item.product.id === response.data.id);
          setInWishlist(isInWishlist);

         

        }
        
      } catch (error) {
        console.error("Error loading product details:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleReviewPageChange = (pageNumber) => {
    setCurrentReviewPage(pageNumber);
  };

  const handleReviewChange = (e) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setReviewComment(value);
      setCharsRemaining(150 - value.length);
    }
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
  
    try {
      if (inWishlist) {
        await axios.delete(`http://127.0.0.1:8000/api/wishlist/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({ icon: "success", title: "Removed", text: "Product removed from wishlist" });
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/wishlist",
          { product_id: product.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({ icon: "success", title: "Added", text: "Product added to wishlist" });
      }
  
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error("Wishlist error:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong." });
    }
  };



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
      const matchResponse = await axios.get(
        `http://127.0.0.1:8000/api/cart/check-store/${product.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const isMatch = matchResponse.data.match;
  
      if (isMatch) {
        return await addProductToCart();
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
          quantity: quantity,            
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

  if (!product) return <Loading />;
  
  return (
    <div className="single-product-wrapper">
      <div className="single-product-content">
        <div className="product-image-section">
          <img src={`http://127.0.0.1:8000/${product.image_url}`} alt={product.name} />
        </div>

        <div className="product-info-section">
          <h2>{product.name}</h2>
          <p className="product-price">JOD {product.price}</p>
          <p className="product-description">{product.description || "No description available."}</p>

          <div className="quantity-section">
            <label>Quantity:</label>
           <input
    type="number"
    id="quantity"
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

 <div style={{ display: "flex",  }}>
           
              <button className="send-request" onClick={() => sendDesignRequest(false)} disabled={customDesign.trim() === ""}>
                SEND DESIGN REQUEST
              </button>

              <button className="send-request" onClick={() => sendDesignRequest(true)}>
                SEND SAME DESIGN
              </button>

                <button onClick={toggleWishlist} className="wishlist-button">
  <i className={inWishlist ? "fas fa-heart" : "far fa-heart"}></i>
</button>
            </div>
            </div>
          )}

          {product.request === "no" && (
            <div style={{ display: "flex",  }}>
           
            <button className="add-to-cart" onClick={handleAddToCart}>
              ORDER NOW
            </button>
              <button onClick={toggleWishlist} className="wishlist-button">
  <i className={inWishlist ? "fas fa-heart" : "far fa-heart"}></i>
</button>
            </div>
          )}
       

        </div>
      </div>

      {canReview && (
        <div className="add-review-form">
          <h4>Leave a Review</h4>
          <textarea
            value={reviewComment}
            onChange={handleReviewChange}
            placeholder="Write your review (max 150 characters)..."
            maxLength={150}
          ></textarea>
          <small className={`chars-counter ${charsRemaining === 0 ? 'chars-limit' : ''}`}>
            {charsRemaining} characters remaining
          </small>
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

              if (reviewComment.trim().length === 0) {
                Swal.fire("Error", "Please write your review before submitting.", "error");
                return;
              }

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
                setCharsRemaining(150);
              } catch (err) {
                console.error("Error Submitting review:", err);
                Swal.fire("Error", "There was an error submitting your review.", "error");
              }
            }}
            disabled={reviewComment.trim().length === 0}
          >
            Submit Review
          </button>
        </div>
      )}

      <div className="product-reviews-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="reviews-list" style={{width: "100%"}}>
            {currentReviews.map((review) => (
              <div key={review.id} className="review-card-oo">
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

        {reviews.length > reviewsPerPage && (
          <div className="reviews-pagination">
            {Array.from({ length: totalReviewPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleReviewPageChange(i + 1)}
                className={`pagination-number ${currentReviewPage === i + 1 ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

   <div className="single-product-related-products-section ">
  <h3>Related Products</h3>

  {relatedProducts.length === 0 ? (
    <p className="single-product-no-related-message">
      No related products found.
    </p>
  ) : (
    <div className="single-product-product-grid">
      {relatedProducts.slice(0, 6).map((p) => (
        <div key={p.id} className="single-product-card">
          <div className="single-product-info">
            <div className="single-product-image-container">
              <img
                src={`http://127.0.0.1:8000/${p.image_url}`}
                alt={p.name}
                className="single-product-image"
              />
            </div>
            <h3 className="single-product-name">{p.name}</h3>
            <p className="single-product-price">JOD {p.price}</p>
            <p className="single-product-category">{p.category}</p>
          </div>
        </div>
      ))}
    </div>
  )}

  {relatedProducts.length > 0 && (
    <div style={{  display:"flex", justifyContent: "center" }}>
  
  <button
      className="single-product-show-more-btn"
      onClick={() => navigate(`/store/${product.store_id}`)}
    >
      Show More
    </button>
    </div>
  )}
</div>

    </div>
  );
};

export default SingleProductPage;