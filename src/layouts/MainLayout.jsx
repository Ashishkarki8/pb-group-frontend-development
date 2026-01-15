// layouts/MainLayout.jsx
import { Outlet, ScrollRestoration } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StickyContactButton from "../components/StickyContactButton ";
import ScrollToTop from "../components/ScrollToTop";


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
