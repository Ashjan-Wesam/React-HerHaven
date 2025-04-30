import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/ownerStyles/CateoriesPage.css';

const ShowCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
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
  );

  return (
    <div className="show-category-container">
      {category ? (
        <>
          <h2 className="category-title">Category: {category.name}</h2>
          <p className="category-description">{category.description}</p>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <ul className="product-list">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map(prod => (
                <li key={prod.id} className="product-item">
                  <div className="product-image">
                    <img src={`http://127.0.0.1:8000/${prod.image_url}`} alt={prod.name} className="product-img" />
                  </div>
                  <div className="product-details">
                    <strong>{prod.name}</strong>
                    <p>${prod.price}</p>
                  </div>
                </li>
              ))
            ) : (
              <li>No matching products found.</li>
            )}
          </ul>
        </>
      ) : (
        <p>Loading category...</p>
      )}
    </div>
  );
};

export default ShowCategory;
