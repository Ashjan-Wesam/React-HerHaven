import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DiscountForm = ({ discountId, onSuccess }) => {
  const token = localStorage.getItem('token');

  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    store_id: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/stores', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStores(res.data);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to load stores.', 'error');
      }
    };

    fetchStores();
  }, [token]);

  useEffect(() => {
    if (discountId) {
      const fetchDiscount = async () => {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/api/admin/discounts/${discountId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const d = res.data;
          setFormData({
            store_id: d.store_id || '',
            discount_percentage: d.discount_percentage || '',
            start_date: d.start_date ? d.start_date.slice(0, 10) : '',
            end_date: d.end_date ? d.end_date.slice(0, 10) : '',
            description: d.description || '',
          });
          setLoading(false);
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Failed to load discount data.', 'error');
          setLoading(false);
        }
      };
      fetchDiscount();
    } else {
      setLoading(false);
    }
  }, [discountId, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { store_id, discount_percentage, start_date, end_date } = formData;

    if (!store_id) {
      Swal.fire('Validation Error', 'Please select a store.', 'warning');
      return false;
    }

    if (!discount_percentage) {
      Swal.fire('Validation Error', 'Please enter a discount percentage.', 'warning');
      return false;
    }

    const percentage = parseFloat(discount_percentage);
    if (isNaN(percentage) || percentage < 1 || percentage > 100) {
      Swal.fire('Validation Error', 'Discount must be a number between 1 and 100.', 'warning');
      return false;
    }

    if (!start_date) {
      Swal.fire('Validation Error', 'Please select a start date.', 'warning');
      return false;
    }

    if (!end_date) {
      Swal.fire('Validation Error', 'Please select an end date.', 'warning');
      return false;
    }

    if (new Date(end_date) < new Date(start_date)) {
      Swal.fire('Validation Error', 'End date must be after start date.', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (discountId) {
        await axios.put(`http://127.0.0.1:8000/api/admin/discounts/${discountId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Discount updated successfully!', 'success');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/discounts', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Discount added successfully!', 'success');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to save discount.', 'error');
    }
  };

  if (loading) return <loading />;

  return (
    <form onSubmit={handleSubmit} className="admin-discount-form">
      <div className="admin-form-group">
        <label>Store</label>
        <select name="store_id" value={formData.store_id} onChange={handleChange} required>
          <option value="">Select Store</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.store_name || store.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-form-group">
        <label>Discount Percentage (%)</label>
        <input
          type="number"
          name="discount_percentage"
          value={formData.discount_percentage}
          onChange={handleChange}
          min="1"
          max="100"
          required
        />
      </div>

      <div className="admin-form-group">
        <label>Start Date</label>
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
      </div>

      <div className="admin-form-group">
        <label>End Date</label>
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
      </div>

      <div className="admin-form-group">
        <label>Description (optional)</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <button type="submit" className="admin-btn-submit">
        {discountId ? 'Update Discount' : 'Add Discount'}
      </button>
    </form>
  );
};

export default DiscountForm;
