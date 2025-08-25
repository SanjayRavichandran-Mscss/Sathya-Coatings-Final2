// import React, { useRef, useEffect, useState } from "react";
// import {
//   Calculator,
//   ClipboardList,
//   Contact,
//   IndianRupee,
//   HardHat,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   Package,
//   User,
//   X
// } from "lucide-react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// const ServiceMenu = ({ onMenuSelect, activeMenu }) => {
//   const menuRef = useRef(null);
//   const profileRef = useRef(null);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const user = JSON.parse(sessionStorage.getItem('user')) || {};
//   const navigate = useNavigate();

//   const menuItems = [
//     {
//       id: "createReckoner",
//       label: "Create Reckoner",
//       icon: <Calculator size={20} />,
//     },
//     {
//       id: "displayReckoner",
//       label: "View Reckoners",
//       icon: <ClipboardList size={20} />,
//     },
//     {
//       id: "viewCompanyProjectSite",
//       label: "Site Information",
//       icon: <Building2 size={20} />,
//     },
//     {
//       id: "employeeDetails",
//       label: "Employee Details",
//       icon: <Contact size={20} />,
//     },
//     // {
//     //   id: "dispatchMaster",
//     //   label: "Dispatch Master",
//     //   icon: <HardHat size={20} />,
//     // },
//     {
//       id: "expenseDetails",
//       label: "Expense Details",
//       icon: <IndianRupee size={20} />,
//     },
//     {
//       id: "viewDispatchDetails",
//       label: "Dispatch Details",
//       icon: <Package size={20} />,
//     },
//   ];

//   const handleMenuClick = (menuId) => {
//     onMenuSelect(menuId);
//   };

//   const renderDesktopMenu = () => {
//     const [showLeftArrow, setShowLeftArrow] = React.useState(false);
//     const [showRightArrow, setShowRightArrow] = React.useState(false);

//     const scrollMenu = (direction) => {
//       if (menuRef.current) {
//         const scrollAmount = direction === "left" ? -200 : 200;
//         menuRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//       }
//     };

//     const checkScrollArrows = () => {
//       if (menuRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
//         setShowLeftArrow(scrollLeft > 0);
//         setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
//       }
//     };

//     const handleLogout = async () => {
//       try {
//         await axios.post("http://localhost:5000/auth/logout");
//         localStorage.removeItem("token");
//         localStorage.removeItem("encodedUserId");
//         localStorage.removeItem("loginTime");
//         toast.success("Logged out successfully!");
//         sessionStorage.removeItem('user');
//         setTimeout(() => {
//           navigate("/");
//         }, 2000);
//       } catch (error) {
//         console.error("Logout error:", error);
//         toast.error("Failed to log out");
//       }
//   };

//     useEffect(() => {
//       checkScrollArrows();
//       const handleResize = () => checkScrollArrows();
//       window.addEventListener("resize", handleResize);
//       menuRef.current?.addEventListener("scroll", checkScrollArrows);
//       return () => {
//         window.removeEventListener("resize", handleResize);
//         menuRef.current?.removeEventListener("scroll", checkScrollArrows);
//       };
//     }, []);

//     return (
//       <div className="relative hidden md:flex items-center justify-center w-full">
//         {showLeftArrow && (
//           <button
//             onClick={() => scrollMenu("left")}
//             className="absolute left-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
//             aria-label="Scroll Left"
//           >
//             <ChevronLeft size={20} />
//           </button>
//         )}
//          <div className="w-16 h-16 rounded-full">
//             <img src="/logo_abstract.png" alt="Sathya Coatings Logo" />
//             </div>
//         <nav
//           ref={menuRef}
//           className="flex overflow-x-auto scrollbar-hidden space-x-2 sm:space-x-3 px-10"
//         >
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap
//                 ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//               aria-label={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               <span className="ml-2 truncate">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//         <div ref={profileRef} className="absolute top-4 right-4">
//             <button
//               onClick={() => setIsProfileOpen(!isProfileOpen)}
//               className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               aria-label="User Profile"
//             >
//               <User size={20} />
//             </button>
//             {isProfileOpen && (
//               <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl p-4 z-50 animate-slide-in-down">
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
//                   <button
//                     onClick={() => setIsProfileOpen(false)}
//                     className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none"
//                     aria-label="Close Profile"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-600 capitalize">Name: {user.user_name}</p>
//                 <p className="text-sm text-gray-600">Email: {user.user_email}</p>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         {showRightArrow && (
//           <button
//             onClick={() => scrollMenu("right")}
//             className="absolute right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
//             aria-label="Scroll Right"
//           >
//             <ChevronRight size={20} />
//           </button>
//         )}
//       </div>
//     );
//   };

