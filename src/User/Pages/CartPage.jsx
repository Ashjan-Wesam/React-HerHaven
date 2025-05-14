import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import Swal from "sweetalert2";
import empty from "../../userTemplate/img/empty-cart.png"
import { div } from "framer-motion/client";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);


  const handleContinueShopping = () => {
    if (cart && cart.cart_products && cart.cart_products.length > 0) {
      const storeId = cart.cart_products[0].product.store_id;
      
      if (storeId) {
        navigate(`/store/${storeId}`);
        return;
      }
    }

    navigate("/"); 
  };

  useEffect(() => {
  fetchCart();
}, []);

useEffect(() => {
  
  if (cart && cart.cart_products && cart.cart_products.length > 0) {
    const storeId = cart.cart_products[0].product.store_id;
    if (storeId) {
      checkStoreDiscount(storeId);
    }
  }
}, [cart]);


  const checkStoreDiscount = async (storeId) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/cart/check-discount/${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.data.active) {
      setDiscount(res.data.discount_percentage);
    } else {
      setDiscount(null);
    }
  } catch (err) {
    console.error("Error fetching discount:", err);
    setDiscount(null);
  }
};


  const fetchCart = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleRemove = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be removed from your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchCart();
        Swal.fire("Removed!", "Product has been removed.", "success");
      } catch (error) {
        console.error("Error removing product:", error);
      }
    }
  };

  const handleQuantityChange = async (item, newQuantity) => {
    const originalQuantity = item.quantity;
    const productId = item.product.id;

    try {
      if (newQuantity > originalQuantity) {
        const diff = newQuantity - originalQuantity;
        await axios.post("http://127.0.0.1:8000/api/cart/add", {
          product_id: productId,
          quantity: diff,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else if (newQuantity < originalQuantity) {
        await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        await axios.post("http://127.0.0.1:8000/api/cart/add", {
          product_id: productId,
          quantity: newQuantity,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear entire cart?",
      text: "This will remove all items!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("http://127.0.0.1:8000/api/cart/clear", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchCart();
        Swal.fire("Cleared!", "Your cart is now empty.", "success");
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  if (!cart) {
    return <div className="loading-spinner"></div>; 
  }

 if (cart.cart_products?.length === 0) {
    return (
        <div className="empty-cart">
            <img src={empty} alt="Empty Cart" className="empty-cart-image" />
            <h2 className="empty-cart-message">Your cart is empty!</h2>
            <p className="empty-cart-instruction">Add something to make me happy</p>
        </div>
    );
}


  const calculateTotal = (price, qty) => (price * qty).toFixed(2);
  const totalPrice = cart.cart_products
  .reduce((sum, item) => sum + item.price * item.quantity, 0);

const finalPrice = discount ? totalPrice * (1 - discount / 100) : totalPrice;


  return (
    <div className="cart-page p-6">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead className="cart-head">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Total</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.cart_products.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={`http://127.0.0.1:8000/${item.product.image_url}`}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover"
                  />
                  <p className="font-medium">{item.product.name}</p>
                </td>
                <td className="p-4">JOD {item.price}</td>
                <td className="p-4">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(item, parseInt(e.target.value))
                    }
                  />
                </td>
                <td className="p-4">JOD {calculateTotal(item.price, item.quantity)}</td>
                <td className="p-4">
                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemove(item.product.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-actions">
        <button className="continue-btn" onClick={handleContinueShopping}>
          Continue shopping
        </button>

        <div className="clear-update">
          <button onClick={handleClearCart} className="clear-btn">
            Clear cart
          </button>
        </div>
      </div>

      <div className="checkout-section">
        <h3>Order Summary</h3>
        <p className="discount-text">
          Total Items:{" "}
          {cart.cart_products.reduce((sum, item) => sum + item.quantity, 0)}
        </p>
      <p className="discount-text">Total Price: JOD {totalPrice.toFixed(2)}</p>
{discount && (
  <div>

    <div className="discount-texts-div">
      <p className="discount-text">
          Discount Applied:
      </p>
      <span>{discount}%</span>
      </div>

   <div className="discount-texts-div">
      <p className="discount-text">
         Total Price after discount:
      </p>
      <span> JOD {finalPrice.toFixed(2)}</span>
  </div>

  </div>
)}

        <button
          className="checkout-btn"
          onClick={() => navigate("/customer/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
