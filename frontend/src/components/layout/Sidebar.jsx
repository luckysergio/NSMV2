import {
  X,
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  Settings,
  ArrowLeft,
  Users,
  Tag,
  Layers,
  FolderTree,
  Building2,
  Package,
  BarChart3
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/* =====================
 * Helpers
 * ===================== */
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    localStorage.removeItem("user");
    return null;
  }
};

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  minimized,
  toggleMinimize,
}) => {
  const location = useLocation();
  const [masterDataOpen, setMasterDataOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  /* =====================
   * Role (SAFE)
   * ===================== */
  const user = useMemo(() => getStoredUser(), []);
  const isAdmin = user?.role === "admin";

  /* =====================
   * Auto open dropdown
   * ===================== */
  useEffect(() => {
    const path = location.pathname;
    const masterRoutes = [
      "/master/user",
      "/master/product/type",
      "/master/product/subtype",
      "/master/product/category",
    ];
    
    const inventoryRoutes = [
      "/product",
      "/inventory/suppliers",
      "/inventory/warehouse",
    ];

    setMasterDataOpen(
      masterRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
      )
    );
    
    setInventoryOpen(
      inventoryRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
      )
    );
  }, [location.pathname]);

  /* =====================
   * Components - Shared between Desktop & Mobile
   * ===================== */
  const NavItem = ({ to, icon: Icon, children, badge, onClick }) => {
    const isActive = location.pathname === to;
    const isMinimized = window.innerWidth >= 1024 ? minimized : false;

    return (
      <Link
        to={to}
        onClick={onClick || (() => setSidebarOpen(false))}
        className={`
          relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm
          transition-all duration-300 group w-full
          ${
            isActive
              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
          }
          ${isMinimized ? "justify-center px-3" : ""}
        `}
      >
        <div className="relative">
          <Icon
            className={`w-5 h-5 transition-colors ${
              isActive ? "text-white" : "text-gray-500 group-hover:text-blue-500"
            }`}
          />
          {badge && !isMinimized && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
        
        {!isMinimized && (
          <>
            <span className="font-medium flex-1">{children}</span>
            {badge && (
              <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {badge}
              </span>
            )}
          </>
        )}

        {isActive && !isMinimized && (
          <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
        )}
        
        {!isMinimized && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
            isActive ? "bg-white" : "bg-transparent"
          }`} />
        )}
      </Link>
    );
  };

  const CollapsibleSection = ({ 
    icon: Icon, 
    title, 
    open, 
    onToggle, 
    children,
    minimized: isMinimized
  }) => {
    return (
      <div className="space-y-1">
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm
            transition-all duration-300 hover:bg-gray-50 group
            ${isMinimized ? "justify-center px-3" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            {!isMinimized && <span className="font-medium">{title}</span>}
          </div>
          
          {!isMinimized && (
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                open ? "rotate-180 transform" : ""
              }`}
            />
          )}
        </button>

        {!isMinimized && open && (
          <div className="ml-9 pl-3 border-l-2 border-gray-200 space-y-1 animate-fadeIn">
            {children}
          </div>
        )}
      </div>
    );
  };

  const SubNavItem = ({ to, icon: Icon, children, badge, onClick }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        onClick={onClick || (() => setSidebarOpen(false))}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 w-full
          ${
            isActive
              ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
        `}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span className="flex-1">{children}</span>
        {badge && (
          <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };


  const SidebarContent = ({ isMobile = false }) => {
    const isMinimized = isMobile ? false : minimized;

    return (
      <div className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            
            {!isMinimized && (
              <div className="animate-fadeIn">
                <p className="text-sm font-bold text-gray-800 truncate">
                  Niaga Solusi Mandiri
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  Business Management
                </p>
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={toggleMinimize}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
              aria-label={minimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              <ArrowLeft
                className={`w-4 h-4 transition-all duration-300 ${
                  minimized ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Menu Scroll Container */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <NavItem 
            to="/dashboard" 
            icon={LayoutDashboard}
            minimized={isMinimized}
          >
            Dashboard
          </NavItem>

          <NavItem 
            to="/analytics" 
            icon={BarChart3} 
            badge="3"
            minimized={isMinimized}
          >
            Analytics
          </NavItem>

          {/* Inventory Section */}
          <CollapsibleSection
            icon={Package}
            title="Inventory"
            open={inventoryOpen}
            onToggle={() => setInventoryOpen(!inventoryOpen)}
            minimized={isMinimized}
          >
            <SubNavItem to="/product" icon={Package}>
              Products
            </SubNavItem>
            <SubNavItem to="/inventory/suppliers" icon={Users}>
              Suppliers
            </SubNavItem>
            <SubNavItem to="/inventory/warehouse" icon={Building2}>
              Warehouse
            </SubNavItem>
          </CollapsibleSection>

          {/* Master Data Section (Admin Only) */}
          {isAdmin && (
            <CollapsibleSection
              icon={FolderKanban}
              title="Master Data"
              open={masterDataOpen}
              onToggle={() => setMasterDataOpen(!masterDataOpen)}
              minimized={isMinimized}
            >
              <SubNavItem to="/master/user" icon={Users}>
                User Management
              </SubNavItem>
              <SubNavItem to="/master/product/type" icon={Tag}>
                Product Types
              </SubNavItem>
              <SubNavItem to="/master/product/subtype" icon={Layers}>
                Product Subtypes
              </SubNavItem>
              <SubNavItem to="/master/product/category" icon={FolderTree}>
                Categories
              </SubNavItem>
            </CollapsibleSection>
          )}

          <NavItem 
            to="/settings" 
            icon={Settings}
            minimized={isMinimized}
          >
            System Settings
          </NavItem>
        </div>
      </div>
    );
  };

  /* =====================
   * Layout
   * ===================== */
  return (
    <>
      {/* ================= Desktop ================= */}
      <aside
        className={`
          hidden lg:flex fixed inset-y-0 left-0 z-30
          bg-white border-r border-gray-100
          transition-all duration-300 ease-in-out
          ${minimized ? "w-20" : "w-72"}
          shadow-sm
        `}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {/* ================= Mobile Overlay ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Mobile ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-white shadow-2xl
          transform transition-all duration-300 ease-in-out lg:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent isMobile={true} />
      </aside>
    </>
  );
};

export default Sidebar;