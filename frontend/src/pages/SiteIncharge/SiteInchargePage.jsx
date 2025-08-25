// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import SiteInchargeMenu from "../../components/SiteIncharge/SiteInchargeMenu";
// import ExpenseEntry from "../../components/SiteIncharge/ExpenseEntry";

// const SiteInchargePage = () => {
//   const { encodedUserId } = useParams();
//   const [user, setUser] = useState(null);
//   const [activeView, setActiveView] = useState("expenseEntry");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/");
//         toast.error("Please log in to access this page.");
//         return;
//       }

//       try {
//         const response = await axios.post("http://103.118.158.33/api/auth/verify-token", { token });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Token verification failed:", error);
//         handleLogout();
//         toast.error("Invalid or expired token. Please log in again.");
//       }
//     };

//     verifyToken();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://103.118.158.33/api/auth/logout");
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

//   const handleMenuSelect = (view) => {
//     setActiveView(view);
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
//       <div className="w-full bg-white shadow-md">
//         <div className="flex justify-between items-center px-4 py-4 sm:px-6 border-b border-gray-200">
//           <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
//             Welcome,{" "}
//             <span className="capitalize text-blue-700">{user.user_name}</span>{" "}
//             <span className="text-gray-600 text-sm font-normal">({user.user_email})</span>
//           </h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
//           >
//             Logout
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row">
//           <SiteInchargeMenu onMenuSelect={handleMenuSelect} activeMenu={activeView} />
//           <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
//             <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto border border-gray-200">
//               {activeView === "expenseEntry" && <ExpenseEntry />}
//             </div>
//           </div>
//         </div>

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           closeOnClick
//           pauseOnHover
//           draggable
//         />
//       </div>
//     </div>
//   );
// };

// export default SiteInchargePage;







import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteInchargeMenu from "../../components/SiteIncharge/SiteInchargeMenu";
import ExpenseEntry from "../../components/SiteIncharge/ExpenseEntry";
import WorkCompletionEntry from "../../components/SiteIncharge/WorkCompletionEntry";

const SiteInchargePage = () => {
  const { encodedUserId } = useParams();
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("expenseEntry");
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();
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
        const response = await axios.post("http://103.118.158.33/api/auth/verify-token", { token });
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
      await axios.post("http://103.118.158.33/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("encodedUserId");
      localStorage.removeItem("loginTime");
      toast.success("Logged out successfully!");
      sessionStorage.removeItem('user');
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleMenuSelect = (menuId) => {
    if (menuId === "logout") {
      handleLogout();
    } else {
      setActiveMenu(menuId);
    }
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
            <SiteInchargeMenu
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
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-full mx-auto border border-gray-200">
          {activeMenu === "expenseEntry" && <ExpenseEntry />}
          {activeMenu === "workCompletionEntry" && <WorkCompletionEntry />}
        </div>
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

export default SiteInchargePage;