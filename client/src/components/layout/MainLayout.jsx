import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Mobile Navigation */}
      <MobileNavbar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto pb-16 md:pb-0">
        {/* Top Navigation Bar */}
        <Header />
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
}