//   const renderMobileMenu = () => {
//     const handleLogout = async () => {
//       try {
//         await axios.post("http://localhost:5000/auth/logout");
//         localStorage.removeItem("token");
//         localStorage.removeItem("encodedUserId");
//         localStorage.removeItem("loginTime");
//         toast.success("Logged out successfully!");
//         setTimeout(() => {
//           navigate("/");
//         }, 2000);
//       } catch (error) {
//         console.error("Logout error:", error);
//         toast.error("Failed to log out");
//       }
//   };
//     return (
//       <div className="relative flex md:hidden items-center justify-center w-full px-4">
//         <div ref={profileRef} className="absolute top-4 right-4">
//             <button
//               onClick={() => setIsProfileOpen(!isProfileOpen)}
//               className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               aria-label="User Profile"
//             >
//               <User size={20} />
//             </button>
//             {isProfileOpen && (
//               <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl p-4 z-50 animate-slide-in-down">
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
//                   <button
//                     onClick={() => setIsProfileOpen(false)}
//                     className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none"
//                     aria-label="Close Profile"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-600 capitalize">Name: {user.user_name}</p>
//                 <p className="text-sm text-gray-600">Email: {user.user_email}</p>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         <div
//           className="flex flex-col items-center gap-2 mobile-menu"
//           style={{ width: "fit-content", margin: "0 auto" }}
//         >
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm w-full max-w-xs
//                 ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//               aria-label={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               <span className="ml-2 truncate">{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full">
//       {renderMobileMenu()}
//       {renderDesktopMenu()}
//     </div>
//   );
// };

// export default ServiceMenu;



















import React, { useRef, useEffect, useState } from "react";
import {
  Calculator,
  ClipboardList,
  Contact,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
  User,
  X,
  LayoutDashboard
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ServiceMenu = ({ onMenuSelect, activeMenu = "dashboard" }) => {
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "createReckoner",
      label: "Master Creation",
      icon: <Calculator size={20} />,
    },
    {
      id: "displayReckoner",
      label: "View Master",
      icon: <ClipboardList size={20} />,
    },
    {
      id: "viewCompanyProjectSite",
      label: "Site Information",
      icon: <Building2 size={20} />,
    },
    {
      id: "employeeDetails",
      label: "Employee Details",
      icon: <Contact size={20} />,
    },
    {
      id: "expenseDetails",
      label: "Expense Details",
      icon: <IndianRupee size={20} />,
    },
    {
      id: "viewDispatchDetails",
      label: "Dispatch Details",
      icon: <Package size={20} />,
    },
  ];

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
  };

  const renderDesktopMenu = () => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

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

    const handleLogout = async () => {
      try {
        await axios.post("http://localhost:5000/auth/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("encodedUserId");
        localStorage.removeItem("loginTime");
        sessionStorage.removeItem('user');
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out");
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

    return (
      <div className="relative hidden md:flex items-center justify-center w-full">
        {showLeftArrow && (
          <button
            onClick={() => scrollMenu("left")}
            className="absolute left-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="w-16 h-16 rounded-full">
          <img src="/logo_abstract.png" alt="Sathya Coatings Logo" />
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
                onClick={handleLogout}
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
  };

  const renderMobileMenu = () => {
    const handleLogout = async () => {
      try {
        await axios.post("http://localhost:5000/auth/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("encodedUserId");
        localStorage.removeItem("loginTime");
        sessionStorage.removeItem('user');
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out");
      }
    };

    return (
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
                onClick={handleLogout}
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
  };

  return (
    <div className="w-full">
      {renderMobileMenu()}
      {renderDesktopMenu()}
    </div>
  );
};

export default ServiceMenu;