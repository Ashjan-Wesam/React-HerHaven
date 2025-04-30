import { useNavigate } from "react-router-dom";
import "./AboutSection.css";
import about from "../../userTemplate/img/about.jpg";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section className="about-section">
      <div className="decor-circle"></div>
      <div className="about-con">
        <div className="about-text">
          <h2 className="fade-in-up">Who We Are</h2>
          <p className="fade-in-up">
          "Our platform is more than a store — it's a celebration of women-led projects and dreams. Join us in supporting passionate women entrepreneurs and discover unique creations that make a difference."


          </p>
          <button className="about-btn fade-in-up" onClick={() => navigate("/about")}>
            Explore Our Story
          </button>
        </div>
        <div className="about-image fade-in-up">
          <img src={about} alt="About Us" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
