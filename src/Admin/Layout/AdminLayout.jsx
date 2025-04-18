import { Routes, Route } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

import OwnerDashboard from "../Pages/AdminDashboard";

import UserList from "../Pages/Users/UserList";
import UserCreate from "../Pages/Users/UserCreate";
import UserEdit from "../Pages/Users/UserEdit";
import UserView from "../Pages/Users/UserView";

import StoresList from "../Pages/Stores/StoresList";
import StoreCreate from "../Pages/Stores/StoreCreate";
import StoreEdit from "../Pages/Stores/StoreEdit";
import StoreDetails from "../Pages/Stores/StoreDetails";






const AdminLayout = () => {
  return (
    <div className="wrapper">
      
        <Sidebar />

        <div className="main-panel">
        <nav className="navbar navbar-default navbar-fixed">
             <div className="container-fluid"> 
                 <Header />
            </div>
        </nav>
           
          <Routes>
              <Route path="/" element={<OwnerDashboard />} />

              {/* User Management */}
              <Route path="/users" element={<UserList />} />
              <Route path="/users/create" element={<UserCreate />} />
              <Route path="/users/:id/edit" element={<UserEdit />} />
              <Route path="/users/:id" element={<UserView />} />

              {/* Stores Management */}
              <Route path="/stores" element={<StoresList />} />
              <Route path="/stores/create" element={<StoreCreate />} />
              <Route path="/stores/edit/:id" element={<StoreEdit />} />
              <Route path="/stores/:id" element={<StoreDetails />} />
             

          </Routes>

        <footer className="footer">
          <div className="container-fluid"> 
               <Footer />
          </div>
        </footer>
         
        </div>
        
    </div>
  );
};

export default AdminLayout;



