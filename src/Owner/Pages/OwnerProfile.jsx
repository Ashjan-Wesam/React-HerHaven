import { useState, useEffect } from "react";
import axios from "axios";

const OwnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setForm({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://127.0.0.1:8000/api/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditMode(false);
      fetchProfile(); // جلب البيانات بعد التعديل
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>My Profile</h2>
      {editMode ? (
        <form onSubmit={handleUpdate} className="profile-form">
          <label>Name:
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>Email:
            <input name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>Phone:
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default OwnerProfile;
