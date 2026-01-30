import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        minimized={sidebarMinimized}
        toggleMinimize={() => setSidebarMinimized(!sidebarMinimized)}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          sidebarMinimized ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <Navbar
          setSidebarOpen={setSidebarOpen}
          toggleMinimize={() => setSidebarMinimized(!sidebarMinimized)}
          minimized={sidebarMinimized}
        />

        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;