import { useState } from "react";
import axios from "axios";

const ReviewsManagement = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/owner/site-reviews", 
        {
          rating,
          review_text: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setSuccessMessage(res.data.message);
      setReviewText("");
      setRating(0);
      setErrorMessage("");
      
      // Log success
      console.log('Review submitted:', res.data);
      
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Failed to submit review. Please try again."
      );
    }
  };
  
  return (
    <div className="review-management">
      <h2>Write a Review About Our Website</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating">
          <label>Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: "2rem",
                  color: star <= rating ? "#FFD700" : "#ccc",
                  cursor: "pointer",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="review-text">
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="5"
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button">Submit Review</button>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ReviewsManagement;
