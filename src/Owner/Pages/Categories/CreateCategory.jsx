import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/owner/categories');

        const formatted = res.data.map(cat => ({
          label: cat.name,
          value: cat.name
        }));

        setOptions(formatted);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const unique = [...new Set(selectedOptions.map(opt => opt.value))];
  
    const store = JSON.parse(localStorage.getItem("store"));
    const currentStoreId = store?.id; 
  
    if (!currentStoreId) {
      setMessage("Store ID not found.");
      return;
    }
  
    try {
      await axios.post('http://127.0.0.1:8000/api/owner/categories', {
        categories: unique.map(name => ({ name })),
        store_id: currentStoreId
      });
  
      setMessage("Categories added successfully.");
      navigate("/owner/categories");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add categories.");
    }
  };
  
  

  return (
    <div>
      <h2>Add or Select Categories</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <CreatableSelect
          isMulti
          options={options}
          onChange={handleChange}
          value={selectedOptions}
          placeholder="Select or create categories..."
        />
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default CreateCategory;
