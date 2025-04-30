import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://127.0.0.1:8000/api/owner/discounts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDiscounts(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this discount?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(`http://127.0.0.1:8000/api/owner/discounts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDiscounts();
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div className="p-4">
      <h2>Discounts</h2>
      <Link to="/owner/discounts/create" className="btn">+ Add Discount</Link>
      <table>
        <thead>
          <tr>
            <th>%</th><th>Start</th><th>End</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map(d => (
            <tr key={d.id}>
              <td>{d.discount_percentage}%</td>
              <td>{d.start_date}</td>
              <td>{d.end_date}</td>
              <td>{d.description}</td>
              <td>
                <Link to={`/owner/discounts/edit/${d.id}`}>Edit</Link>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountsPage;
