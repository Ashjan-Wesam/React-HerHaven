import Header from "../Components/Header";
import cartImg from "../../userTemplate/img/product/cart.jpg"
import cartImg2 from "../../userTemplate/img/page-info-art.png"

const CartPage = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Page Info */}
      <div className="page-info-section page-info">
        <div className="container">
          <div className="site-breadcrumb">
            <a href="/">Home</a> / <a href="#">Sales</a> / <a href="#">Bags</a> /
            <span>Cart</span>
          </div>
          <img src={cartImg2} alt="" className="page-info-art" />
        </div>
      </div>

      {/* Cart Page */}
      <div className="page-area cart-page spad">
        <div className="container">
          <div className="cart-table">
            <table>
              <thead>
                <tr>
                  <th className="product-th">Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th className="total-th">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="product-col">
                    <img src={cartImg} alt="Product" />
                    <div className="pc-title">
                      <h4>Black Shoulder Bag</h4>
                      <a href="#">Edit Product</a>
                    </div>
                  </td>
                  <td className="price-col">$59.90</td>
                  <td className="quy-col">
                    <div className="quy-input">
                      <span>Qty</span>
                      <input type="number" defaultValue="1" />
                    </div>
                  </td>
                  <td className="total-col">$59.90</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row cart-buttons">
            <div className="col-lg-5 col-md-5">
              <div className="site-btn btn-continue">Continue Shopping</div>
            </div>
            <div className="col-lg-7 col-md-7 text-lg-right text-left">
              <div className="site-btn btn-clear">Clear Cart</div>
              <div className="site-btn btn-line btn-update">Update Cart</div>
            </div>
          </div>
        </div>

        {/* Shipping & Checkout */}
        <div className="card-warp">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="shipping-info">
                  <h4>Shipping Method</h4>
                  <p>Select the one you want</p>
                  <div className="shipping-chooes">
                    <div className="sc-item">
                      <input type="radio" name="sc" id="one" />
                      <label htmlFor="one">Next day delivery<span>$4.99</span></label>
                    </div>
                    <div className="sc-item">
                      <input type="radio" name="sc" id="two" />
                      <label htmlFor="two">Standard delivery<span>$1.99</span></label>
                    </div>
                    <div className="sc-item">
                      <input type="radio" name="sc" id="three" />
                      <label htmlFor="three">Personal Pickup<span>Free</span></label>
                    </div>
                  </div>
                  <h4>Coupon Code</h4>
                  <p>Enter your coupon code</p>
                  <div className="cupon-input">
                    <input type="text" />
                    <button className="site-btn">Apply</button>
                  </div>
                </div>
              </div>
              <div className="offset-lg-2 col-lg-6">
                <div className="cart-total-details">
                  <h4>Cart Total</h4>
                  <p>Final Info</p>
                  <ul className="cart-total-card">
                    <li>Subtotal<span>$59.90</span></li>
                    <li>Shipping<span>Free</span></li>
                    <li className="total">Total<span>$59.90</span></li>
                  </ul>
                  <a className="site-btn btn-full" href="/checkout">Proceed to Checkout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* End of Cart Page */}
    </div>
  );
};

export default CartPage;
