import { Outlet , useLocation } from "react-router-dom";
import Header from "../components/Header"; 
import Footer from "../Components/Footer";

const PublicLayout = () => {

  const location = useLocation();
  const isHome = location.pathname === "/";
  
  return (
    <>
       <div style={{ marginBottom: isHome ? "0" : "70px" }}><Header /></div>
      <main>
        <Outlet />
      </main>

      <Footer />

      
    </>
  );
};

export default PublicLayout;
