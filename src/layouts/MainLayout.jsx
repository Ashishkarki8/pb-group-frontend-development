// layouts/MainLayout.jsx
import { Outlet, ScrollRestoration } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StickyContactButton from "../components/StickyContactButton ";
import GenXCodeItHomepage from "../pages/GenXCodeItHomepage";



const MainLayout = () => {
  return (
    <div>
    {/* <GenXCodeItHomepage></GenXCodeItHomepage> */}
      <Topbar />
      <Navbar />
      <StickyContactButton />
      <Outlet />
      <Footer />

    </div>
  );
};

export default MainLayout;
