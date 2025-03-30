import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: "",
        rating: "",
        image: "",
    });

    const navigate = useNavigate();

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.category && newProduct.price && newProduct.rating) {
            alert("Product added successfully!");
            navigate("/products"); 
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            <div className="add-product-form">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Rating"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                <button className="confirm-add-btn" onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>
        </div>
    );
};

export default AddProduct;
