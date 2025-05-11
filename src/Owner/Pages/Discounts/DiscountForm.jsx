import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DiscountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    discount_percentage: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/owner/discounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      setForm({
        discount_percentage: data.discount_percentage || "",
        start_date: data.start_date ? data.start_date.slice(0, 10) : "",
        end_date: data.end_date ? data.end_date.slice(0, 10) : "",
        description: data.description || "",
      });
    } catch (err) {
      console.error("Error fetching discount:", err);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.discount_percentage) {
      newErrors.discount_percentage = "Discount is required";
    } else if (form.discount_percentage <= 0 || form.discount_percentage > 100) {
      newErrors.discount_percentage = "Discount must be between 1 and 100";
    }

    if (!form.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!form.end_date) {
      newErrors.end_date = "End date is required";
    } else if (form.start_date && form.end_date < form.start_date) {
      newErrors.end_date = "End date must be after start date";
    }

    if (!form.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const url = id
      ? `http://127.0.0.1:8000/api/owner/discounts/${id}`
      : `http://127.0.0.1:8000/api/owner/discounts`;

    const method = id ? "put" : "post";

    if (id) {
      // تأكيد قبل التعديل
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to update this discount.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await sendRequest(url, method);
        }
      });
    } else {
      await sendRequest(url, method);
    }
  };

  const sendRequest = async (url, method) => {
    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Success!",
        text: id ? "Discount updated successfully." : "Discount created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/owner/discounts");
      });
    } catch (err) {
      console.error("Error saving discount:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="discount-form">
      <h2>{id ? "Edit" : "Add"} Discount</h2>

      <div className="form-group">
        <label>Discount Percentage</label>
        <input
          name="discount_percentage"
          type="number"
          placeholder="%"
          value={form.discount_percentage}
          onChange={handleChange}
        />
        {errors.discount_percentage && <p className="error">{errors.discount_percentage}</p>}
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <input
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
        />
        {errors.start_date && <p className="error">{errors.start_date}</p>}
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          name="end_date"
          type="date"
          value={form.end_date}
          onChange={handleChange}
        />
        {errors.end_date && <p className="error">{errors.end_date}</p>}
      </div>

      <div className="form-group">
        <label>Description</label>
       <textarea
  name="description"
  placeholder="Description"
  value={form.description}
  onChange={handleChange}
  maxLength={200}
/>
<small>{form.description.length}/200 characters</small>

        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <button type="submit">{id ? "Update" : "Create"}</button>
    </form>
  );
};

export default DiscountForm;
