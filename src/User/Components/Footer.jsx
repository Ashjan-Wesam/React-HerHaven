import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer" style={{
      background: '#222222',
      color: 'white',
      padding: '60px 0 30px',
      marginTop: '80px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div className="" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div className="footer-content" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* About Section */}
          <div className="footer-section">
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: '600',
              color: 'white'
            }}>
              <span style={{
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)'
              }}></span>
              About Us
            </h3>
            <p style={{
              lineHeight: '1.7',
              opacity: '0.9',
              marginBottom: '20px'
            }}>
              Premium marketplace featuring the best women's fashion stores and boutiques. Discover unique styles and quality products.
            </p>
            <div className="social-links" style={{
              display: 'flex',
              gap: '18px'
            }}>
              {['facebook-f', 'instagram', 'twitter', 'pinterest-p'].map((icon) => (
                <a href="#" key={icon} style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)'
                }} onMouseEnter={(e) => {
                  e.currentTarget.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}>
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: '600',
              color: 'white'
            }}>
              <span style={{
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)'
              }}></span>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: '0'
            }}>
              {[
                { path: '/', text: 'Home' },
                { path: '/shop', text: 'All Stores' },
                { path: '/shop', text: 'Categories' },
                { path: '/about-us', text: 'Our Story' },
                { path: '/contact', text: 'Contact Us' }
              ].map((link) => (
                <li key={link.path} style={{ 
                  marginBottom: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <Link to={link.path} style={{
                    color: 'white',
                    textDecoration: 'none',
                    opacity: '0.9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                   
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '25px',
              position: 'relative',
              fontWeight: '600',
              color: 'white'
              
            }}>
              <span style={{
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)'
              }}></span>
              Contact Us
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: '0'
            }}>
              <li style={{
                marginBottom: '15px',
                display: 'flex',
                gap: '12px'
              }}>
                <i className="fas fa-map-marker-alt" style={{ marginTop: '4px' }}></i>
                <span>Amman , Jordan</span>
              </li>
              <li style={{
                marginBottom: '15px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <i className="fas fa-phone"></i>
                <span>+(962) 78 759 5 164</span>
              </li>
              <li style={{
                marginBottom: '15px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <i className="fas fa-envelope"></i>
                <span>Herhaven@gmail.com</span>
              </li>
              <li style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <i className="fas fa-clock"></i>
                <span>We're Here For You At All Times</span>
              </li>
            </ul>
          </div>

       
        </div>

        {/* Copyright */}
        <div className="footer-bottom" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '30px',
          textAlign: 'center',
          opacity: '0.8',
          fontSize: '0.95rem'
        }}>
          <p>© {new Date().getFullYear()} Her Haven. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;