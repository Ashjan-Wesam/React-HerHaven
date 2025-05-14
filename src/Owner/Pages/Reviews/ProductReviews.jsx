import { useEffect, useState } from "react";
import axios from "axios";

const ProductReviews = () => {
  const [productReviews, setProductReviews] = useState([]);

  useEffect(() => {
    const fetchProductReviews = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/owner/product-reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProductReviews(res.data.product_reviews);
      } catch (err) {
        console.error("Error fetching product reviews", err);
      }
    };

    fetchProductReviews();
  }, []);

  return (
    <div className="reviews-page">
      <h2>📦 Product Reviews</h2>
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
              <td colSpan="4" className="no-reviews">
                No product reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductReviews;
