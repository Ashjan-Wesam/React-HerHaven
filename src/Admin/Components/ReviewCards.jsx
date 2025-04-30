import { useState, useEffect } from "react";
import axios from "axios";

const ReviewCards = () => {
  const [reviews, setReviews] = useState({
    product_reviews: [],
    store_reviews: [],
    site_reviews: [],
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/admin/reviews", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      setReviews(res.data);
    })
    .catch((err) => {
      console.error("Error loading reviews:", err);
    });
  }, []);

  const deleteReview = async (type, id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/reviews/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews((prevState) => ({
        ...prevState,
        [`${type}_reviews`]: prevState[`${type}_reviews`].filter((review) => review.id !== id),
      }));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="review-cards-container">
      <h2>Manage Reviews</h2>
      
      <div className="review-card" onClick={() => window.location.href = "/admin/reviews/product"}>
        <h3>Product Reviews</h3>
        <p>{reviews.product_reviews.length} reviews</p>
      </div>
      
      <div className="review-card" onClick={() => window.location.href = "/admin/reviews/store"}>
        <h3>Store Reviews</h3>
        <p>{reviews.store_reviews.length} reviews</p>
      </div>

      <div className="review-card" onClick={() => window.location.href = "/admin/reviews/site"}>
        <h3>Site Reviews</h3>
        <p>{reviews.site_reviews.length} reviews</p>
      </div>
    </div>
  );
};

export default ReviewCards;
