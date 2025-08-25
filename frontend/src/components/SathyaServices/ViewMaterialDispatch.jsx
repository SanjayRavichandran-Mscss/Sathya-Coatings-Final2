// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2, Package, FileText, X } from "lucide-react";
// import DispatchReport from "./DispatchReport";

// const ViewMaterialDispatch = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [dispatchedMaterials, setDispatchedMaterials] = useState([]);
//   const [loading, setLoading] = useState({
//     projects: false,
//     sites: false,
//     materials: false,
//   });
//   const [error, setError] = useState(null);
//   const [commonDispatchDetails, setCommonDispatchDetails] = useState({
//     dc_No: "",
//     dispatch_date: "",
//     order_no: "",
//     vendor_code: "",
//     destination: "",
//     travel_expense: "",
//     vehicle_number: "",
//     driver_name: "",
//     driver_mobile: "",
//   });
//   const [showDispatchReport, setShowDispatchReport] = useState(false);

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, projects: true }));
//       const response = await axios.get("http://localhost:5000/material/projects");
//       setProjects(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to load projects. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, projects: false }));
//     }
//   };

//   // Fetch sites based on selected project
//   const fetchSites = async (pd_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, sites: true }));
//       const response = await axios.get(`http://localhost:5000/material/sites/${pd_id}`);
//       setSites(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching sites:", error);
//       setError("Failed to load sites. Please try again.");
//       setSites([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, sites: false }));
//     }
//   };

//   // Fetch dispatched materials for selected project and site
//   const fetchDispatchedMaterials = async () => {
//     if (!selectedProject || !selectedSite) return;
//     try {
//       setLoading((prev) => ({ ...prev, materials: true }));
//       setError(null);
//       const response = await axios.get("http://localhost:5000/material/dispatch-details", {
//         params: { pd_id: selectedProject, site_id: selectedSite },
//       });
//       const materials = response.data.data || [];
//       setDispatchedMaterials(materials);

//       // Set common dispatch details from the first record
//       if (materials.length > 0) {
//         const firstMaterial = materials[0];
//         setCommonDispatchDetails({
//           dc_no: firstMaterial.dc_no || "N/A",
//           dispatch_date: firstMaterial.dispatch_date
//             ? new Date(firstMaterial.dispatch_date).toLocaleDateString("en-US", { dateStyle: "medium" })
//             : "N/A",
//           order_no: firstMaterial.order_no || "N/A",
//           vendor_code: firstMaterial.vendor_code || "N/A",
//           destination: firstMaterial.transport_details?.destination || "N/A",
//           travel_expense: firstMaterial.transport_details?.travel_expense
//             ? firstMaterial.transport_details.travel_expense.toLocaleString()
//             : "N/A",
//           vehicle_number: firstMaterial.transport_details?.vehicle?.vehicle_number || "N/A",
//           driver_name: firstMaterial.transport_details?.driver?.driver_name || "N/A",
//           driver_mobile: firstMaterial.transport_details?.driver?.driver_mobile || "N/A",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching dispatched materials:", error);
//       setError(
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to load dispatched materials. Please try again."
//       );
//     } finally {
//       setLoading((prev) => ({ ...prev, materials: false }));
//     }
//   };

//   // Handle project selection
//   const handleProjectChange = async (e) => {
//     const pd_id = e.target.value;
//     setSelectedProject(pd_id);
//     setSelectedSite("");
//     setSites([]);
//     setDispatchedMaterials([]);
//     setCommonDispatchDetails({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: "",
//       destination: "",
//       travel_expense: "",
//       vehicle_number: "",
//       driver_name: "",
//       driver_mobile: "",
//     });
//     setError(null);
//     setShowDispatchReport(false);
//     if (pd_id) {
//       await fetchSites(pd_id);
//     }
//   };

