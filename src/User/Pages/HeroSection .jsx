import HeroImg from "../../userTemplate/img/download__7_-removebg-preview.png"
import BgImg from "../../userTemplate/img/bg.jpg";

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
        backgroundPosition: "center",
      }}
    >
      <Slider {...settings}>
      <section style={{ backgroundColor: "#333", padding: "100px 0" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div>
      <img src={HeroImg} alt="Hero" style={{ maxWidth: "400px" }} />
    </div>
    <div>
      <h2 style={{ fontSize: "40px", color: "white" }}>
        From your home to the business world!<br /><br />
        We're here to support you
      </h2>
    </div>
  </div>
</section>


<section style={{ backgroundColor: "#333", padding: "100px 0" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div>
      <img src={HeroImg} alt="Hero" style={{ maxWidth: "400px" }} />
    </div>
    <div>
      <h2 style={{ fontSize: "40px", color: "white" }}>
        From your home to the business world!<br /><br />
        We're here to support you
      </h2>
    </div>
  </div>
</section>

      </Slider>
    </section>
  );
};

export default HeroSection;
