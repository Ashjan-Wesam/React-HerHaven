import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/reviews/product', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const deleteReview = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this review deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/reviews/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire('Deleted!', 'The review has been deleted.', 'success');
        fetchReviews();
      } catch (error) {
        Swal.fire('Error', 'Something went wrong while deleting.', 'error');
      }
    }
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-reviews-container">

      {reviews.length === 0 ? (
        <p className="admin-no-reviews">No reviews found.</p>
      ) : (
        <>
          <table className="admin-table">
            <thead className="admin-thead">
              <tr className="admin-tr">
                <th className="admin-th">User</th>
                <th className="admin-th">Product</th>
                <th className="admin-th">Rating</th>
                <th className="admin-th">Review</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody className="admin-tbody">
              {currentReviews.map((review) => (
                <tr className="admin-tr" key={review.id}>
                  <td className="admin-td">{review.user?.full_name}</td>
                  <td className="admin-td">{review.product?.name}</td>
                  <td className="admin-td">{review.rating}</td>
                  <td className="admin-td">{review.review_text}</td>
                  <td className="admin-td">
                    <button  className="admin-delete-button" onClick={() => deleteReview(review.id)}>Delete</button>
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

export default AdminProductReviews;


  