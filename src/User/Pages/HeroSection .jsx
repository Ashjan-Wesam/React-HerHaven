import HeroImg from "../../userTemplate/img/download__7_-removebg-preview.png"
import img from "../../userTemplate/img/bg.jpg"

const HeroSection = () => {
  return (
    <section className="hero-section set-bg" data-setbg={img}>
      <div className="hero-slider owl-carousel">
        <div className="hs-item" style={{ display: "flex", alignItems: "center" }}>
          <div className="hs-left">
            <img src={HeroImg} alt="" />
          </div>
          <div className="hs-right">
            <div className="hs-content">
              <h2 style={{ fontSize: "40px" }}>
                <span>From your home to the business world!</span>
                <br />
                <br /> We are here to support you
              </h2>
              <a href="" className="site-btn">
                JOIN US NOW
              </a>
            </div>
          </div>
        </div>
        <div className="hs-item" style={{ display: "flex", alignItems: "center" }}>
          <div className="hs-left">
            <img src={HeroImg} alt="" />
          </div>
          <div className="hs-right">
            <div className="hs-content">
              <h2 style={{ fontSize: "40px" }}>
                <span>Support Women’s Projects,</span>
                <br />
                <br /> Start Here
              </h2>
              <a href="" className="site-btn">
                SHOP NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
