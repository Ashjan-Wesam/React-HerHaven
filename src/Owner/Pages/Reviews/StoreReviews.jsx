import { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/css/ownerStyles/Reviews.css";
import Loading from "../../Components/Loading";

const StoreReviews = () => {
  const [storeReviews, setStoreReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 20;

  useEffect(() => {
    const fetchStoreReviews = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/owner/store-reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStoreReviews(res.data.store_reviews);
      } catch (err) {
        console.error("Error fetching store reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreReviews();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "store-review-star filled" : "store-review-star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = storeReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(storeReviews.length / reviewsPerPage);

  return (
    <div className="store-review-container">
      

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="store-review-grid">
            {currentReviews.length > 0 ? (
              currentReviews.map((rev) => (
                <div key={rev.id} className="store-review-card">
                  <div className="store-review-user">
                    {rev.user?.profile_picture ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/profile/${rev.user.profile_picture}`}
                        alt="User"
                        className="store-review-user-img"
                      />
                    ) : (
                      <div className="store-review-user-img placeholder">N/A</div>
                    )}
                    <span className="store-review-user-name">{rev.user?.full_name || "Unknown"}</span>
                  </div>
                  <div className="store-review-stars">{renderStars(rev.rating)}</div>
                  <p className="store-review-text">{rev.review_text}</p>
                </div>
              ))
            ) : (
              <p className="store-review-no-reviews">No store reviews found.</p>
            )}
          </div>

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
  );
};

export default StoreReviews;
