import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../assets/css/ownerStyles/CateoriesPage.css';
import Loading from '../../Components/Loading';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: '',
    request: 'no',
    product_image: null,
    previewImage: null
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productRes, categoriesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/owner/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get('http://127.0.0.1:8000/api/owner/my-categories', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        setProduct({
          ...productRes.data,
          product_image: null,
          previewImage: productRes.data.image_url 
            ? `http://127.0.0.1:8000/${productRes.data.image_url}`
            : null
        });
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load product data',
          timer: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProduct({ 
            ...product, 
            product_image: file,
            previewImage: reader.result
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!product.name || product.name.length > 50) {
      newErrors.name = "Name is required and must be 50 characters or less.";
    }

    if (product.description.length > 300) {
      newErrors.description = "Description must be 300 characters or less.";
    }

    const priceValue = parseFloat(product.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    const stock = parseInt(product.stock_quantity);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock_quantity = "Stock must be 0 or more.";
    }

    if (!product.category_id) {
      newErrors.category_id = "Please select a category.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please correct the highlighted errors',
        timer: 3000
      });
      return;
    }

    const fd = new FormData();
    fd.append('name', product.name);
    fd.append('description', product.description);
    fd.append('price', product.price);
    fd.append('stock_quantity', product.stock_quantity);
    fd.append('category_id', product.category_id);
    fd.append('request', product.request);

    if (product.product_image) {
      fd.append('image_url', product.product_image);
    }

    try {
      setIsLoading(true);
      await axios.post(`http://127.0.0.1:8000/api/owner/products/${id}?_method=PUT`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data"
        }
      });

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/owner/products');
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update product',
        timer: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullPage={true} />;
  }

  return (
    <div className="owner-create-product-page">
      <div className="owner-product-form-container">
        <div className="owner-form-header">
          <h2 className="owner-form-title">Edit Product</h2>
          <p className="owner-form-subtitle">Update your product details</p>
        </div>

        <form onSubmit={handleSubmit} className="owner-product-form">
          <div className="owner-form-grid">
            {/* صورة المنتج */}
            <div className="owner-form-group owner-image-upload-group">
              <div className="owner-image-preview-container">
                {product.previewImage ? (
                  <img src={product.previewImage} alt="Preview" className="owner-image-preview" />
                ) : (
                  <div className="owner-image-placeholder">
                    <i className="fas fa-camera"></i>
                    <span>Product Image</span>
                  </div>
                )}
                <label className="owner-file-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    name="product_image"
                    className="owner-file-input"
                  />
                  <span className="owner-upload-button">Change Image</span>
                </label>
              </div>
            </div>

            {/* اسم المنتج */}
            <div className="owner-form-group">
              <label className="owner-form-label">Product Name</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="e.g. Handmade Leather Wallet"
                maxLength="50"
                required
                className="owner-form-input"
              />
              <div className="owner-input-footer">
                <span className="owner-char-counter">{product.name.length}/50</span>
                {errors.name && <span className="owner-error-message">{errors.name}</span>}
              </div>
            </div>

            {/* وصف المنتج */}
            <div className="owner-form-group">
              <label className="owner-form-label">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Describe your product in detail..."
                maxLength="300"
                className="owner-form-textarea"
                rows="4"
              />
              <div className="owner-input-footer">
                <span className="owner-char-counter">{product.description.length}/300</span>
                {errors.description && <span className="owner-error-message">{errors.description}</span>}
              </div>
            </div>

            {/* السعر والكمية */}
            <div className="owner-form-row">
              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Price ($)</label>
                <div className="owner-input-with-icon">
                  <i className="fas fa-dollar-sign"></i>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    className="owner-form-input"
                  />
                </div>
                {errors.price && <p className="owner-error-message">{errors.price}</p>}
              </div>

              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Stock Quantity</label>
                <div className="owner-input-with-icon">
                  <i className="fas fa-boxes"></i>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={product.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                    className="owner-form-input"
                  />
                </div>
                {errors.stock_quantity && <p className="owner-error-message">{errors.stock_quantity}</p>}
              </div>
            </div>

            {/* الفئة وطلبات التصميم */}
            <div className="owner-form-row">
              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Category</label>
                <div className="owner-select-wrapper">
                  <i className="fas fa-tag"></i>
                  <select
                    name="category_id"
                    value={product.category_id}
                    onChange={handleChange}
                    required
                    className="owner-form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category_id && <p className="owner-error-message">{errors.category_id}</p>}
              </div>

              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Custom Design Requests</label>
                <div className="owner-toggle-switch">
                  <input
                    type="checkbox"
                    id="owner-request-toggle"
                    checked={product.request === "yes"}
                    onChange={() => setProduct({
                      ...product,
                      request: product.request === "yes" ? "no" : "yes"
                    })}
                    className="owner-toggle-input"
                  />
                  <label htmlFor="owner-request-toggle" className="owner-toggle-label">
                    <span className="owner-toggle-handle"></span>
                    <span className="owner-toggle-text">
                      {product.request === "yes" ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="owner-form-actions">
            <button 
              type="button" 
              className="owner-cancel-button" 
              onClick={() => navigate('/owner/products')}
            >
              Cancel
            </button>
            <button type="submit" className="owner-submit-button">
              <i className="fas fa-save"></i> Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;