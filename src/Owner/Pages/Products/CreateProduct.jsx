import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import '../../../assets/css/ownerStyles/Products.css';
import Loading from '../../Components/Loading'; 




const CreateProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    request: "no",
    image_url: null,
    previewImage: null
  });
  

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/owner/my-categories",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data || err);
        Swal.fire("Error", "Failed to fetch categories", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          image_url: file,
          previewImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name || form.name.length > 50) {
      newErrors.name = "Name is required and must be 50 characters or less.";
    }

    if (form.description.length > 300) {
      newErrors.description = "Description must be 300 characters or less.";
    }

    const priceValue = parseFloat(form.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    const stock = parseInt(form.stock_quantity);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock_quantity = "Stock must be 0 or more.";
    }

    if (!form.category_id) {
      newErrors.category_id = "Please select a category.";
    }

    if (!form.image_url) {
      newErrors.image_url = "Product image is required.";
    } else if (!form.image_url.type.startsWith("image/")) {
      newErrors.image_url = "File must be an image.";
    } else if (form.image_url.size > 5 * 1024 * 1024) {
      newErrors.image_url = "Image must be less than 5MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      Swal.fire("Validation Error", "Please correct the highlighted errors.", "warning");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) fd.append(key, val);
    });

    try {
      await axios.post("http://127.0.0.1:8000/api/owner/products", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product created successfully.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate("/owner/products");
      });
    } catch (err) {
      console.error("Error creating product:", err.response?.data || err);
      Swal.fire("Error", "Failed to create product. Try again.", "error");
    }
  };

    if (isLoading) {
    return <Loading fullPage={true} />;
  }

  return (
    <div className="owner-create-product-page">
      <div className="owner-product-form-container">
        <div className="owner-form-header">
          <h2 className="owner-form-title">Create New Product</h2>
          <p className="owner-form-subtitle">Fill in the details to add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className="owner-product-form">
          <div className="owner-form-grid">
       

            <div className="owner-form-group">
              <label className="owner-form-label">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Handmade Leather Wallet"
                maxLength="50"
                required
                className="owner-form-input"
              />
              <div className="owner-input-footer text-right">
                <span className="owner-char-counter">{form.name.length}/50</span>
                {errors.name && <span className="owner-error-message">{errors.name}</span>}
              </div>
            </div>

          
            <div className="owner-form-group owner-image-upload-group">
              <label className="owner-form-label">Product Image</label>
              <div className="owner-image-preview-container">
                
                {form.previewImage ? (
                  <img src={form.previewImage} alt="Preview" className="owner-image-preview" />
                ) : (
                  <button className="owner-image-placeholder" >
                    <i className="fas fa-camera"></i>
                    <span>Product Image</span>
                  </button>
                )}
                <label className="owner-file-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="owner-file-input"
                  />
                </label>
                {errors.image_url && <p className="owner-error-message">{errors.image_url}</p>}
              </div>
            </div>
            <div className="owner-form-row">
              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Category</label>
                <div className="owner-select-wrapper">
                  <i className="fas fa-tag"></i>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    className="owner-form-select"
                    style={{ width: "90%" }}
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

            </div>
             


            <div className="owner-form-row">
              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Price ($)</label>
                <div className="owner-input-with-icon">
                  <i className="fas fa-dollar-sign"></i>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
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
                    value={form.stock_quantity}
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

           <div className="owner-form-row">
              

              <div className="owner-form-group owner-half-width">
                <label className="owner-form-label">Custom Design Requests</label>
                <div className="owner-toggle-switch">
                  <input
                    type="checkbox"
                    id="owner-request-toggle"
                    checked={form.request === "yes"}
                    onChange={() => setForm({
                      ...form,
                      request: form.request === "yes" ? "no" : "yes"
                    })}
                    className="owner-toggle-input"
                  />
                  <label htmlFor="owner-request-toggle" className="owner-toggle-label">
                    <span className="owner-toggle-handle"></span>
                    <span className="owner-toggle-text">
                      {form.request === "yes" ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
                <div className="owner-form-group">
              <label className="owner-form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product in detail"
                maxLength="300"
                className="owner-form-textarea"
                rows="4"
              />
              <div className="owner-input-footer text-right">
                <span className="owner-char-counter">{form.description.length}/300</span>
                {errors.description && <span className="owner-error-message">{errors.description}</span>}
              </div>
            </div>
          </div>

          <div className="owner-form-actions">
            <button type="button" className="owner-cancel-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="owner-submit-button">
              <i className="fas fa-plus-circle"></i> Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateProduct;
