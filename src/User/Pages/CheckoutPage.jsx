import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Checkout.css";
import Loading from "../../Owner/Components/Loading"

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();

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

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#3498db',
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonColor: '#3498db',
    });
  };

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

      if (response.data.cart?.store_id) {
        checkStoreDiscount(response.data.cart.store_id);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      showErrorAlert("Failed to load your cart. Please try again.");
    }
  };

  const handlePaymentSubmit = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      showErrorAlert("Please fill in all payment details.");
      return;
    }
    setShowPaymentForm(false);
  };

  const confirmCheckout = async () => {
    const result = await Swal.fire({
      title: 'Confirm Your Order',
      html: `
        <p>Total Amount: <strong>JOD ${
          discount ? totalAfterDiscount.toFixed(2) : cartTotal.toFixed(2)
        }</strong></p>
        <p>Payment Method: <strong>${
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : paymentMethod === "card"
            ? "Credit/Debit Card"
            : "PayPal"
        }</strong></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3498db',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Yes, place order!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await proceedToCheckout();
    }
  };

  const proceedToCheckout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/checkout",
        {
          payment_method: paymentMethod,
          card_number: paymentMethod !== "cod" ? cardNumber : null,
          card_holder: paymentMethod !== "cod" ? cardHolder : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      await Swal.fire({
        title: 'Order Placed!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonColor: '#3498db',
      });
      
      navigate("/customer/my-orders", { state: { success: true } });
    } catch (error) {
      console.error("Checkout failed:", error);
      showErrorAlert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod !== "cod") {
      if (!cardNumber || !cardHolder) {
        setShowPaymentForm(true);
        return;
      }
      confirmCheckout();
    } else {
      confirmCheckout();
    }
  };

  if (!cart) return <div className="checkout-loading"><Loading /></div>;

  const cartTotal = cart.cart_products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = discount ? (cartTotal * discount) / 100 : 0;
  const totalAfterDiscount = cartTotal - discountAmount;

  return (
    <div className="checkout-container">
      {showPaymentForm && (
        <div className="popup-overlay">
          <div className="payment-popup">
            <h3>Payment Details</h3>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="payment-input"
              />
            </div>
            <div className="form-group">
              <label>Card Holder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="payment-input"
              />
            </div>
            <div className="card-input-group">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="payment-input"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="payment-input"
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                className="cancel-btn place-order-btn"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancel
              </button>
              <button
                className="place-order-btn"
                onClick={handlePaymentSubmit}
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="checkout-header">
        <h1>Checkout</h1>
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
              <span>JOD {cartTotal.toFixed(2)}</span>
            </div>
            {discount && (
              <div className="total-row">
                <span>Discount ({discount}%)</span>
                <span>-JOD{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>
                {discount ? (
                  <>
                    <s>${cartTotal.toFixed(2)}</s>{" "}
                    <strong>${totalAfterDiscount.toFixed(2)}</strong>
                  </>
                ) : (
                  `JOD ${cartTotal.toFixed(2)}`
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-methods">
            {["cod", "card", "paypal"].map((method) => (
              <div
                key={method}
                className={`payment-option ${
                  paymentMethod === method ? "active" : ""
                }`}
                onClick={() => setPaymentMethod(method)}
              >
                <div className="radio-container">
                  <div
                    className={`radio-btn ${
                      paymentMethod === method ? "checked" : ""
                    }`}
                  />
                </div>
                <div className="payment-details">
                  <span className="payment-title">
                    {method === "cod"
                      ? "Cash on Delivery"
                      : method === "card"
                      ? "Credit/Debit Card"
                      : "PayPal"}
                  </span>
                  <span className="payment-desc">
                    {method === "cod"
                      ? "Pay when you receive your order"
                      : method === "card"
                      ? "Secure payment with your card"
                      : "Pay with your PayPal account"}
                  </span>
                </div>
              </div>
            ))}
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