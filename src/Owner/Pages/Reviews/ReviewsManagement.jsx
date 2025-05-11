import { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/css/ownerStyles/Reviews.css";

const ReviewsManagement = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [siteReviews, setSiteReviews] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/owner/site-reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSiteReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      fetchReviews();
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to submit review. Please try again."
      );
    }
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = siteReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(siteReviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="review-management">
      <h2>Your Website Reviews</h2>
      <div className="site-reviews">
        {currentReviews.length === 0 ? (
          <p>You haven't written any reviews yet.</p>
        ) : (
          currentReviews.map((review) => (
            <div key={review.id} className="review-card-oo">
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= review.rating ? "#FFD700" : "#ccc",
                      fontSize: "1.5rem",
                      marginRight: "2px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="review-text">{review.review_text}</div>
              <div className="review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active-page" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

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

