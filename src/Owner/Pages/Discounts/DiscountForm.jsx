import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DiscountForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    discount_percentage: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/owner/discounts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm(res.data);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id
      ? `http://127.0.0.1:8000/api/owner/discounts/${id}`
      : `http://127.0.0.1:8000/api/owner/discounts`;

    const method = id ? "put" : "post";

    await axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/owner/discounts");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Edit" : "Add"} Discount</h2>
      <input name="discount_percentage" type="number" placeholder="%" value={form.discount_percentage} onChange={handleChange} />
      <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
      <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea>
      <button type="submit">{id ? "Update" : "Create"}</button>
    </form>
  );
};

export default DiscountForm;
