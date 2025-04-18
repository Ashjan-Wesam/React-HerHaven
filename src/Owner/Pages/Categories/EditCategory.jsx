import { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = () => {
  const { id } = useParams(); // category ID to be replaced
  const [options, setOptions] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] = useState('');
  const [newCategory, setNewCategory] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/owner/categories');
        const formatted = res.data.map(cat => ({
          label: cat.name,
          value: cat.id
        }));
        setOptions(formatted);

        const current = res.data.find(cat => cat.id === parseInt(id));
        setCurrentCategoryName(current?.name || '');

      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const store = JSON.parse(localStorage.getItem("store"));
    const currentStoreId = store?.id;

    if (!currentStoreId || !newCategory) {
      setMessage("Please select a new category.");
      return;
    }

    try {
        await axios.put(`http://127.0.0.1:8000/api/owner/categories/${id}`, {
            store_id: currentStoreId,
            new_category_id: newCategory.value
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`, 
              'Content-Type': 'application/json'
            }
          });
          

      setMessage("Category updated successfully.");
      navigate("/owner/categories");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update category.");
    }
  };

  return (
    <div>
      <h2>Edit Category</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Current Category:</label>
        <input type="text" value={currentCategoryName} disabled className="form-control" />

        <br />
        <label>New Category:</label>
        <Select
          options={options}
          onChange={setNewCategory}
          value={newCategory}
          placeholder="Select new category"
        />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditCategory;
