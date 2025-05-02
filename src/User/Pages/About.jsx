import './About.css';
import heroImage from "../../userTemplate/img/download (32).jpg";
import teamImage from "../../userTemplate/img/about2.jpg";
import founder1 from "../../userTemplate/img/hero5.png";
import founder2 from "../../userTemplate/img/hero5.png";
import founder3 from "../../userTemplate/img/hero5.png";

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-sectionAbout">
        <div className="hero-content">
          <h1>Empowering Women, Changing the World</h1>
          <p className="hero-subtitle">Her Haven is the place where women's dreams come true</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Supported Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">120+</span>
              <span className="stat-label">Countries Worldwide</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Women Entrepreneurs" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-header">
          <h2>Our Mission</h2>
          <p className="section-description">Creating a world where every woman has the resources, support, and platform to realize her vision</p>
        </div>
        <div className="mission-cards">
          <div className="mission-card">
            <div className="card-icon">👭</div>
            <h3>Sisterhood</h3>
            <p>We believe in lifting each other up and building a supportive network of women helping women</p>
          </div>
          <div className="mission-card">
            <div className="card-icon">💡</div>
            <h3>Innovation</h3>
            <p>We celebrate creative thinking and encourage out-of-the-box solutions to challenges</p>
          </div>
          <div className="mission-card">
            <div className="card-icon">🌍</div>
            <h3>Impact</h3>
            <p>We measure success by the positive change we bring to women's lives and communities</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="section-header">
          <h2>Our Story</h2>
          <p className="section-description">The journey of Her Haven from inception to today</p>
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-year">2018</div>
            <div className="timeline-content">
              <h3>Founded with a Vision</h3>
              <p>Her Haven began as a small community of 10 women supporting each other's entrepreneurial journeys</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2020</div>
            <div className="timeline-content">
              <h3>First Major Milestone</h3>
              <p>We helped launch 50 women-led businesses during the pandemic</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2023</div>
            <div className="timeline-content">
              <h3>Global Expansion</h3>
              <p>We expanded our platform to support female entrepreneurs in developing countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-header">
          <h2>Leadership Team</h2>
          <p className="section-description">The faces behind Her Haven</p>
        </div>
        <div className="team-grid">
          <div className="team-member">
            <img src={founder1} alt="Aisha Mohammed, CEO" />
            <h3>Aisha Mohammed</h3>
            <p className="position">CEO & Co-Founder</p>
          </div>
          <div className="team-member">
            <img src={founder2} alt="Elena Rodriguez, CMO" />
            <h3>Elena Rodriguez</h3>
            <p className="position">Chief Marketing Officer & Co-Founder</p>
          </div>
          <div className="team-member">
            <img src={founder3} alt="Priya Patel, COO" />
            <h3>Priya Patel</h3>
            <p className="position">Chief Operating Officer & Co-Founder</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our community of ambitious women changing the world</p>
          <div className="cta-buttons">
            <button className="primary-btn">Apply for Support</button>
            <button className="secondary-btn">Meet Our Community</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
