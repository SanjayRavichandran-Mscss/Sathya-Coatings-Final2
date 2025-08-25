// import React, { useState } from "react";
// import {
//   SquareMenu,
//   X,
//   LayoutDashboard,
//   IndianRupee,
// } from "lucide-react";

// const SiteInchargeMenu = ({ onMenuSelect, activeMenu }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const menuItems = [
//     {
//       id: "expenseEntry",
//       label: "Expense Entry",
//       icon: <IndianRupee size={20} />,
//       active: activeMenu === "expenseEntry",
//     },
//   ];

//   const handleMenuClick = (menuId) => {
//     onMenuSelect(menuId);
//     setIsMobileMenuOpen(false);
//   };

//   const handleOutsideClick = () => {
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <div className="flex flex-col md:w-64">
//       {/* Mobile Header */}
//       <div className="flex md:hidden items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-md shadow-md">
//         <div className="flex items-center text-gray-800">
//           <LayoutDashboard className="mr-2" size={24} />
//           <span className="font-semibold text-lg sm:text-xl">Site Incharge Dashboard</span>
//         </div>
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <SquareMenu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
//           onClick={handleOutsideClick}
//         >
//           <div
//             className="w-72 max-h-[80vh] bg-white/90 backdrop-blur-lg shadow-xl rounded-r-xl p-4 flex flex-col animate-slide-in-left"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center text-gray-800">
//                 <LayoutDashboard size={24} className="mr-2" />
//                 <h2 className="text-lg sm:text-xl font-bold">Site Incharge Dashboard</h2>
//               </div>
//               <button
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 aria-label="Close Menu"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
//               {menuItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => handleMenuClick(item.id)}
//                   className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-2 text-sm sm:text-base
//                     ${item.active ? "bg-indigo-100 text-indigo-800 shadow-md" : "text-gray-800 hover:bg-indigo-50"}
//                     focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//                   aria-label={item.label}
//                 >
//                   <span className="flex-shrink-0">{item.icon}</span>
//                   <span className="ml-3 truncate">{item.label}</span>
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>
//       )}

//       {/* Desktop Sidebar */}
//       <div className="hidden md:flex flex-col w-64 h-screen bg-white/90 backdrop-blur-lg shadow-lg">
//         <div className="p-3 sm:p-4 flex items-center border-b border-gray-200">
//           <LayoutDashboard size={24} className="mr-2 text-gray-800" />
//           <h2 className="text-lg sm:text-xl font-bold text-gray-800">Site Incharge Dashboard</h2>
//         </div>
//         <nav className="flex-1 p-2 sm:p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-2 text-sm sm:text-base
//                 ${item.active ? "bg-indigo-100 text-indigo-800 shadow-md" : "text-gray-800 hover:bg-indigo-50"}
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//               aria-label={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               <span className="ml-3 truncate">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default SiteInchargeMenu;







import React, { useRef, useEffect, useState } from "react";
import {
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  LayoutDashboard,
  ClipboardList
} from "lucide-react";

const SiteInchargeMenu = ({ onMenuSelect, activeMenu }) => {
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user')) || {};

const menuItems = [
  {
    id: "expenseEntry",
    label: "Expense Entry",
    icon: <IndianRupee size={20} />,
  },
  {
    id: "workCompletionEntry",
    label: "Work Completion Entry",
    icon: <ClipboardList size={20} />,
  },
];

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
    setIsProfileOpen(false);
  };

  const scrollMenu = (direction) => {
    if (menuRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      menuRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollArrows = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollArrows();
    const handleResize = () => checkScrollArrows();
    window.addEventListener("resize", handleResize);
    menuRef.current?.addEventListener("scroll", checkScrollArrows);
    return () => {
      window.removeEventListener("resize", handleResize);
      menuRef.current?.removeEventListener("scroll", checkScrollArrows);
    };
  }, []);

  const renderDesktopMenu = () => (
    <div className="relative hidden md:flex items-center w-full">
      {showLeftArrow && (
        <button
          onClick={() => scrollMenu("left")}
          className="absolute left-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="w-16 h-16 rounded-full flex">
        <img src="/logo_abstract.png" alt="Site Incharge Logo" />
      </div>
      <nav
        ref={menuRef}
        className="flex overflow-x-auto scrollbar-hidden space-x-2 sm:space-x-3 px-10"
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap
              ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
              focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            aria-label={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="ml-2 truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      <div ref={profileRef} className="absolute top-4 right-4">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="User Profile"
        >
          <User size={20} />
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 top-11 w-64 bg-white rounded-lg shadow-xl p-4 z-50 animate-slide-in-down">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                aria-label="Close Profile"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-600 capitalize">Name: {user.user_name}</p>
            <p className="text-sm text-gray-600">Email: {user.user_email}</p>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                onMenuSelect("logout");
              }}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {showRightArrow && (
        <button
          onClick={() => scrollMenu("right")}
          className="absolute right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
          aria-label="Scroll Right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );

  const renderMobileMenu = () => (
    <div className="relative flex md:hidden items-center justify-center w-full px-4">
      <div ref={profileRef} className="absolute top-4 right-4">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="User Profile"
        >
          <User size={20} />
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl p-4 z-50 animate-slide-in-down">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                aria-label="Close Profile"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-600 capitalize">Name: {user.user_name}</p>
            <p className="text-sm text-gray-600">Email: {user.user_email}</p>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                onMenuSelect("logout");
              }}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div
        className="flex flex-col items-center gap-2 mobile-menu"
        style={{ width: "fit-content", margin: "0 auto" }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm w-full max-w-xs
              ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
              focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            aria-label={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="ml-2 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {renderMobileMenu()}
      {renderDesktopMenu()}
    </div>
  );
};

export default SiteInchargeMenu;