//   // Handle site selection
//   const handleSiteChange = (e) => {
//     setSelectedSite(e.target.value);
//     setDispatchedMaterials([]);
//     setCommonDispatchDetails({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: "",
//       destination: "",
//       travel_expense: "",
//       vehicle_number: "",
//       driver_name: "",
//       driver_mobile: "",
//     });
//     setError(null);
//     setShowDispatchReport(false);
//   };

//   // Toggle Dispatch Report visibility
//   const handleViewDC = () => {
//     setShowDispatchReport(true);
//   };

//   // Helper function to format component ratios
//   const formatComponentRatios = (comp_ratio_a, comp_ratio_b, comp_ratio_c) => {
//     const ratios = [comp_ratio_a, comp_ratio_b];
//     if (comp_ratio_c !== null) {
//       ratios.push(comp_ratio_c);
//     }
//     return ` (${ratios.join(':')})`;
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     if (selectedProject && selectedSite) {
//       fetchDispatchedMaterials();
//     }
//   }, [selectedProject, selectedSite]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//             <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
//             Dispatched Materials
//           </h2>
//           <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
//             View details of materials dispatched to your project sites
//           </p>
//         </div>

//         {/* Project and Site Selection */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-lg">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Project</label>
//             <select
//               value={selectedProject}
//               onChange={handleProjectChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.projects}
//             >
//               <option value="">Select Project</option>
//               {projects.map((project) => (
//                 <option key={project.pd_id} value={project.pd_id}>
//                   {project.project_name || "Unknown Project"}
//                 </option>
//               ))}
//             </select>
//             {loading.projects && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Site</label>
//             <select
//               value={selectedSite}
//               onChange={handleSiteChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
//               disabled={!selectedProject || loading.sites}
//             >
//               <option value="">Select Site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {`${site.site_name || "Unknown Site"} (PO: ${site.po_number || "N/A"})`}
//                 </option>
//               ))}
//             </select>
//             {loading.sites && selectedProject && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//         </div>

//         {/* View DC Button */}
//         {dispatchedMaterials.length > 0 && (
//           <div className="mb-6 text-right">
//             <button
//               onClick={handleViewDC}
//               className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
//             >
//               View DC
//             </button>
//           </div>
//         )}

//         {/* Common Dispatch Details */}
//         {dispatchedMaterials.length > 0 && (
//           <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <p className="text-xs font-medium text-gray-600">DC No</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.dc_no}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Dispatch Date</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.dispatch_date}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Order No</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.order_no}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Vendor Code</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.vendor_code}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Destination</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.destination}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Travel Expense</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.travel_expense}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Vehicle Number</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.vehicle_number}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Driver Name</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.driver_name}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Driver Mobile</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.driver_mobile}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
//             <div className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
//               <span>{error}</span>
//             </div>
//             <button
//               onClick={() => setError(null)}
//               className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
//               aria-label="Close error message"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading.materials ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
//               <p className="text-gray-600 text-lg font-medium">Loading dispatched materials...</p>
//             </div>
//           </div>
//         ) : !selectedProject || !selectedSite ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">Please select a project and site.</p>
//           </div>
//         ) : dispatchedMaterials.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">No dispatched materials found for this project and site.</p>
//             <p className="text-gray-500 mt-2">Dispatch materials to this project and site to see them listed here.</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         #
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Material Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Quantity & UOM
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Dispatched Quantities
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Remarks
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {dispatchedMaterials.map((dispatch, index) => (
//                       <tr
//                         key={dispatch.id}
//                         className="hover:bg-teal-50 transition-colors duration-200"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <p className="font-medium">
//                             {dispatch.item_name || "N/A"}{formatComponentRatios(dispatch.comp_ratio_a, dispatch.comp_ratio_b, dispatch.comp_ratio_c)}
//                           </p>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <p>
//                             {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"} {dispatch.uom_name || ""}
//                           </p>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-1">
//                             {dispatch.comp_a_qty !== null && (
//                               <p className="text-sm">
//                                 Component A: {dispatch.comp_a_qty}
//                               </p>
//                             )}
//                             {dispatch.comp_b_qty !== null && (
//                               <p className="text-sm">
//                                 Component B: {dispatch.comp_b_qty}
//                               </p>
//                             )}
//                             {dispatch.comp_c_qty !== null && (
//                               <p className="text-sm">
//                                 Component C: {dispatch.comp_c_qty}
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-1">
//                             {dispatch.comp_a_remarks && (
//                               <p className="text-sm">
//                                 <span className="font-medium">A:</span> {dispatch.comp_a_remarks}
//                               </p>
//                             )}
//                             {dispatch.comp_b_remarks && (
//                               <p className="text-sm">
//                                 <span className="font-medium">B:</span> {dispatch.comp_b_remarks}
//                               </p>
//                             )}
//                             {dispatch.comp_c_remarks && (
//                               <p className="text-sm">
//                                 <span className="font-medium">C:</span> {dispatch.comp_c_remarks}
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-6">
//               {dispatchedMaterials.map((dispatch, index) => (
//                 <div
//                   key={dispatch.id}
//                   className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
//                 >
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700 Ascending: true">Material Name</p>
//                       <p className="text-sm text-gray-600">
//                         {dispatch.item_name || "N/A"}{formatComponentRatios(dispatch.comp_ratio_a, dispatch.comp_ratio_b, dispatch.comp_ratio_c)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
//                       <p className="text-sm text-gray-600">
//                         {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"} {dispatch.uom_name || ""}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Dispatched Quantities</p>
//                       <div className="space-y-1">
//                         {dispatch.comp_a_qty !== null && (
//                           <p className="text-sm text-gray-600">
//                             Component A: {dispatch.comp_a_qty}
//                           </p>
//                         )}
//                         {dispatch.comp_b_qty !== null && (
//                           <p className="text-sm text-gray-600">
//                             Component B: {dispatch.comp_b_qty}
//                           </p>
//                         )}
//                         {dispatch.comp_c_qty !== null && (
//                           <p className="text-sm text-gray-600">
//                             Component C: {dispatch.comp_c_qty}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Remarks</p>
//                       <div className="space-y-1">
//                         {dispatch.comp_a_remarks && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">A:</span> {dispatch.comp_a_remarks}
//                           </p>
//                         )}
//                         {dispatch.comp_b_remarks && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">B:</span> {dispatch.comp_b_remarks}
//                           </p>
//                         )}
//                         {dispatch.comp_c_remarks && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">C:</span> {dispatch.comp_c_remarks}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Dispatch Report */}
//             {showDispatchReport && (
//               <DispatchReport
//                 commonDispatchDetails={commonDispatchDetails}
//                 dispatchedMaterials={dispatchedMaterials}
//               />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewMaterialDispatch;























import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Package, FileText, X } from "lucide-react";
import DispatchReport from "./DispatchReport";

const ViewMaterialDispatch = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [dispatchedMaterials, setDispatchedMaterials] = useState([]);
  const [loading, setLoading] = useState({
    projects: false,
    sites: false,
    materials: false,
  });
  const [error, setError] = useState(null);
  const [commonDispatchDetails, setCommonDispatchDetails] = useState({
    dc_no: "",
    dispatch_date: "",
    order_no: "",
    vendor_code: "",
    gst_number: "", // Added gst_number
    order_date: "", // Added order_date
    destination: "",
    travel_expense: "",
    vehicle_number: "",
    driver_name: "",
    driver_mobile: "",
  });
  const [showDispatchReport, setShowDispatchReport] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://localhost:5000/material/projects");
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Fetch sites based on selected project
  const fetchSites = async (pd_id) => {
    try {
      setLoading((prev) => ({ ...prev, sites: true }));
      const response = await axios.get(`http://localhost:5000/material/sites/${pd_id}`);
      setSites(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load sites. Please try again.");
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch dispatched materials for selected project and site
  const fetchDispatchedMaterials = async () => {
    if (!selectedProject || !selectedSite) return;
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      setError(null);
      const response = await axios.get("http://localhost:5000/material/dispatch-details", {
        params: { pd_id: selectedProject, site_id: selectedSite },
      });
      const materials = response.data.data || [];
      setDispatchedMaterials(materials);

      // Set common dispatch details from the first record
      if (materials.length > 0) {
        const firstMaterial = materials[0];
        setCommonDispatchDetails({
          dc_no: firstMaterial.dc_no || "N/A",
          dispatch_date: firstMaterial.dispatch_date
            ? new Date(firstMaterial.dispatch_date).toLocaleDateString("en-US", { dateStyle: "medium" })
            : "N/A",
          order_no: firstMaterial.order_no || "N/A",
          vendor_code: firstMaterial.vendor_code || "N/A",
          gst_number: firstMaterial.gst_number || "N/A", // Added gst_number
          order_date: firstMaterial.order_date
            ? new Date(firstMaterial.order_date).toLocaleDateString("en-US", { dateStyle: "medium" })
            : "N/A", // Added order_date
          destination: firstMaterial.transport_details?.destination || "N/A",
          travel_expense: firstMaterial.transport_details?.travel_expense
            ? firstMaterial.transport_details.travel_expense.toLocaleString()
            : "N/A",
          vehicle_number: firstMaterial.transport_details?.vehicle?.vehicle_number || "N/A",
          driver_name: firstMaterial.transport_details?.driver?.driver_name || "N/A",
          driver_mobile: firstMaterial.transport_details?.driver?.driver_mobile || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching dispatched materials:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to load dispatched materials. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Handle project selection
  const handleProjectChange = async (e) => {
    const pd_id = e.target.value;
    setSelectedProject(pd_id);
    setSelectedSite("");
    setSites([]);
    setDispatchedMaterials([]);
    setCommonDispatchDetails({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: "",
      gst_number: "", // Added gst_number
      order_date: "", // Added order_date
      destination: "",
      travel_expense: "",
      vehicle_number: "",
      driver_name: "",
      driver_mobile: "",
    });
    setError(null);
    setShowDispatchReport(false);
    if (pd_id) {
      await fetchSites(pd_id);
    }
  };

  // Handle site selection
  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setDispatchedMaterials([]);
    setCommonDispatchDetails({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: "",
      gst_number: "", // Added gst_number
      order_date: "", // Added order_date
      destination: "",
      travel_expense: "",
      vehicle_number: "",
      driver_name: "",
      driver_mobile: "",
    });
    setError(null);
    setShowDispatchReport(false);
  };

  // Toggle Dispatch Report visibility
  const handleViewDC = () => {
    setShowDispatchReport(true);
  };

  // Helper function to format component ratios
  const formatComponentRatios = (comp_ratio_a, comp_ratio_b, comp_ratio_c) => {
    const ratios = [comp_ratio_a, comp_ratio_b];
    if (comp_ratio_c !== null) {
      ratios.push(comp_ratio_c);
    }
    return ` (${ratios.join(':')})`;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      fetchDispatchedMaterials();
    }
  }, [selectedProject, selectedSite]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Dispatched Materials
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            View details of materials dispatched to your project sites
          </p>
        </div>

        {/* Project and Site Selection */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Project</label>
            <select
              value={selectedProject}
              onChange={handleProjectChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.projects}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.pd_id} value={project.pd_id}>
                  {project.project_name || "Unknown Project"}
                </option>
              ))}
            </select>
            {loading.projects && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Site</label>
            <select
              value={selectedSite}
              onChange={handleSiteChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
              disabled={!selectedProject || loading.sites}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {`${site.site_name || "Unknown Site"} (PO: ${site.po_number || "N/A"})`}
                </option>
              ))}
            </select>
            {loading.sites && selectedProject && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
        </div>

        {/* View DC Button */}
        {dispatchedMaterials.length > 0 && (
          <div className="mb-6 text-right">
            <button
              onClick={handleViewDC}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            >
              View DC
            </button>
          </div>
        )}

        {/* Common Dispatch Details */}
        {dispatchedMaterials.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600">DC No</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.dc_no}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Dispatch Date</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.dispatch_date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Order No</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.order_no}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Vendor Code / GSTIN</p>
                <p className="text-sm text-gray-900">
                  {commonDispatchDetails.vendor_code} {commonDispatchDetails.gst_number !== "N/A" ? `/ ${commonDispatchDetails.gst_number}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Order Date</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.order_date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Destination</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.destination}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Travel Expense</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.travel_expense}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Vehicle Number</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.vehicle_number}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Driver Name</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.driver_name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Driver Mobile</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.driver_mobile}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
              aria-label="Close error message"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading.materials ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">Loading dispatched materials...</p>
            </div>
          </div>
        ) : !selectedProject || !selectedSite ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">Please select a project and site.</p>
          </div>
        ) : dispatchedMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">No dispatched materials found for this project and site.</p>
            <p className="text-gray-500 mt-2">Dispatch materials to this project and site to see them listed here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Material Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Quantity & UOM
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Dispatched Quantities
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dispatchedMaterials.map((dispatch, index) => (
                      <tr
                        key={dispatch.id}
                        className="hover:bg-teal-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <p className="font-medium">
                            {dispatch.item_name || "N/A"}{formatComponentRatios(dispatch.comp_ratio_a, dispatch.comp_ratio_b, dispatch.comp_ratio_c)}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <p>
                            {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"} {dispatch.uom_name || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            {dispatch.comp_a_qty !== null && (
                              <p className="text-sm">
                                Component A: {dispatch.comp_a_qty}
                              </p>
                            )}
                            {dispatch.comp_b_qty !== null && (
                              <p className="text-sm">
                                Component B: {dispatch.comp_b_qty}
                              </p>
                            )}
                            {dispatch.comp_c_qty !== null && (
                              <p className="text-sm">
                                Component C: {dispatch.comp_c_qty}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            {dispatch.comp_a_remarks && (
                              <p className="text-sm">
                                <span className="font-medium">A:</span> {dispatch.comp_a_remarks}
                              </p>
                            )}
                            {dispatch.comp_b_remarks && (
                              <p className="text-sm">
                                <span className="font-medium">B:</span> {dispatch.comp_b_remarks}
                              </p>
                            )}
                            {dispatch.comp_c_remarks && (
                              <p className="text-sm">
                                <span className="font-medium">C:</span> {dispatch.comp_c_remarks}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {dispatchedMaterials.map((dispatch, index) => (
                <div
                  key={dispatch.id}
                  className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Material Name</p>
                      <p className="text-sm text-gray-600">
                        {dispatch.item_name || "N/A"}{formatComponentRatios(dispatch.comp_ratio_a, dispatch.comp_ratio_b, dispatch.comp_ratio_c)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
                      <p className="text-sm text-gray-600">
                        {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"} {dispatch.uom_name || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dispatched Quantities</p>
                      <div className="space-y-1">
                        {dispatch.comp_a_qty !== null && (
                          <p className="text-sm text-gray-600">
                            Component A: {dispatch.comp_a_qty}
                          </p>
                        )}
                        {dispatch.comp_b_qty !== null && (
                          <p className="text-sm text-gray-600">
                            Component B: {dispatch.comp_b_qty}
                          </p>
                        )}
                        {dispatch.comp_c_qty !== null && (
                          <p className="text-sm text-gray-600">
                            Component C: {dispatch.comp_c_qty}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Remarks</p>
                      <div className="space-y-1">
                        {dispatch.comp_a_remarks && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">A:</span> {dispatch.comp_a_remarks}
                          </p>
                        )}
                        {dispatch.comp_b_remarks && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">B:</span> {dispatch.comp_b_remarks}
                          </p>
                        )}
                        {dispatch.comp_c_remarks && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">C:</span> {dispatch.comp_c_remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dispatch Report */}
            {showDispatchReport && (
              <DispatchReport
                commonDispatchDetails={commonDispatchDetails}
                dispatchedMaterials={dispatchedMaterials}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewMaterialDispatch;