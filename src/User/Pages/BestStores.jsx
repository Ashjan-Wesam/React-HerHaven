
const stores = [
  { id: 1, name: "Store 1", category: "Category 1", img: "/img/intro/1.jpg" },
  { id: 2, name: "Store 2", category: "Category 2", img: "/img/intro/2.jpg" },
  { id: 3, name: "Store 3", category: "Category 3", img: "/img/intro/3.jpg", badge: "NEW" },
  { id: 4, name: "Store 4", category: "Category 4", img: "/img/intro/4.jpg" },
  { id: 5, name: "Store 5", category: "Category 5", img: "/img/intro/5.jpg" },
];

const BestStores = () => {
  return (
    <section className="intro-section spad pb-0">
      <div className="section-title">
        <h2>Best Stores</h2>
        <p>We recommend</p>
      </div>
      <div className="intro-slider">
        <ul className="slidee">
          {stores.map((store) => (
            <li key={store.id}>
              <div className="intro-item">
                <figure>
                  <img src={store.img} alt={store.name} />
                  {store.badge && <div className="bache">{store.badge}</div>}
                </figure>
                <div className="product-info">
                  <h5>{store.name}</h5>
                  <p>{store.category}</p>
                  <a href="#" className="site-btn btn-line">
                    VIEW STORE
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="container">
        <div className="scrollbar">
          <div className="handle">
            <div className="mousearea"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestStores;
