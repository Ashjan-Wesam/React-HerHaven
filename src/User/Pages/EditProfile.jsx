import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './editProfile.css';
import Loading from "../../Owner/Components/Loading";

const EditProfile = () => {
 const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    shipping_address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    shipping_address: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setForm({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        phone_number: response.data.phone_number || "",
        shipping_address: response.data.shipping_address || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!form.full_name) {
      errors.full_name = "Full name is required.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address.";
      valid = false;
    }

    const phoneRegex = /^(078|077|079)[0-9]{7}$/;
    if (!form.phone_number || !phoneRegex.test(form.phone_number)) {
      errors.phone_number = "Phone number must start with 078, 077, or 079 and be 10 digits long.";
      valid = false;
    }

    if (!form.shipping_address) {
      errors.shipping_address = "Shipping address is required.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validatePasswordForm = () => {
    const errors = {};
    let valid = true;

    if (!passwordForm.current_password) {
      errors.current_password = "Current password is required.";
      valid = false;
    }

    if (!passwordForm.new_password) {
      errors.new_password = "New password is required.";
      valid = false;
    } else if (passwordForm.new_password.length < 8) {
      errors.new_password = "Password must be at least 8 characters.";
      valid = false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
    if (!passwordRegex.test(passwordForm.new_password)) {
      errors.new_password = "Password must contain at least one uppercase letter and one special character.";
      valid = false;
    }

    if (!passwordForm.new_password_confirmation) {
      errors.new_password_confirmation = "Password confirmation is required.";
      valid = false;
    } else if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      errors.new_password_confirmation = "Passwords do not match.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone_number", form.phone_number);
      formData.append("shipping_address", form.shipping_address);
      if (profileImage) {
        formData.append("profile_picture", profileImage);
      }

      await axios.post("http://127.0.0.1:8000/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Profile updated successfully!", "", "success");
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      Swal.fire("Failed to update profile", "", "error");
      console.error("Failed to update profile", error);
    }
  };

 const handleChangePassword = async (e) => {
  e.preventDefault();
  if (!validatePasswordForm()) return;

  try {
    const token = localStorage.getItem("token");

    const verifyResponse = await axios.post(
      "http://127.0.0.1:8000/api/profile/verify-password", 
      { current_password: passwordForm.current_password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!verifyResponse.data.success) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        current_password: "كلمة المرور الحالية غير صحيحة.",
      }));
      return;
    }
    await axios.post(
      "http://127.0.0.1:8000/api/profile/change-password",
      passwordForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire("تم تحديث كلمة المرور بنجاح!", "", "success");
    setChangePasswordMode(false);
    setPasswordForm({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setErrors({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
  } catch (error) {
    Swal.fire("فشل في تحديث كلمة المرور", "", "error");
    console.error("Failed to update password", error);
  }
};

  if (!profile) return <Loading />;

  return (
    <div className="owner-profile">
      <h2>My Profile</h2>

      {editMode ? (
        <form onSubmit={handleUpdateProfile} className="profile-form">
          {profile.profile_picture && (
            <div className="image-preview">
              <img
                src={`http://127.0.0.1:8000/storage/profile/${profile.profile_picture}`}
                alt="Current Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "1rem",
                }}
              />
              <p>Current Profile Picture</p>
            </div>
          )}

          <label>
            Change Profile Picture:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          <label>
            Name:
            <input name="full_name" value={form.full_name} onChange={handleChange} />
            {errors.full_name && <p className="error">{errors.full_name}</p>}
          </label>

          <label>
            Email:
            <input name="email" value={form.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </label>

          <label>
            Phone:
            <input name="phone_number" value={form.phone_number} onChange={handleChange} />
            {errors.phone_number && <p className="error">{errors.phone_number}</p>}
          </label>

          <label>
            Shipping Address:
            <input name="shipping_address" value={form.shipping_address} onChange={handleChange} />
            {errors.shipping_address && <p className="error">{errors.shipping_address}</p>}
          </label>

          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "Your changes will be discarded.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, cancel",
                cancelButtonText: "No, stay",
              }).then((result) => {
                if (result.isConfirmed) {
                  setEditMode(false);
                }
              });
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="profile-details">
          {profile.profile_picture && (
            <img
              src={`http://127.0.0.1:8000/storage/profile/${profile.profile_picture}`}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
              }}
            />
          )}
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone_number}</p>
          <p><strong>Address:</strong> {profile.shipping_address}</p>
          <p><strong>Joined At:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>

          <button onClick={() => setEditMode(true)}>Edit Profile</button>
          <button onClick={() => setChangePasswordMode(true)}>Change Password</button>
        </div>
      )}

      {changePasswordMode && (
        <form onSubmit={handleChangePassword} className="password-form">
          <h3>Change Password</h3>

          <label>
            Current Password:
            <input
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
            />
            {errors.current_password && <p className="error">{errors.current_password}</p>}
          </label>

          <label>
            New Password:
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
            />
            {errors.new_password && <p className="error">{errors.new_password}</p>}
          </label>

          <label>
            Confirm New Password:
            <input
              type="password"
              name="new_password_confirmation"
              value={passwordForm.new_password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
            />
            {errors.new_password_confirmation && <p className="error">{errors.new_password_confirmation}</p>}
          </label>

          <button type="submit">Change Password</button>
          <button
            type="button"
            onClick={() => setChangePasswordMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
