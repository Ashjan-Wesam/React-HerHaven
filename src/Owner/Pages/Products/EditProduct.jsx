import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../assets/css/ownerStyles/products.css";

const EditProduct = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        rating: "",
        image: "",
    });

    useEffect(() => {
        const productData = {
            id: id,
            name: `Product ${id}`,
            category: "Category A",
            price: "$20",
            rating: 4.5,
            image: "https://via.placeholder.com/150",
        };
        setProduct(productData);
    }, [id]);

    const handleEditProduct = () => {
        alert("Product updated successfully!");
        navigate("/products"); 
    };

    return (
        <div className="container">
            <h2>Edit Product</h2>
            <div className="add-product-form">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Price"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Rating"
                    value={product.rating}
                    onChange={(e) => setProduct({ ...product, rating: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={product.image}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                />
                <button className="confirm-add-btn" onClick={handleEditProduct}>
                    Update Product
                </button>
            </div>
        </div>
    );
};

export default EditProduct;
