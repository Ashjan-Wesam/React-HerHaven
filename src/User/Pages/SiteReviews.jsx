import { useEffect, useState } from 'react';
import axios from 'axios';
import './SiteReviews.css';
import Loading from '../../Owner/Components/Loading';

const SiteReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/home');
        setReviews(response.data.site_reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <section className="site-reviews">
      <div className="reviews-container-site">
        <h2 className="site-reviews-title">
          <span className="title-decoration">❝</span>
          Voices Of Satisfaction
          <span
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "3px",
              background:
                "linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)",
              borderRadius: "3px",
            }}
          ></span>
          <span className="title-decoration">❞</span>
        </h2>
        <p className="reviews-subtitle">Discover what our community is saying</p>

        {reviews.length > 0 ? (
          <>
            <div className="reviews-carousel">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`review-card ${index === activeIndex ? 'active' : ''}`}
                >
                  <div className="review-content">
                    <p className="review-message">"{review.review_text}"</p>
                    <div className="review-meta">
                      <div className="review-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? 'filled' : ''}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="review-dots">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-reviews-message">
            <p>Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SiteReviews;
