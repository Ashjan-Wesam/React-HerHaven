import Header from "./Header";
import ProductList from "./ProductList";
import Pagination from "./Pagination";

const CategoryPage = () => {
  return (
    <div>
      <Header />
      <div className="page-info-section page-info-big">
        <div className="container">
          <h2>Dresses</h2>
          <div className="site-breadcrumb">
            <a href="#">Home</a> / <span>Dresses</span>
          </div>
          <img src="img/categorie-page-top.png" alt="" className="cata-top-pic" />
        </div>
      </div>

      <div className="page-area categorie-page spad">
        <div className="container">
          <div className="categorie-filter-warp">
            <p>Showing 12 results</p>
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

          <ProductList />
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
