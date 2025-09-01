// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import ServiceDashboard from "../../ServiceProjects/ServiceDashboard";
// import ServiceMenu from "../../components/SathyaServices/ServicesMenu";
// // import ServiceMenu from "../../ServiceProjects/ServiceMenu";
// import SiteInformation from "../../components/SathyaServices/SiteInformation";
// import { User, X } from "lucide-react";
// import ServicesLayout from "../../components/SathyaServices/ServicesLayout";

// const AdminPage = () => {
//   const { encodedUserId } = useParams();
//   const [user, setUser] = useState(null);

//   const [activeMenu, setActiveMenu] = useState("createReckoner");
//   const [selectedCompanyId, setSelectedCompanyId] = useState("");
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const navigate = useNavigate();
//   const profileRef = useRef(null);
//   const headerRef = useRef(null);

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/");
//         toast.error("Please log in to access this page.");
//         return;
//       }

//       try {
//         const response = await axios.post("http://localhost:5000/auth/verify-token", { token });
//         setUser(response.data);
//         sessionStorage.setItem('user', JSON.stringify(response.data));
//       } catch (error) {
//         console.error("Token verification failed:", error);
//         handleLogout();
//         toast.error("Invalid or expired token. Please log in again.");
//       }
//     };

//     verifyToken();
//   }, [navigate]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const updateHeaderHeight = () => {
//       if (headerRef.current) {
//         // Use getBoundingClientRect to ensure accurate height including margins
//         const height = headerRef.current.getBoundingClientRect().height;
//         setHeaderHeight(height);
//       }
//     };

//     // Initial height calculation with a slight delay to ensure DOM is fully rendered
//     const initialTimeout = setTimeout(updateHeaderHeight, 100);

//     // Use ResizeObserver to monitor header height changes
//     const observer = new ResizeObserver(updateHeaderHeight);
//     if (headerRef.current) {
//       observer.observe(headerRef.current);
//     }

//     // Update on window resize
//     window.addEventListener("resize", updateHeaderHeight);

//     return () => {
//       clearTimeout(initialTimeout);
//       observer.disconnect();
//       window.removeEventListener("resize", updateHeaderHeight);
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:5000/auth/logout");
//       localStorage.removeItem("token");
//       localStorage.removeItem("encodedUserId");
//       localStorage.removeItem("loginTime");
//       toast.success("Logged out successfully!");
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     } catch (error) {
//       console.error("Logout error:", error);
//       toast.error("Failed to log out");
//     }
//   };

//   const handleMenuSelect = (menuId) => {
//     setActiveMenu(menuId);
//     if (
//       menuId === "createReckoner" ||
//       menuId === "displayReckoner" ||
//       menuId === "materialDispatch" ||
//       menuId === "viewMaterialDispatch" ||
//       menuId === "dispatchMaster" ||
//       menuId === "employeeDetails" ||
//       menuId === "expenseDetails" ||
//       menuId === "viewCompanyProjectSite"
//     ) {
//       setSelectedCompanyId("");
//     }
//   };

//   const handleCompanySelect = (companyId) => {
//     setSelectedCompanyId(companyId);
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">
//       <div
//         ref={headerRef}
//         className="w-full bg-white shadow-md fixed top-0 left-0 z-50"
//       >
//         <div className="relative flex items-start justify-between px-4 py-4 sm:px-6 border-b border-gray-200">
//           <div className="flex-1">
//             <ServiceMenu
//               onMenuSelect={handleMenuSelect}
//               activeMenu={activeMenu}
//             />
//           </div>
          
//         </div>
//       </div>

//       <div
//         className="px-4 sm:px-6 py-6"
//         style={{ paddingTop: `${headerHeight}px`, minHeight: "100vh" }}
//       >
//         {activeMenu === "viewCompanyProjectSite" ? (
//           <SiteInformation />
//         ) : (
//           <ServicesLayout
//             activeMenu={activeMenu}
//             onCompanySelect={handleCompanySelect}
//             selectedCompanyId={selectedCompanyId}
//           />
//         )}
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//       />
//     </div>
//   );
// };

// export default AdminPage;











import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceMenu from "../../components/SathyaServices/ServicesMenu";
import SiteInformation from "../../components/SathyaServices/SiteInformation";
import ServicesLayout from "../../components/SathyaServices/ServicesLayout";
import { User, X } from "lucide-react";

const AdminPage = () => {
  const { encodedUserId } = useParams();
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard"); // Changed default to "dashboard"
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        toast.error("Please log in to access this page.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/auth/verify-token", { token });
        setUser(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error("Token verification failed:", error);
        handleLogout();
        toast.error("Invalid or expired token. Please log in again.");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isProfileOpen, setIsProfileOpen] = useState(false); // Added missing state for profile dropdown

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    const initialTimeout = setTimeout(updateHeaderHeight, 100);
    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      clearTimeout(initialTimeout);
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("encodedUserId");
      localStorage.removeItem("loginTime");
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleMenuSelect = (menuId) => {
    setActiveMenu(menuId);
    if (
      menuId === "dashboard" ||
      menuId === "createReckoner" ||
      menuId === "displayReckoner" ||
      menuId === "materialDispatch" ||
      menuId === "viewDispatchDetails" ||
      menuId === "employeeDetails" ||
      menuId === "expenseDetails" ||
      menuId === "viewCompanyProjectSite"
    ) {
      setSelectedCompanyId("");
    }
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div
        ref={headerRef}
        className="w-full bg-white shadow-md fixed top-0 left-0 z-50"
      >
        <div className="relative flex items-start justify-between px-4 py-4 sm:px-6 border-b border-gray-200">
          <div className="flex-1">
            <ServiceMenu
              onMenuSelect={handleMenuSelect}
              activeMenu={activeMenu}
            />
          </div>
     
        </div>
      </div>

      <div
        className="px-4 sm:px-6 py-6"
        style={{ paddingTop: `${headerHeight}px`, minHeight: "100vh" }}
      >
        {activeMenu === "viewCompanyProjectSite" ? (
          <SiteInformation />
        ) : (
          <ServicesLayout
            activeMenu={activeMenu}
            onCompanySelect={handleCompanySelect}
            selectedCompanyId={selectedCompanyId}
          />
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default AdminPage;