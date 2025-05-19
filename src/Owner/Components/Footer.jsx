

const Footer = () => {
  return (
    <footer className="footer" >
      <div className="container-fluid" style={{ display: "flex", justifyContent: "center" }}>
        <p className="copyright pull-right">
          &copy; <script>document.write(new Date().getFullYear())</script>{" "}
          <a href="http://www.creative-tim.com">Her Haven</a>, made with love for a support women
        </p>
      </div>
    </footer>
  );
};

export default Footer;
