// layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StickyContactButton from "../components/StickyContactButton ";


const MainLayout = () => {
  return (
    <div>
      <Topbar />
      <Navbar />
      <StickyContactButton />
      <Outlet />
      <Footer />
      
    </div>
  );
};

export default MainLayout;
