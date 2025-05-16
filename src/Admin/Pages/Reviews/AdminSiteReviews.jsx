import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../assets/css/adminStyles/reviews.css';

const AdminSiteReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        'http://127.0.0.1:8000/api/admin/reviews/site',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const deleteReview = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://127.0.0.1:8000/api/admin/reviews/site/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire(
          'Deleted!',
          'Review has been deleted.',
          'success'
        );
        
        const lastIndex = currentPage * reviewsPerPage;
        const firstIndex = lastIndex - reviewsPerPage;
        const currentReviewsCount = reviews.slice(firstIndex, lastIndex).length;
        if (currentReviewsCount === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire(
          'Error!',
          'Failed to delete review.',
          'error'
        );
      }
    }
  };

  const lastIndex = currentPage * reviewsPerPage;
  const firstIndex = lastIndex - reviewsPerPage;
  const currentReviews = reviews.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="admin-reviews-container">
      
      {reviews.length === 0 ? (
        <p className="admin-empty">No reviews found.</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.store?.store_name}</td>
                  <td>{review.rating}</td>
                  <td>{review.review_text}</td>
                  <td>
                    <button
                      className="admin-delete-button"
                      onClick={() => deleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default AdminSiteReviews;
