import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CategoryPage.css";
import noStore from "../../userTemplate/img/no-store.jpg"
import heroImage2 from "../../userTemplate/img/download (44).jpg";


const CategoryPage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [storesRes, categoriesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/stores"),
          axios.get("http://127.0.0.1:8000/api/all-categories"),
        ]);
        setStores(storesRes.data);
        setFilteredStores(storesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = stores;

    if (selectedCategory) {
      results = results.filter((store) =>
        store.categories?.some(
          (category) => category.id === parseInt(selectedCategory)
        )
      );
    }

    if (search) {
      results = results.filter((store) =>
        store.store_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredStores(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, selectedCategory, stores]);

  // Pagination logic
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  if (isLoading) {
    return (
      <div className="category-page-header">
        <div className="container text-center">
          <h2>Loading Stores...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Header Section */}
      <div className="category-page-header">
        <div className="container text-center store-div">
          <h2>Women Stores</h2>
          <div className="site-breadcrumb">
            <Link to="/">Home</Link> / <span>Stores</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="search-filter-cat">
          <input
            type="text"
            className="search-input"
            placeholder="Search by store name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="stores-count">
          Showing {filteredStores.length} {filteredStores.length === 1 ? "store" : "stores"}
        </div>
      </div>

      {/* Store Cards */}
      <div className="stores-container">
        {currentStores.length > 0 ? (
          <div className="stores-grid">
            {currentStores.map((store) => (
              <Link to={`/store/${store.id}`} key={store.id} className="store-link">
                <div className="store-card">
                  {store.logo_url && (
                  <img
                  src={store.logo_url ? `http://127.0.0.1:8000/storage/logo/${store.logo_url}` : noStore}
                  alt={store.store_name}
                  className="store-logo"
                />
                
                  )}
                  <h5 className="store-name-cat">{store.store_name}</h5>
                  <p className="store-description-cat" style={{ color: "#444" }}>
                    {store.description?.slice(0, 100) || "No description provided."}
                    {store.description?.length > 100 && "..."}
                  </p>
                  <p className="store-owner">
                    Owner: {store.owner?.full_name || "Unknown"}
                  </p>
                  <button className="btn btn-primary">View Store</button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-stores">
            <p>No stores found matching your criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
              }}
              className="btn btn-outline-secondary mt-3"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="owner-pagination">
           <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
                    <div className='div-nums'>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
             <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
