import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../../assets/css/ownerStyles/editProfile.css";

const StoreSetting = () => {
  const [store, setStore] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [storeLogo, setStoreLogo] = useState(null);
  const [form, setForm] = useState({
    store_name: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    store_name: "",
    description: "",
    logo: "",
  });

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/owner/stores-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStore(response.data);
      setForm({
        store_name: response.data.store_name || "",
        description: response.data.description || "",
      });
    } catch (error) {
      console.error("Failed to fetch store:", error);
    }
  };

  // ✅ Use useEffect to fetch data on page load
  useEffect(() => {
    fetchStore();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file && !allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        logo: "Only JPG, JPEG, or PNG files are allowed.",
      }));
      setStoreLogo(null);
    } else {
      setErrors((prev) => ({ ...prev, logo: "" }));
      setStoreLogo(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!form.store_name) {
      errors.store_name = "Store name is required.";
      valid = false;
    }

    if (!form.description) {
      errors.description = "Description is required.";
      valid = false;
    }

    if (storeLogo) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(storeLogo.type)) {
        errors.logo = "Only JPG, JPEG, or PNG files are allowed.";
        valid = false;
      }
    }

    setErrors(errors);
    return valid;
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("store_name", form.store_name);
      formData.append("description", form.description);
      if (storeLogo) {
        formData.append("logo", storeLogo);
      }

      await axios.post(
        `http://127.0.0.1:8000/api/owner/stores/${store.id}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Store information updated successfully!", "", "success");
      setEditMode(false);
      fetchStore();
    } catch (error) {
      Swal.fire("Failed to update store", "", "error");
      console.error("Store update error:", error);
    }
  };

  if (!store) return <div>Loading...</div>;

  return (
    <div className="store-setting-container">
      {!editMode ? (
        <div className="store-setting-view">
          <h2 className="store-setting-title">{store.store_name}</h2>
          <p className="store-setting-description">{store.description}</p>
          <img
            src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`}
            alt="Store Logo"
            className="store-setting-logo"
          />
          <span>{store.logo_url}</span>

          <h3 className="store-setting-subtitle">Categories:</h3>
          <ul className="store-setting-category-list">
            {store.categories.map((cat) => (
              <li key={cat.id} className="store-setting-category">{cat.name}</li>
            ))}
          </ul>

          <button className="store-setting-button" onClick={() => setEditMode(true)}>Edit Information</button>
        </div>
      ) : (
        <form onSubmit={handleUpdateStore} className="store-setting-form">
          <div className="store-setting-form-group">
            <label>Store Name:</label>
            <input
              type="text"
              name="store_name"
              value={form.store_name}
              onChange={handleChange}
            />
            {errors.store_name && <p className="error">{errors.store_name}</p>}
          </div>
          <div className="store-setting-form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>
          <div className="store-setting-form-group">
            <label>Current Logo:</label>
            <img
              src={`http://127.0.0.1:8000/storage/logo/${store.logo_url}`}
              alt="Current Store Logo"
              className="store-setting-logo-preview"
              width="100"
            />
          </div>
          <div className="store-setting-form-group">
            <label>Upload New Logo:</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
            {errors.logo && <p className="error">{errors.logo}</p>}
          </div>
          <div className="store-setting-button-group">
            <button type="submit" className="store-setting-button save">Save</button>
            <button type="button" className="store-setting-button cancel" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StoreSetting;
