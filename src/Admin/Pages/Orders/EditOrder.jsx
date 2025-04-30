import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditOrder = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/admin/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(res => {
      setStatus(res.data.status);
      setLoading(false);
    }).catch(err => console.error(err));
  }, [id]);

  const handleUpdate = async () => {
    try {
        
        await axios.put(`http://127.0.0.1:8000/api/admin/orders/${id}`, { status: `${status}` }, {

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/admin/orders");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-order-container">
      <h2>Edit Order #{id}</h2>

      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button onClick={handleUpdate}>Save</button>
    </div>
  );
};

export default EditOrder;
