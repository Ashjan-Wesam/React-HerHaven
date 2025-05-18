import './About.css';
import { useNavigate } from "react-router-dom";
import heroImage from "../../userTemplate/img/download (44).jpg";
import teamImage from "../../userTemplate/img/about2.jpg";
import founder1 from "../../userTemplate/img/hero5.png";
import founder2 from "../../userTemplate/img/hero5.png";
import founder3 from "../../userTemplate/img/hero5.png";
import { FaHandsHelping, FaLightbulb, FaStar } from 'react-icons/fa';


const About = () => {
   const navigate = useNavigate();
  return (
    <div className="">
      {/* Hero Section */}
      <section className="hero-sectionAbout">
        <div className="hero-content">
          <h1>Empowering Women, Changing the World</h1>
          <p className="hero-subtitle">Her Haven is the place where women's dreams come true</p>
         
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Women Entrepreneurs" />
        </div>
      </section>

      {/* Mission Section */}
    <section className="mission-section">
  <div className="section-header">
    <h2 className="text-2xl font-bold mb-6 page-user-title" style={{ color: "#444" }}>Our Mission</h2>
    <p className="" style={{ color:"#444" }}>
      Creating a world where every woman has the resources, support, and platform to realize her vision
    </p>
  </div>
  <div className="mission-cards">
   
    <div className="mission-card">
      <div style={{ fontSize: '5.5rem', color: '#fbbf24' }}>
        <FaLightbulb />
      </div>
      <h3>Support That Uplifts</h3>
      <p>A safe, inclusive space where her voice is heard and valued.</p>
    </div>
     <div className="mission-card">
      <div  style={{ fontSize: '5.5rem', color: 'rgb(170,122,208)' }}>
        <FaHandsHelping />
      </div>
      <h3>Empowering Support</h3>
      <p>Providing encouragement and strength to inspire women to pursue their goals.</p>
    </div>
    <div className="mission-card">
      <div  style={{ fontSize: '5.5rem', color: '#fbbf24' }}>
        <FaStar />
      </div>
      <h3>A Platform to Shine</h3>
      <p>Celebrate her talents, share her story, and lead with confidence.</p>
    </div>
  </div>
</section>

      {/* Story Section */}
      <section className="story-section">
  <div className="section-header">
    <h2 className="text-2xl font-bold mb-6 page-user-title" style={{ color: "#444" }}>Her Journey Through Time</h2>
    <p className="section-description">From Silent Roles to Leading Homes and Businesses</p>
  </div>
  <div className="timeline">
    <div className="timeline-item">
      <div className="timeline-year">1960s</div>
      <div className="timeline-content">
        <h3>Behind the Scenes</h3>
        <p>Women played essential roles at home but had limited opportunities in business or leadership.</p>
      </div>
    </div>
    <div className="timeline-item">
      <div className="timeline-year">1980s</div>
      <div className="timeline-content">
        <h3>The Rise of Education</h3>
        <p>More women began accessing education, gaining confidence to dream beyond traditional roles.</p>
      </div>
    </div>
    <div className="timeline-item">
      <div className="timeline-year">2000s</div>
      <div className="timeline-content">
        <h3>The Digital Shift</h3>
        <p>With internet access, many women started online businesses from home — from baking to fashion to tech.</p>
      </div>
    </div>
    <div className="timeline-item">
      <div className="timeline-year">2020s</div>
      <div className="timeline-content">
        <h3>Empowered from Home</h3>
        <p>Today, women lead startups, run online stores, and build brands from their living rooms — all with global reach.</p>
      </div>
    </div>
  </div>
</section>




      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our community of ambitious women changing the world</p>
          <div className="cta-buttons">
            <button className="primary-btn"  onClick={() => navigate("/contact")}>Contact Us</button>
            <button className="primary-btn"  onClick={() => navigate("/register-owner")}>Join Our Community</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
