import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

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
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/checkout",
        { payment_method: paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/orders", { state: { success: true } });
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart) return <div className="checkout-loading">Loading your order...</div>;

  const cartTotal = cart.cart_products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <span className="active">Cart</span>
          <span className="active">Details</span>
          <span className="active">Payment</span>
          <span>Complete</span>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.cart_products.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <div className="item-price">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-methods">
            <div 
              className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="radio-container">
                <div className={`radio-btn ${paymentMethod === "cod" ? "checked" : ""}`} />
              </div>
              <div className="payment-details">
                <span className="payment-title">Cash on Delivery</span>
                <span className="payment-desc">Pay when you receive your order</span>
              </div>
            </div>

            <div 
              className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="radio-container">
                <div className={`radio-btn ${paymentMethod === "card" ? "checked" : ""}`} />
              </div>
              <div className="payment-details">
                <span className="payment-title">Credit/Debit Card</span>
                <span className="payment-desc">Secure payment with your card</span>
              </div>
            </div>

            <div 
              className={`payment-option ${paymentMethod === "paypal" ? "active" : ""}`}
              onClick={() => setPaymentMethod("paypal")}
            >
              <div className="radio-container">
                <div className={`radio-btn ${paymentMethod === "paypal" ? "checked" : ""}`} />
              </div>
              <div className="payment-details">
                <span className="payment-title">PayPal</span>
                <span className="payment-desc">Pay with your PayPal account</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="place-order-btn"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;