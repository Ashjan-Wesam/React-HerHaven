import { useEffect, useState } from "react";
import axios from "axios";

const CategoryPage = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/stores'); // Laravel route
        setStores(response.data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <div>
      <div className="page-info-section page-info-big">
        <div className="container">
          <h2>Women Stores</h2>
          <div className="site-breadcrumb">
            <a href="#">Home</a> / <span>Stores</span>
          </div>
          <img src="img/categorie-page-top.png" alt="" className="cata-top-pic" />
        </div>
      </div>

      <div className="page-area categorie-page spad">
        <div className="container">
          <div className="categorie-filter-warp">
            <p>Showing {stores.length} stores</p>
            <div className="cf-right">
              <div className="cf-layouts">
                <a href="#"><img src="img/icons/layout-1.png" alt="" /></a>
                <a className="active" href="#"><img src="img/icons/layout-2.png" alt="" /></a>
              </div>
              <form action="#">
                <select><option>Color</option></select>
                <select><option>Brand</option></select>
                <select><option>Sort by</option></select>
              </form>
            </div>
          </div>

          <div className="row">
            {stores.map((store) => (
              <div className="col-lg-4 col-md-6 mb-4" key={store.id}>
                <div className="store-card" style={{
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#fff'
                }}>
                  {store.logo_url && (
                    <img
                      src={store.logo_url}
                      alt={store.store_name}
                      style={{ maxHeight: "120px", objectFit: "contain", marginBottom: "10px" }}
                    />
                  )}
                  <h5>{store.store_name}</h5>
                  <p>{store.description || "No description provided."}</p>
                  <p style={{ fontSize: '14px', color: '#999' }}>
                    Owner: {store.owner?.full_name || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
