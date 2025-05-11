import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';  
import '../../../assets/css/ownerStyles/CateoriesPage.css';
import notfound from '../../../assets/img/nofound.jpg';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [message, setMessage] = useState('');
  // const [isError, setIsError] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentStoreId = JSON.parse(localStorage.getItem("store"))?.id;

 const fetchCategories = async () => {
  setIsLoading(true);
  try {
   
    const ownerRes = await axios.get('http://127.0.0.1:8000/api/owner/my-categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setCategories(ownerRes.data); 
    setFilteredCategories(ownerRes.data);

    const allRes = await axios.get('http://127.0.0.1:8000/api/all-categories');
    const formatted = allRes.data.map(cat => {
  const isOwned = ownerRes.data.some(ownerCat => ownerCat.id === cat.id);
  return {
    label: cat.name,
    value: cat.name,
    isDisabled: isOwned // react-select uses "isDisabled"
  };
});

    setOptions(formatted); 

    setIsLoading(false);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : "Failed to fetch categories.";
    setMessage(errorMessage);
    setIsError(true);
    setIsLoading(false);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: errorMessage,
      timer: 9000
    });
  }
};


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
    setCurrentPage(1); 
  }, [searchTerm, categories]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await axios.delete(`http://127.0.0.1:8000/api/owner/categories/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          data: { store_id: currentStoreId }
        });
        
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Category has been deleted successfully.',
          timer: 4000
        });
        
        fetchCategories();
      } catch (error) {
        const errorMessage = error.response ? error.response.data.message : "Failed to delete category.";
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
          timer: 3000
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOptions.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select or create at least one category.',
        timer: 2000
      });
      return;
    }

    const unique = [...new Set(selectedOptions.map(opt => opt.value))];

    if (!currentStoreId) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Store ID not found.',
        timer: 2000
      });
      return;
    }

    try {
      setIsLoading(true);
      await axios.post('http://127.0.0.1:8000/api/owner/categories', {
        categories: unique.map(name => ({ name })),
        store_id: currentStoreId
      });

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Categories added successfully.',
        timer: 2000
      });
      
      setSelectedOptions([]);
      fetchCategories();
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : "Failed to add categories.";
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        timer: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category); 
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (!editingCategory.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Category name cannot be empty.',
        timer: 2000
      });
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(
        `http://127.0.0.1:8000/api/owner/categories/${editingCategory.id}`,
        {
          name: editingCategory.name,
          description: editingCategory.description,
          store_id: currentStoreId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );
      
      
    
      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Category updated successfully.',
        timer: 2000
      });
    
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.message || 'Something went wrong.'
      });
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="categories-container">
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}


      {/* Form for adding new categories */}
      <form onSubmit={handleSubmit} className="category-form">
        <CreatableSelect
          isMulti
          options={options}
          onChange={handleChange}
          value={selectedOptions}
          placeholder="Select or Add new categories..."
          isDisabled={isLoading}
        />
        <button 
          className='addCatOwner' 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Categories'}
        </button>
      </form>

      {/* Search Box */}
      <div className="cat-search-container">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cat-search-input"
        />
        <i className="fas fa-search cat-search-icon"></i>
      </div>
      
      {/* List of categories */}
      <ul className="categories-list">
        {currentCategories.length > 0 ? (
          currentCategories.map(cat => (
            <li key={cat.id} className="category-item">
              <strong className="category-name">{cat.name}</strong>
              <span className="category-description">{cat.description || 'No description'}</span>
             <div className="category-actions">
  <button
    onClick={() => handleEdit(cat)}
    className="edit-category-btn"
    disabled={isLoading}
    title="Edit"
  >
    <i className="fas fa-edit"></i>
  </button>

  <Link
    to={`/owner/categories/show/${cat.id}`}
    className="show-category-btn"
    title="Show"
  >
    <i className="fas fa-eye"></i>
  </Link>

  <button
    onClick={() => handleDelete(cat.id)}
    className="delete-category-btn"
    disabled={isLoading}
    title="Delete"
  >
    <i className="fas fa-trash-alt"></i>
  </button>
</div>

            </li>
          ))
        ) : (
          <li  className="cat-no-products">
             <img
              src={notfound}
              alt="No products"
              className="cat-no-products-img"
            />
            <p>{searchTerm ? 'No categories match your search.' : 'No categories found.'}</p>
            
          </li>
  
          
        )}
      </ul>

      {/* Pagination */}
      {filteredCategories.length > itemsPerPage && (
  <div className="owner-pagination">
    <button
      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
      disabled={currentPage === 1 || isLoading}
      title="Previous"
    >
      <i className="fas fa-chevron-left"></i>
    </button>
    
    <div className='div-nums'>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
          disabled={isLoading}
        >
          {i + 1}
        </button>
      ))}
    </div>
    
    <button
      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
      disabled={currentPage === totalPages || isLoading}
      title="Next"
    >
      <i className="fas fa-chevron-right"></i>
    </button>
  </div>
)}


      {/* Modal for editing category */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Category</h3>
            <form onSubmit={handleUpdateCategory}>
              <label>Category Name</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                disabled={isLoading}
              />
              <label>Description</label>
<textarea
  value={editingCategory.description || ''}
  onChange={(e) =>
    setEditingCategory({ ...editingCategory, description: e.target.value })
  }
/>

              <br />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </button>
              <button 
                type="button" 
                onClick={() => setEditingCategory(null)}
                disabled={isLoading}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;