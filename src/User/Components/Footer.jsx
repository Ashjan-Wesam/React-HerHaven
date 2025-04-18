
// import card1 from "../assets/img/cards/1.png";
// import card2 from "../assets/img/cards/2.png";
// import card3 from "../assets/img/cards/3.png";
// import card4 from "../assets/img/cards/4.png";
// import card5 from "../assets/img/cards/5.png";

const Footer = () => {
  return (
    <>
      {/* Footer top section */}
      <section className="footer-top-section home-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-8 col-sm-12">
              <div className="footer-widget about-widget">
                <h2 style={{ color: "#c47acf" }}>
                  <span style={{ color: "#fff" }}>Her</span>Haven
                </h2>
                <p>
                  Donec vitae purus nunc. Morbi faucibus erat sit amet congue
                  mattis. Nullam fringilla faucibus urna, id dapibus erat iaculis ut.
                  Integer ac sem.
                </p>
                <div className="cards">
                  <img src="" alt="" />
                  <img src="{card4}" alt="" />
                  <img src="{card3}" alt="" />
                  <img src="{card2}" alt="" />
                  <img src="{card1}" alt="" />
                </div>
              </div>
            </div>

            {[
              {
                title: "usefull Links",
                links: ["Partners", "Bloggers", "Support", "Terms of Use", "Press"]
              },
              {
                title: "Sitemap",
                links: ["Partners", "Bloggers", "Support", "Terms of Use", "Press"]
              },
              {
                title: "Shipping & returns",
                links: ["About Us", "Track Orders", "Returns", "Jobs", "Shipping", "Blog"]
              },
            ].map((col, index) => (
              <div key={index} className="col-lg-2 col-md-4 col-sm-6">
                <div className="footer-widget">
                  <h6 className="fw-title">{col.title}</h6>
                  <ul>
                    {col.links.map((link, i) => (
                      <li key={i}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="footer-widget">
                <h6 className="fw-title">Contact</h6>
                <div className="text-box">
                  <p>Your Company Ltd</p>
                  <p>1481 Creekside Lane  Avila Beach, CA 93424</p>
                  <p>+53 345 7953 32453</p>
                  <p>office@youremail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <footer className="footer-section">
        <div className="container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} All rights reserved | This template is made with{" "}
            <i className="fa fa-heart-o" aria-hidden="true"></i> by{" "}
            <a href="#" style={{ color: "#c47acf" }}>Ashjan</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
