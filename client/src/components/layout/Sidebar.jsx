import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => {
    return location === path;
  };

  return (
    <div className="hidden md:flex flex-col items-center w-16 pb-4 overflow-auto border-r bg-white">
      <div className="flex items-center justify-center h-16 border-b w-full">
        <Link href="/">
          <a className="text-lg font-bold text-primary-600">ST</a>
        </Link>
      </div>
      
      <div className="flex flex-col items-center flex-1 w-full mt-4 space-y-4">
        <Link href="/">
          <a className={`sidebar-icon ${isActive("/") ? "bg-primary-50 text-primary-600" : ""}`}>
            <i className="ri-home-4-line text-xl"></i>
            <span className="sidebar-tooltip">Home</span>
          </a>
        </Link>
        <a href="#" className="sidebar-icon">
          <i className="ri-layout-grid-line text-xl"></i>
          <span className="sidebar-tooltip">Categories</span>
        </a>
        <a href="#" className="sidebar-icon">
          <i className="ri-chat-1-line text-xl"></i>
          <span className="sidebar-tooltip">Chat</span>
        </a>
        <Link href="/profile">
          <a className={`sidebar-icon ${isActive("/profile") ? "bg-primary-50 text-primary-600" : ""}`}>
            <i className="ri-user-line text-xl"></i>
            <span className="sidebar-tooltip">Profile</span>
          </a>
        </Link>
        <a href="#" className="sidebar-icon">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="sidebar-tooltip">Notifications</span>
        </a>
      </div>
      
      <div className="flex flex-col items-center w-full mt-auto">
        <a href="#" className="sidebar-icon">
          <i className="ri-settings-3-line text-xl"></i>
          <span className="sidebar-tooltip">Settings</span>
        </a>
        <Link href="/profile">
          <a className="sidebar-icon">
            <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-300">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={`${user.firstName || user.username}'s avatar`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <i className="ri-user-line"></i>
                </div>
              )}
            </div>
            <span className="sidebar-tooltip">Your Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
