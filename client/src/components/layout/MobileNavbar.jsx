import { Link, useLocation } from "wouter";

export default function MobileNavbar() {
  const [location] = useLocation();
  
  const isActive = (path) => {
    return location === path;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 flex items-center justify-between px-4 py-4 sm:px-6 md:hidden bg-white border-t z-10">
      <Link href="/">
        <a className={isActive("/") ? "text-primary-600" : "text-gray-500 hover:text-primary-600"}>
          <i className="ri-home-4-line text-2xl"></i>
        </a>
      </Link>
      <a href="#" className="text-gray-500 hover:text-primary-600">
        <i className="ri-layout-grid-line text-2xl"></i>
      </a>
      <a href="#" className="text-gray-500 hover:text-primary-600">
        <i className="ri-chat-1-line text-2xl"></i>
      </a>
      <Link href="/profile">
        <a className={isActive("/profile") ? "text-primary-600" : "text-gray-500 hover:text-primary-600"}>
          <i className="ri-user-line text-2xl"></i>
        </a>
      </Link>
      <a href="#" className="text-gray-500 hover:text-primary-600">
        <i className="ri-notification-3-line text-2xl"></i>
      </a>
    </div>
  );
}
