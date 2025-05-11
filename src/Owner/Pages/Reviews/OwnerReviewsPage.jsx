import { useEffect, useState } from "react";
import axios from "axios";

const OwnerReviewsPage = () => {
  const [storeReviews, setStoreReviews] = useState([]);
  const [productReviews, setProductReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/owner/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStoreReviews(res.data.store_reviews);
        setProductReviews(res.data.product_reviews);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="reviews-page">
  <h2>Store & Product Reviews</h2>

  <div className="review-section">
    <h3>🛍️ Store Reviews</h3>
    <table className="review-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Rating</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody>
        {storeReviews.length > 0 ? (
          storeReviews.map((rev) => (
            <tr key={rev.id}>
              <td>{rev.user?.name}</td>
              <td className="rating">{rev.rating} ⭐</td>
              <td>{rev.review_text}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="no-reviews">No store reviews found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  <div className="review-section">
    <h3>📦 Product Reviews</h3>
    <table className="review-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Product</th>
          <th>Rating</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody>
        {productReviews.length > 0 ? (
          productReviews.map((rev) => (
            <tr key={rev.id}>
              <td>{rev.user?.name}</td>
              <td>{rev.product?.name}</td>
              <td className="rating">{rev.rating} ⭐</td>
              <td>{rev.review_text}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="no-reviews">No product reviews found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default OwnerReviewsPage;
