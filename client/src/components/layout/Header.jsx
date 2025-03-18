import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-white border-b sm:px-6">
      <div className="flex items-center flex-1">
        <h1 className="text-lg font-semibold text-gray-800">SimpliTrain</h1>
        <div className="ml-4 flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="ri-search-line text-gray-400"></i>
            </span>
            <input 
              type="text" 
              placeholder="What would you like to learn?" 
              className="py-2 pl-10 pr-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-2">
        <button className="p-1.5 text-gray-500 focus:outline-none hover:text-primary-600">
          <i className="ri-search-line text-xl"></i>
        </button>
        <button className="p-1.5 text-gray-500 focus:outline-none hover:text-primary-600">
          <i className="ri-notification-3-line text-xl"></i>
        </button>
        <div className="relative">
          <button 
            className="p-1.5 text-gray-500 focus:outline-none hover:text-primary-600"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <i className="ri-settings-3-line text-xl"></i>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Account
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <div className="w-8 h-8 overflow-hidden rounded-full">
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={`${user.firstName || user.username}'s avatar`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
              <i className="ri-user-line"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
