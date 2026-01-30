import { useState, useRef, useEffect } from "react";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User, Settings, Bell } from "lucide-react";

const Navbar = ({ setSidebarOpen, toggleMinimize, minimized }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const notifications = [
    { id: 1, text: "New user registered", time: "5 min ago", read: false },
    { id: 2, text: "System update completed", time: "1 hour ago", read: true },
    { id: 3, text: "Monthly report ready", time: "2 hours ago", read: true },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center justify-between shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
          aria-label="Open menu"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-xl">☰</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleMinimize}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            aria-label={minimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            <div className={`transform transition-transform ${minimized ? "rotate-180" : ""}`}>
              <span className="text-xl">«</span>
            </div>
          </button>
          <h1 className="text-lg font-semibold text-gray-800 ml-2">
            {location.pathname === "/dashboard" ? "Dashboard" : "Management System"}
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsDropdownOpen(false);
              setHasUnreadNotifications(false);
            }}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 transform transition-all duration-200 animate-fadeIn">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-100 transition-all duration-200 active:scale-95 group"
          >
            
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || "Admin"}</p>
            </div>
            
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 transform transition-all duration-200 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4" />
                My Profile
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Account Settings
              </button>
              
              <div className="border-t border-gray-100 my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;