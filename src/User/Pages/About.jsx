import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <h1>Empowering Women, Changing the World</h1>
          <p>HerHeven is where women's dreams find wings</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p className="mission-statement">
              To create a world where every woman has the resources, support, and platform to bring her vision to life.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projects Supported</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">120+</span>
                <span className="stat-label">Countries Reached</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$2M+</span>
                <span className="stat-label">Funding Raised</span>
              </div>
            </div>
          </div>
          <div className="mission-image">
            <img src="/images/women-team.jpg" alt="Diverse team of women working together" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <h2>Our Story</h2>
          <div className="story-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2018</div>
              <div className="timeline-content">
                <h3>Founded with a Vision</h3>
                <p>HerHeven began as a small community of 10 women supporting each other's entrepreneurial journeys.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h3>First Major Success</h3>
                <p>Helped launch 50 women-led businesses during the pandemic, proving resilience in challenging times.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2023</div>
              <div className="timeline-content">
                <h3>Global Expansion</h3>
                <p>Expanded our platform to support women entrepreneurs in developing countries with localized resources.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">👭</div>
              <h3>Sisterhood</h3>
              <p>We believe in lifting each other up and creating a supportive network of women helping women.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We celebrate creative thinking and encourage out-of-the-box solutions to challenges.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Impact</h3>
              <p>We measure success by the positive change we create in women's lives and communities.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Authenticity</h3>
              <p>We honor each woman's unique journey and encourage genuine self-expression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Founders</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="/images/founder1.jpg" alt="Aisha Mohammed, CEO" />
              <h3>Aisha Mohammed</h3>
              <p className="position">CEO & Co-Founder</p>
              <p className="bio">Serial entrepreneur with a passion for creating opportunities for women in tech.</p>
            </div>
            <div className="team-member">
              <img src="/images/founder2.jpg" alt="Elena Rodriguez, CMO" />
              <h3>Elena Rodriguez</h3>
              <p className="position">CMO & Co-Founder</p>
              <p className="bio">Marketing expert dedicated to amplifying women's voices in business.</p>
            </div>
            <div className="team-member">
              <img src="/images/founder3.jpg" alt="Priya Patel, COO" />
              <h3>Priya Patel</h3>
              <p className="position">COO & Co-Founder</p>
              <p className="bio">Operations specialist focused on building sustainable growth models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our community of ambitious women changing the world, one project at a time.</p>
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