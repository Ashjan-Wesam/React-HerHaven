import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    request: "no", // هل يقبل طلب تصميم؟
    image_url: null, // ملف الصورة
  });

  const [categories, setCategories] = useState([]);

  // جلب التصنيفات
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
      }
    };
    fetchCategories();
  }, [token]);

  // تغيّر الحقول النصيّة
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // رفع الصورة
  const handleFileChange = (e) =>
    setForm({ ...form, image_url: e.target.files[0] });

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    // نبني FormData لإرسال ملف الصورة
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
      navigate("/owner/products");
    } catch (err) {
      console.error("Error creating product:", err.response?.data || err);
    }
  };

  // JSX
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* الاسم */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          required
        />

        {/* الوصف */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        {/* السعر */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded"
          min="0"
          step="0.01"
          required
        />

        {/* الكمية */}
        <input
          type="number"
          name="stock_quantity"
          value={form.stock_quantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full border p-2 rounded"
          min="0"
          required
        />

        {/* التصنيف */}
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* هل يقبل طلب تصميم؟ */}
        <label className="block text-sm font-medium">
          Accept design request?
          <select
            name="request"
            value={form.request}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        {/* رفع صورة المنتج */}
        <label className="block text-sm font-medium">
          Product Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
