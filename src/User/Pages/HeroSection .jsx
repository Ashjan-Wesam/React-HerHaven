import HeroImg from "../../userTemplate/img/download__7_-removebg-preview.png"
import BgImg from "../../userTemplate/img/bg.jpg";
import HeroImg2 from "../../userTemplate/img/hero5.png";

import Slider from "react-slick";

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${BgImg})`,
        backgroundSize: "cover",
      }}
    >
      <Slider {...settings}>
      <section className="hs-item" style={{ backgroundColor: "#333", padding: "100px 0" }}>
  <div style={{ display: "flex", alignItems: "center", height: "100vh", justifyContent: "space-between"}}>
    <div>
      <img src={HeroImg} alt="Hero" style={{ maxWidth: "100%", height: "100vh" }} />
    </div>
    <div>
      <h2 style={{ fontSize: "40px", color: "white",  paddingRight: "80px" }}>
        From your home to the business world!<br /><br />
        We're here to support you
      </h2>
      <a href="/register-owner" className="site-btn">JOIN US NOW</a>
    </div>
  </div>
</section>


<section style={{ backgroundColor: "#333", padding: "100px 0" }}>
  <div style={{ display: "flex", alignItems: "center", height: "100vh" ,justifyContent: "space-between"}}>
    <div>
      <img src={HeroImg2} alt="Hero" style={{ maxWidth: "100%", height: "100vh" }} />
    </div>
    <div>
      <h2 style={{ fontSize: "40px", color: "white" , paddingRight: "80px"}}>
      <span>Support Women’s Projects,<br /></span>Start Here
      </h2>
      <a href="/register-customer" className="site-btn">SHOP NOW</a>
    </div>
  </div>
</section>

      </Slider>
    </section>
  );
};

export default HeroSection;
