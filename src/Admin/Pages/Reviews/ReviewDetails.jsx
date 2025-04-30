import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ReviewDetails = () => {
  const { type } = useParams();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/admin/reviews/${type}`, {
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
  }, [type]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/reviews/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="review-details-container">
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Reviews</h2>
      
      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <h3>{review.user ? review.user.full_name : "Anonymous"}</h3>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Review:</strong> {review.review_text}</p>
              <button onClick={() => handleDelete(review.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewDetails;
