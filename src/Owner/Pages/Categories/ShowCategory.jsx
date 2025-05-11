import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/ownerStyles/CateoriesPage.css';
import notfound from '../../../assets/img/nofound.jpg';
import Loading from '../../Components/Loading';


const ShowCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const token = localStorage.getItem('token');
  const store = JSON.parse(localStorage.getItem("store"));

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/owner/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { store_id: store?.id }
        });
        setCategory(response.data);
      } catch (err) {
        console.error("Failed to fetch category products", err);
      }
    };

    fetchCategoryProducts();
  }, [id, store?.id]);

  const filteredProducts = category?.products?.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="show-category-container">
      {category ? (
        <>
          <h2 className="category-title">Category: {category.name}</h2>
          <p className="category-description">{category.description}</p>

          <div className="cat-search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); 
              }}
              className="cat-search-input"
            />
            <i className="fas fa-search cat-search-icon"></i>
          </div>
<div className="cat-product-header">
  <h3 className="cat-product-heading">Products in ({category.name})</h3>
  <span className="cat-product-count">Total: {filteredProducts.length}</span>
</div>

<ul className="cat-product-list">
            {currentProducts.length > 0 ? (
              currentProducts.map(prod => (
                <li key={prod.id} className="cat-product-item">
                  <div className="cat-product-image">
                    <img src={`http://127.0.0.1:8000/${prod.image_url}`} alt={prod.name} className="cat-product-img" />
                  </div>
                  <div className="cat-product-details">
                    <strong>{prod.name}</strong>
                    <p>JOD {prod.price}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="cat-no-products">
  <img
    src={notfound}
    alt="No products"
    className="cat-no-products-img"
  />
  <p>No matching products found</p>
</li>

            )}
          </ul>

          {totalPages > 1 && (
            <div className="owner-pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                 <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                  <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
             
        </>
      ) : (
       <Loading />

      )}
    </div>
  );
};

export default ShowCategory;
