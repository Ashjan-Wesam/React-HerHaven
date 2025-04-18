

const products = [
  { id: 1, name: "Long red Shirt", price: 39.90, image: "img/products/1.jpg" },
  { id: 2, name: "Hype grey shirt", price: 19.50, image: "img/products/2.jpg", badge: "NEW" },
  { id: 3, name: "Long sleeve jacket", price: 59.90, image: "img/products/3.jpg" },
  { id: 4, name: "Denim men shirt", price: 32.20, oldPrice: 64.40, image: "img/products/4.jpg", badge: "SALE" }
];

const ProductList = () => {
  return (
    <div className="row">
      {products.map((product) => (
        <div className="col-lg-3" key={product.id}>
          <div className="product-item">
            <figure>
              <img src={product.image} alt={product.name} />
              {product.badge && <div className="bache">{product.badge}</div>}
              <div className="pi-meta">
                <div className="pi-m-left">
                  <img src="img/icons/eye.png" alt="" />
                  <p>quick view</p>
                </div>
                <div className="pi-m-right">
                  <img src="img/icons/heart.png" alt="" />
                  <p>save</p>
                </div>
              </div>
            </figure>
            <div className="product-info">
              <h6>{product.name}</h6>
              <p>${product.price} {product.oldPrice && <span>RRP ${product.oldPrice}</span>}</p>
              <a href="#" className="site-btn btn-line">ADD TO CART</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
