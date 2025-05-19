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
  const [activeDiscount, setActiveDiscount] = useState(null);

  const fetchData = async () => {
    try {
      if (id) {
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
      }

      // جلب جميع الخصومات الحالية ما عدا الحالي (للفحص)
      const discountsRes = await axios.get("http://127.0.0.1:8000/api/owner/discounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ابحث عن أي خصم يتداخل مع التواريخ المدخلة (للفحص الديناميكي)
      // فقط بعد تحميل البيانات، لأنه لو الفورم جديد لا يوجد تداخل
      const today = new Date().toISOString().slice(0, 10);

      // فقط خصومات متداخلة مع تاريخ البداية أو النهاية الحالي (مستقبلية أو حالية)
      // أو خصم يشمل الفترة كلها (داخل الفترة)
      const active = discountsRes.data.find((d) => {
        if (id && d.id === Number(id)) return false; // استثناء الخصم الجاري تحريره
        return (
          (form.start_date && form.end_date) &&
          (
            (form.start_date >= d.start_date && form.start_date <= d.end_date) ||
            (form.end_date >= d.start_date && form.end_date <= d.end_date) ||
            (form.start_date <= d.start_date && form.end_date >= d.end_date)
          )
        );
      });

      if (active) {
        setActiveDiscount(active);
      } else {
        setActiveDiscount(null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, form.start_date, form.end_date]); // تابع تغيرات التواريخ وid

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

    // تحقق من عدم تداخل تواريخ الخصم مع خصم أكتيف آخر (خلاف الخصم الجاري)
    if (activeDiscount) {
      newErrors.start_date = `You already have an active discount from ${activeDiscount.start_date} to ${activeDiscount.end_date}. Dates cannot overlap.`;
      newErrors.end_date = newErrors.start_date;
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
      const payload = {
        ...form,
        start_date: form.start_date ? form.start_date + " 00:00:00" : null,
        end_date: form.end_date ? form.end_date + " 23:59:59" : null,
      };

      await axios[method](url, payload, {
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
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to save discount.",
        icon: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="discount-form">
      <h2>{id ? "Edit" : "Add"} Discount</h2>

      {activeDiscount && !id && (
        <div className="alert" style={{ color: "orange", marginBottom: "1rem" }}>
          ⚠️ Active discount exists from <strong>{activeDiscount.start_date}</strong> to{" "}
          <strong>{activeDiscount.end_date}</strong>. You can't add a new one until it ends.
        </div>
      )}

      <div className="form-group">
        <label>Discount Percentage</label>
        <input
          name="discount_percentage"
          type="number"
          placeholder="%"
          value={form.discount_percentage}
          onChange={handleChange}
          min="1"
          max="100"
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

      <button type="submit" disabled={activeDiscount && !id}>
        {id ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default DiscountForm;
