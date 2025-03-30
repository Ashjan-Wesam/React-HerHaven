import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/ownerStyles/products.css";

const ProductsManagement = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Product 1",
            category: "Category A",
            price: "$20",
            rating: 4.5,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Product 2",
            category: "Category B",
            price: "$30",
            rating: 3.8,
            image: "https://via.placeholder.com/150",
        },
    ]);

    const navigate = useNavigate();

    const handleDelete = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === "" || product.category === category)
    );

    return (
        <div className="container">
            <h2>Product Management</h2>
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Category A">Category A</option>
                    <option value="Category B">Category B</option>
                </select>
                <button className="add-product-btn" onClick={() => navigate("/add-product")}>
                    + Add New Product
                </button>
            </div>

            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>Category: {product.category}</p>
                        <p>Price: {product.price}</p>
                        <p>Rating: ⭐ {product.rating}</p>
                        <div className="product-actions">
                            <button
                                className="edit-btn"
                                onClick={() => navigate(`/edit-product/${product.id}`)} // Navigate to Edit page
                            >
                                Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                                Delete
                            </button>
                            <button className="feedback-btn">View Feedback</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsManagement;
