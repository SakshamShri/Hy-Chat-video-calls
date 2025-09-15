import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar - always visible on lg+ screens */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        
        {/* Mobile Sidebar Overlay - only when toggled */}
        {showSidebar && isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 z-50 lg:hidden">
              <Sidebar onClose={toggleSidebar} />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col">
          <Navbar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
