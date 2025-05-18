import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BestStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/high-rating");
      setStores(res.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="best-stores-section" style={{
      padding: '60px 0',
      
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 15px'
      }}>
        <div className="section-header" style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '3.5rem',
            color: 'rgb(65, 65, 65);',
            marginBottom: '10px',
            fontWeight: '700',
            position: 'relative',
            display: 'inline-block'
          }}>
            Best Stores
            <span style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '3px',
              background: 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)',
              borderRadius: '3px'
            }}></span>
          </h2>
          <p style={{
          
            fontSize: '1.8rem',
            marginTop: '15px'
          }}>Our top recommended stores for you</p>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px'
          }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            autoplay={{ 
              delay: 3000,
              disableOnInteraction: false
            }}
            modules={[Autoplay, Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30
              }
            }}
            style={{
              padding: '20px 0'
            }}
          >
            {stores.map((store) => (
              <SwiperSlide key={store.id}>
                <div className="store-card" style={{
                  background: '#fff',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(94, 53, 177, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div className="store-image" style={{
                    height: '180px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src={`http://127.0.0.1:8000/storage/logo/${store.logo}`} 
                      alt={store.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div className="store-category" style={{
                      position: 'absolute',
                      bottom: '15px',
                      right: '15px',
                      background: 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)',
                      color: '#fff',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '1.8rem',
                      fontWeight: '600',
                      display: "flex",
                      gap: "7px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "yellow" }}>&#9733;</span> 
                      {store.average_rating || "General"}
                    </div>
                  </div>
                  <div className="store-content" style={{
                    padding: '25px',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      color: '#444',
                      marginBottom: '10px',
                      fontSize: '1.9rem',
                      fontWeight: '600'
                    }}>{store.name}</h3>
                    <div style={{ marginTop: 'auto' }}>
                      <a 
                        href={`/store/${store.id}`} 
                        className="store-btn" 
                        style={{
                          display: 'inline-block',
                          padding: '10px 25px',
                          background: 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)',
                          color: '#fff',
                          borderRadius: '30px',
                          textDecoration: 'none',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          border: '2px solid transparent',
                          marginTop: '15px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#5e35b1';
                          e.currentTarget.style.borderColor = '#5e35b1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(to right, #f0f9ff 0%, #aa7ad0 0%, #d07acd 100%)';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        VISIT STORE
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Navigation arrows */}
        <div className="swiper-button-next" style={{
          color: '#5e35b1',
          right: '10px',
          background: 'rgba(255,255,255,0.8)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}></div>
        <div className="swiper-button-prev" style={{
          color: '#5e35b1',
          left: '10px',
          background: 'rgba(255,255,255,0.8)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}></div>
        
     
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-spinner {
          border: 5px solid #e0e0e0;
          border-top: 5px solid #7e57c2;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        
        .store-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(94, 53, 177, 0.2);
        }
        
        .swiper-button-next:after, 
        .swiper-button-prev:after {
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};

export default BestStores;
