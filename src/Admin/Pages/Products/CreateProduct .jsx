import  { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CreateProduct = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    store_id: '',
    category_id: '',
    image_url: '',
    request: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/products', formData)
      .then(response => {
        history.push('/admin/products');
      })
      .catch(error => console.error("There was an error creating the product:", error));
  };

  return (
    <div className="admin-products-container">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Store</label>
          <input
            type="text"
            name="store_id"
            value={formData.store_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Request</label>
          <select
            name="request"
            value={formData.request}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <button type="submit" className="btn btn-edit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
