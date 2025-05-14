import { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/css/ownerStyles/Reviews.css";
import Swal from "sweetalert2";

const ReviewsManagement = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [siteReviews, setSiteReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;


  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://127.0.0.1:8000/api/owner/site-reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSiteReviews(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setError("Failed to load reviews. Please try again later.");
      setSiteReviews([]);
    } finally {
      setLoading(false);
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

      Swal.fire({
        icon: "success",
        title: "Review Sent Successfully",
        text: res.data.message,
        confirmButtonText: "OK",
      });

      setReviewText("");
      setRating(0);
      fetchReviews();
      setCurrentPage(1); 
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.error ||
             error.response?.data?.message ||
             "Failed to submit review. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  // Pagination logic
  const totalReviews = siteReviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = siteReviews.slice(indexOfFirstReview, indexOfLastReview);

console.log('Current Page:', currentPage);
console.log('Total Pages:', totalPages);
console.log('Reviews:', siteReviews.length);


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchReviews} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="review-management">
      <div className="reviews-layout">
        <div className="site-reviews">
          <h3 className="form-title-owner">Your Reviews: {siteReviews.length}</h3>
          
          {currentReviews.length === 0 ? (
            <p className="no-reviews-message">You haven't written any reviews yet.</p>
          ) : (
            <>
              {currentReviews.map((review) => (
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
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="owner-pagination">
                  <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
                    <div className='div-nums'>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}</div>
                  
                <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
             <i className="fas fa-chevron-right"></i>
          </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="review-form-section">
          <form onSubmit={handleSubmit} className="review-form">
            <h3 className="form-title-owner">
              Leave a Review and Let HerHaven Shine More 🌟
            </h3>
            
            <div className="form-group">
              <label htmlFor="reviewText" className="form-label">
                Your Review:
              </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setReviewText(e.target.value);
                  }
                }}
                rows="5"
                placeholder="Write your review here (max 500 characters)"
                className="review-textarea"
                required
              ></textarea>
              <div className="character-count">
                {reviewText.length}/500 characters
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Rating:</label>
              <div className="stars-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`star ${star <= rating ? "active" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;