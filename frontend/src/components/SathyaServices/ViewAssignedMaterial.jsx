// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Loader2, Package, FileText, X, Truck, ChevronDown } from "lucide-react";
// import Swal from "sweetalert2";

// const SearchableDropdown = ({ options, selectedValue, onSelect, placeholder, searchKeys, label, disabled, loading, allowNew, onNewEntryChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         if (allowNew && searchQuery && !options.some(opt => opt.id === searchQuery)) {
//           onSelect(searchQuery);
//         }
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [searchQuery, options, onSelect, allowNew]);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     if (allowNew && value) {
//       onSelect(value);
//       if (onNewEntryChange) {
//         onNewEntryChange(value);
//       }
//     }
//   };

//   const filteredOptions = options.filter((option) =>
//     searchKeys.some((key) =>
//       option[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const handleSelect = (value) => {
//     onSelect(value);
//     setIsOpen(false);
//     setSearchQuery("");
//   };

//   const selectedOption = options.find((option) => option.id === selectedValue);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {isOpen ? (
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="flex items-center px-3 py-2 border-b border-gray-200">
//             <input
//               type="text"
//               autoFocus
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder={`Search ${placeholder.toLowerCase()}...`}
//               className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
//             />
//             <button
//               onClick={() => {
//                 setIsOpen(false);
//                 if (allowNew && searchQuery && !options.some(opt => opt.id === searchQuery)) {
//                   onSelect(searchQuery);
//                 }
//               }}
//               className="ml-2 text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//           <div className="max-h-60 overflow-y-auto">
//             {loading ? (
//               <div className="px-4 py-3 text-gray-500 text-sm flex items-center">
//                 <Loader2 className="h-4 w-4 text-teal-500 animate-spin mr-2" />
//                 Loading {placeholder.toLowerCase()}...
//               </div>
//             ) : filteredOptions.length === 0 && !allowNew ? (
//               <div className="px-4 py-3 text-gray-500 text-sm">
//                 No matching {placeholder.toLowerCase()} found
//               </div>
//             ) : (
//               filteredOptions.map((option) => (
//                 <div
//                   key={option.id}
//                   onClick={() => handleSelect(option.id)}
//                   className={`px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors ${
//                     selectedValue === option.id ? "bg-teal-100 text-teal-800" : "text-gray-700"
//                   }`}
//                 >
//                   <div className="font-medium">{option[searchKeys[0]]}</div>
//                   {searchKeys[1] && (
//                     <div className="text-xs text-gray-500">{option[searchKeys[1]]}</div>
//                   )}
//                 </div>
//               ))
//             )}
//             {allowNew && searchQuery && !filteredOptions.some(opt => opt[searchKeys[0]]?.toLowerCase() === searchQuery.toLowerCase()) && (
//               <div
//                 onClick={() => handleSelect(searchQuery)}
//                 className="px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors text-gray-700"
//               >
//                 <div className="font-medium">Add "{searchQuery}"</div>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => !disabled && setIsOpen(true)}
//           className={`w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
//             disabled ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={disabled}
//         >
//           <div>
//             {selectedOption ? (
//               <>
//                 <div className="font-medium text-gray-900 text-sm">
//                   {selectedOption[searchKeys[0]]}
//                 </div>
//                 {searchKeys[1] && (
//                   <div className="text-xs text-gray-500">{selectedOption[searchKeys[1]]}</div>
//                 )}
//               </>
//             ) : selectedValue && allowNew ? (
//               <div className="font-medium text-gray-900 text-sm">{selectedValue}</div>
//             ) : (
//               <span className="text-gray-500 text-sm">{placeholder}</span>
//             )}
//           </div>
//           <ChevronDown className="h-5 w-5 text-gray-400" />
//         </button>
//       )}
//     </div>
//   );
// };

// const ViewAssignedMaterial = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [assignedMaterials, setAssignedMaterials] = useState([]);
//   const [groupedMaterials, setGroupedMaterials] = useState({});
//   const [loading, setLoading] = useState({
//     projects: false,
//     sites: false,
//     materials: false,
//     transportTypes: false,
//     providers: false,
//     vehicles: false,
//     drivers: false,
//     submitting: false,
//   });
//   const [error, setError] = useState(null);
//   const [dispatchData, setDispatchData] = useState({
//     dc_no: "",
//     dispatch_date: "",
//     order_no: "",
//     vendor_code: "",
//   });
//   const [transportData, setTransportData] = useState({
//     transport_type_id: "",
//     provider_id: "",
//     vehicle_id: "",
//     driver_id: "",
//     destination: "",
//     booking_expense: "",
//     travel_expense: "",
//   });
//   const [newEntryData, setNewEntryData] = useState({
//     vehicle_model: "",
//     vehicle_number: "",
//     driver_mobile: "",
//     driver_address: "",
//     provider_address: "",
//     provider_mobile: "",
//   });
//   const [transportTypes, setTransportTypes] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [calculatedQuantities, setCalculatedQuantities] = useState({});
//   const [remarks, setRemarks] = useState({});
//   const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, projects: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/projects");
//       setProjects(response.data.data || []);
//       if (response.data.data.length > 0 && !selectedProject) {
//         setSelectedProject(response.data.data[0].pd_id);
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to load projects. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, projects: false }));
//     }
//   };

//   // Fetch sites
//   const fetchSites = async (pd_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, sites: true }));
//       const response = await axios.get(`http://103.118.158.33/api/material/sites/${pd_id}`);
//       setSites(response.data.data || []);
//       if (response.data.data.length > 0 && !selectedSite) {
//         setSelectedSite(response.data.data[0].site_id);
//         setDispatchData((prev) => ({
//           ...prev,
//           order_no: response.data.data[0].po_number || "",
//         }));
//       }
//       // Set vendor_code based on selected project
//       const selectedProjectData = projects.find((project) => project.pd_id === pd_id);
//       if (selectedProjectData) {
//         setDispatchData((prev) => ({
//           ...prev,
//           vendor_code: selectedProjectData.vendor_code || "",
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching sites:", error);
//       setError("Failed to load sites. Please try again.");
//       setSites([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, sites: false }));
//     }
//   };

//   // Fetch transport types
//   const fetchTransportTypes = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, transportTypes: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/transport-types");
//       setTransportTypes(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching transport types:", error);
//       setError("Failed to load transport types. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, transportTypes: false }));
//     }
//   };

//   // Fetch providers
//   const fetchProviders = async (transport_type_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, providers: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/providers", {
//         params: { transport_type_id: Number.isInteger(parseInt(transport_type_id)) ? transport_type_id : undefined },
//       });
//       setProviders(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching providers:", error);
//       setError("Failed to load providers. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, providers: false }));
//     }
//   };

//   // Fetch vehicles
//   const fetchVehicles = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, vehicles: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/vehicles");
//       setVehicles(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching vehicles:", error);
//       setError("Failed to load vehicles. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, vehicles: false }));
//     }
//   };

//   // Fetch drivers
//   const fetchDrivers = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, drivers: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/drivers");
//       setDrivers(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching drivers:", error);
//       setError("Failed to load drivers. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, drivers: false }));
//     }
//   };

//   // Fetch assigned materials
//   const fetchAssignedMaterials = async () => {
//     if (!selectedProject || !selectedSite) return;
//     try {
//       setLoading((prev) => ({ ...prev, materials: true }));
//       setError(null);
//       const response = await axios.get("http://103.118.158.33/api/material/assignments-with-dispatch", {
//         params: { pd_id: selectedProject, site_id: selectedSite },
//       });
//       const materials = response.data.data || [];
//       setAssignedMaterials(materials);

//       // Group materials by desc_id
//       const grouped = materials.reduce((acc, item) => {
//         const key = item.desc_id || "unknown";
//         if (!acc[key]) {
//           acc[key] = { desc_name: item.desc_name || "Unknown Description", items: [] };
//         }
//         acc[key].items.push(item);
//         return acc;
//       }, {});
//       setGroupedMaterials(grouped);

//       // Initialize quantities and remarks
//       const newQuantities = {};
//       const newRemarks = {};
//       materials.forEach((assignment) => {
//         const totalRatio =
//           (assignment.comp_ratio_a || 0) +
//           (assignment.comp_ratio_b || 0) +
//           (assignment.comp_ratio_c || 0);
//         newQuantities[assignment.id] = {
//           comp_a_qty:
//             totalRatio && assignment.comp_ratio_a !== null
//               ? Math.round((assignment.comp_ratio_a / totalRatio) * assignment.quantity)
//               : null,
//           comp_b_qty:
//             totalRatio && assignment.comp_ratio_b !== null
//               ? Math.round((assignment.comp_ratio_b / totalRatio) * assignment.quantity)
//               : null,
//           comp_c_qty:
//             totalRatio && assignment.comp_ratio_c !== null
//               ? Math.round((assignment.comp_ratio_c / totalRatio) * assignment.quantity)
//               : null,
//         };
//         newRemarks[assignment.id] = {
//           comp_a_remarks: "",
//           comp_b_remarks: "",
//           comp_c_remarks: "",
//         };
//       });
//       setCalculatedQuantities(newQuantities);
//       setRemarks(newRemarks);
//     } catch (error) {
//       console.error("Error fetching material assignments:", error);
//       setError(
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to load material assignments. Please try again."
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
//     setAssignedMaterials([]);
//     setGroupedMaterials({});
//     setCalculatedQuantities({});
//     setRemarks({});
//     setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
//     setTransportData({
//       transport_type_id: "",
//       provider_id: "",
//       vehicle_id: "",
//       driver_id: "",
//       destination: "",
//       booking_expense: "",
//       travel_expense: "",
//     });
//     setNewEntryData({
//       vehicle_model: "",
//       vehicle_number: "",
//       driver_mobile: "",
//       driver_address: "",
//       provider_address: "",
//       provider_mobile: "",
//     });
//     setError(null);
//     setIsTransportModalOpen(false);
//     if (pd_id) {
//       await fetchSites(pd_id);
//     }
//   };

//   // Handle site selection
//   const handleSiteChange = (e) => {
//     const site_id = e.target.value;
//     setSelectedSite(site_id);
//     setAssignedMaterials([]);
//     setGroupedMaterials({});
//     setCalculatedQuantities({});
//     setRemarks({});
//     const selectedSiteData = sites.find((site) => site.site_id === site_id);
//     setDispatchData((prev) => ({
//       ...prev,
//       order_no: selectedSiteData ? selectedSiteData.po_number || "" : "",
//     }));
//     setTransportData({
//       transport_type_id: "",
//       provider_id: "",
//       vehicle_id: "",
//       driver_id: "",
//       destination: "",
//       booking_expense: "",
//       travel_expense: "",
//     });
//     setNewEntryData({
//       vehicle_model: "",
//       vehicle_number: "",
//       driver_mobile: "",
//       driver_address: "",
//       provider_address: "",
//       provider_mobile: "",
//     });
//     setError(null);
//     setIsTransportModalOpen(false);
//   };

//   // Handle dispatch form input changes
//   const handleDispatchChange = (field, value) => {
//     setDispatchData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle transport form input changes
//   const handleTransportChange = (field, value) => {
//     setTransportData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     if (field === "transport_type_id") {
//       setProviders([]);
//       setTransportData((prev) => ({
//         ...prev,
//         provider_id: "",
//         vehicle_id: "",
//         driver_id: "",
//         destination: "",
//         booking_expense: "",
//         travel_expense: "",
//       }));
//       setNewEntryData({
//         vehicle_model: "",
//         vehicle_number: "",
//         driver_mobile: "",
//         driver_address: "",
//         provider_address: "",
//         provider_mobile: "",
//       });
//       if (value && Number.isInteger(parseInt(value))) {
//         fetchProviders(value);
//       }
//     }
//   };

//   // Handle new entry input changes
//   const handleNewEntryChange = (field, value) => {
//     setNewEntryData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle new entry for searchable dropdowns
//   const handleNewEntryDropdown = (field, value) => {
//     if (field === "vehicle_id") {
//       setNewEntryData((prev) => ({
//         ...prev,
//         vehicle_model: value,
//         vehicle_number: "",
//       }));
//     } else if (field === "driver_id") {
//       setNewEntryData((prev) => ({
//         ...prev,
//         driver_mobile: "",
//         driver_address: "",
//       }));
//     } else if (field === "provider_id") {
//       setNewEntryData((prev) => ({
//         ...prev,
//         provider_address: "",
//         provider_mobile: "",
//       }));
//     }
//   };

//   // Handle quantity input changes
//   const handleQuantityChange = (assignmentId, field, value) => {
//     setCalculatedQuantities((prev) => ({
//       ...prev,
//       [assignmentId]: {
//         ...prev[assignmentId],
//         [field]: value ? parseInt(value) : null,
//       },
//     }));
//   };

//   // Handle remarks input changes
//   const handleRemarksChange = (assignmentId, field, value) => {
//     setRemarks((prev) => ({
//       ...prev,
//       [assignmentId]: {
//         ...prev[assignmentId],
//         [field]: value,
//       },
//     }));
//   };

//   // Validate dispatch and remarks for enabling Dispatch button
//   const isDispatchEnabled = () => {
//     if (!dispatchData.dc_no || !dispatchData.dispatch_date || !dispatchData.order_no || !dispatchData.vendor_code) {
//       return false;
//     }
//     for (const assignment of assignedMaterials) {
//       const assignmentId = assignment.id;
//       const quantities = calculatedQuantities[assignmentId];
//       const assignmentRemarks = remarks[assignmentId];
//       if (quantities?.comp_a_qty !== null && !assignmentRemarks?.comp_a_remarks) {
//         return false;
//       }
//       if (quantities?.comp_b_qty !== null && !assignmentRemarks?.comp_b_remarks) {
//         return false;
//       }
//       if (quantities?.comp_c_qty !== null && !assignmentRemarks?.comp_c_remarks) {
//         return false;
//       }
//     }
//     return true;
//   };

//   // Handle dispatch form submission
//   const handleDispatchSubmit = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, submitting: true }));
//       setError(null);

//       // Validate transport fields
//       const requiredFields = [
//         transportData.transport_type_id,
//         transportData.provider_id,
//         transportData.vehicle_id,
//         transportData.driver_id,
//         transportData.destination,
//         transportData.travel_expense,
//       ];
//       if (transportData.transport_type_id === "2") {
//         requiredFields.push(transportData.booking_expense);
//       }
//       if (requiredFields.some((field) => !field)) {
//         setError("Please fill all required transport fields.");
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Please fill all required transport fields",
//           showConfirmButton: false,
//           timer: 1500,
//           toast: true,
//         });
//         return;
//       }

//       // Prepare dispatch payload
//       const dispatchPayload = assignedMaterials
//         .filter((assignment) => assignment.dispatch_status === "not-dispatched")
//         .map((assignment) => ({
//           material_assign_id: assignment.id,
//           desc_id: assignment.desc_id,
//           dc_no: parseInt(dispatchData.dc_no),
//           dispatch_date: dispatchData.dispatch_date,
//           order_no: dispatchData.order_no,
//           vendor_code: dispatchData.vendor_code,
//           comp_a_qty: calculatedQuantities[assignment.id]?.comp_a_qty || null,
//           comp_b_qty: calculatedQuantities[assignment.id]?.comp_b_qty || null,
//           comp_c_qty: calculatedQuantities[assignment.id]?.comp_c_qty || null,
//           comp_a_remarks: calculatedQuantities[assignment.id]?.comp_a_qty !== null ? remarks[assignment.id]?.comp_a_remarks || null : null,
//           comp_b_remarks: calculatedQuantities[assignment.id]?.comp_b_qty !== null ? remarks[assignment.id]?.comp_b_remarks || null : null,
//           comp_c_remarks: calculatedQuantities[assignment.id]?.comp_c_qty !== null ? remarks[assignment.id]?.comp_c_remarks || null : null,
//         }));

//       // Prepare transport payload
//       const transportPayload = {
//         transport_type_id: parseInt(transportData.transport_type_id),
//         provider_id: transportData.provider_id,
//         vehicle_id: transportData.vehicle_id,
//         driver_id: transportData.driver_id,
//         destination: transportData.destination,
//         booking_expense: transportData.booking_expense ? parseFloat(transportData.booking_expense) : null,
//         travel_expense: parseFloat(transportData.travel_expense),
//         provider_address: newEntryData.provider_address || null,
//         provider_mobile: newEntryData.provider_mobile || null,
//         vehicle_model: newEntryData.vehicle_model || null,
//         vehicle_number: newEntryData.vehicle_number || null,
//         driver_mobile: newEntryData.driver_mobile || null,
//         driver_address: newEntryData.driver_address || null,
//       };

//       // Combine payloads
//       const payload = {
//         assignments: dispatchPayload,
//         transport: transportPayload,
//       };

//       // Submit combined payload
//       const response = await axios.post("http://103.118.158.33/api/material/add-dispatch", payload);

//       if (response.data.status === "already_dispatched") {
//         const conflicts = response.data.conflicts
//           .map((conflict) => `Material: ${conflict.item_name} (ID: ${conflict.material_assign_id})`)
//           .join(", ");
//         setError(`Cannot dispatch the following materials as they have already been dispatched: ${conflicts}`);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Some materials have already been dispatched",
//           text: conflicts,
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//         return;
//       }

//       // Show success toast
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Materials dispatched and transport details saved successfully!",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//         background: "#ecfdf5",
//         iconColor: "#10b981",
//       });

//       // Reset form and close modal
//       setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
//       setTransportData({
//         transport_type_id: "",
//         provider_id: "",
//         vehicle_id: "",
//         driver_id: "",
//         destination: "",
//         booking_expense: "",
//         travel_expense: "",
//       });
//       setNewEntryData({
//         vehicle_model: "",
//         vehicle_number: "",
//         driver_mobile: "",
//         driver_address: "",
//         provider_address: "",
//         provider_mobile: "",
//       });
//       setCalculatedQuantities({});
//       setRemarks({});
//       setIsTransportModalOpen(false);
//       await fetchAssignedMaterials();
//       await fetchTransportTypes();
//       await fetchVehicles();
//       await fetchDrivers();
//       if (Number.isInteger(parseInt(transportData.transport_type_id))) {
//         await fetchProviders(transportData.transport_type_id);
//       }
//     } catch (error) {
//       console.error("Error dispatching materials or saving transport:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to dispatch materials or save transport details. Please try again.";
//       setError(errorMessage);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: errorMessage,
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, submitting: false }));
//     }
//   };

//   // Helper function to format ratio string
//   const getRatioString = (assignment) => {
//     const ratios = [];
//     if (assignment.comp_ratio_a !== null) ratios.push(assignment.comp_ratio_a);
//     if (assignment.comp_ratio_b !== null) ratios.push(assignment.comp_ratio_b);
//     if (assignment.comp_ratio_c !== null) ratios.push(assignment.comp_ratio_c);
//     return ratios.length > 0 ? `(${ratios.join(":")})` : "";
//   };

//   // Effect hooks
//   useEffect(() => {
//     fetchProjects();
//     fetchTransportTypes();
//     fetchVehicles();
//     fetchDrivers();
//   }, []);

//   useEffect(() => {
//     if (selectedProject) {
//       fetchSites(selectedProject);
//     }
//   }, [selectedProject]);

//   useEffect(() => {
//     if (selectedProject && selectedSite) {
//       fetchAssignedMaterials();
//     }
//   }, [selectedProject, selectedSite]);

//   useEffect(() => {
//     if (transportData.transport_type_id && Number.isInteger(parseInt(transportData.transport_type_id))) {
//       fetchProviders(transportData.transport_type_id);
//     } else {
//       setProviders([]);
//       setTransportData((prev) => ({
//         ...prev,
//         provider_id: "",
//         vehicle_id: "",
//         driver_id: "",
//         destination: "",
//         booking_expense: "",
//         travel_expense: "",
//       }));
//     }
//   }, [transportData.transport_type_id]);

//   // Determine if the selected transport type is 'own' (id 1)
//   const isOwnVehicle = transportData.transport_type_id === "1";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//             <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
//             Material Dispatch
//           </h2>
//           <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
//             Dispatch non-dispatched materials to your project sites
//           </p>
//         </div>

//         {/* Project and Site Selection */}
//         <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="project">
//               Select Project
//             </label>
//             <select
//               id="project"
//               value={selectedProject}
//               onChange={handleProjectChange}
//               className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.projects}
//             >
//               <option value="">Select Project</option>
//               {projects.map((project) => (
//                 <option key={project.pd_id} value={project.pd_id}>
//                   {project.project_name || "Unknown Project"}
//                 </option>
//               ))}
//             </select>
//             {loading.projects && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="site">
//               Select Site
//             </label>
//             <select
//               id="site"
//               value={selectedSite}
//               onChange={handleSiteChange}
//               className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.sites || !selectedProject}
//             >
//               <option value="">Select Site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {site.site_name} (PO: {site.po_number})
//                 </option>
//               ))}
//             </select>
//             {loading.sites && selectedProject && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//           </div>
//         </div>

//         {/* Dispatch Details */}
//         {selectedProject && selectedSite && (
//           <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <div className="w-full sm:w-1/4">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="dc_no">
//                   DC No <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="dc_no"
//                   placeholder="Enter DC No"
//                   value={dispatchData.dc_no}
//                   onChange={(e) => handleDispatchChange("dc_no", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//               <div className="w-full sm:w-1/4">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="dispatch_date">
//                   Dispatch Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="dispatch_date"
//                   value={dispatchData.dispatch_date}
//                   onChange={(e) => handleDispatchChange("dispatch_date", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//               <div className="w-full sm:w-1/4">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="order_no">
//                   Order No <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
//                   {dispatchData.order_no || "N/A"}
//                 </div>
//               </div>
//               <div className="w-full sm:w-1/4">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="vendor_code">
//                   Vendor Code <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
//                   {dispatchData.vendor_code || "N/A"}
//                 </div>
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
//               <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
//             </div>
//           </div>
//         ) : !selectedProject || !selectedSite ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">Please select a project and site.</p>
//           </div>
//         ) : Object.keys(groupedMaterials).length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">No non-dispatched material assignments found for this project and site.</p>
//             <p className="text-gray-500 mt-2">Assign materials to this project and site to dispatch them.</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop View with Accordions */}
//             <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
//               {Object.entries(groupedMaterials).map(([desc_id, group]) => (
//                 <details key={desc_id} open className="mb-4 border-b border-gray-200">
//                   <summary className="px-6 py-4 bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer flex justify-between items-center">
//                     <span>Work Description: {group.desc_name}</span>
//                   </summary>
//                   <div className="p-4 overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//                         <tr>
//                           <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">#</th>
//                           <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Material Details</th>
//                           <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Quantity & UOM</th>
//                           <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Component Quantities</th>
//                           <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Remarks</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {group.items
//                           .filter((assignment) => assignment.dispatch_status === "not-dispatched")
//                           .map((assignment, index) => (
//                             <tr key={assignment.id} className="hover:bg-teal-50 transition-colors duration-200">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                 <div className="space-y-1">
//                                   <p className="font-medium">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                 <div className="space-y-1">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
//                                     {assignment.quantity || "N/A"} | {assignment.uom_name || "N/A"}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                 <div className="space-y-3">
//                                   {assignment.comp_ratio_a !== null && (
//                                     <div className="grid grid-cols-12 gap-2 items-center">
//                                       <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">Comp A:</label>
//                                       <div className="col-span-9">
//                                         <input
//                                           type="number"
//                                           value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
//                                           onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
//                                           className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                           placeholder="Qty"
//                                           min="0"
//                                         />
//                                       </div>
//                                     </div>
//                                   )}
//                                   {assignment.comp_ratio_b !== null && (
//                                     <div className="grid grid-cols-12 gap-2 items-center">
//                                       <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">Comp B:</label>
//                                       <div className="col-span-9">
//                                         <input
//                                           type="number"
//                                           value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
//                                           onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
//                                           className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                           placeholder="Qty"
//                                           min="0"
//                                         />
//                                       </div>
//                                     </div>
//                                   )}
//                                   {assignment.comp_ratio_c !== null && (
//                                     <div className="grid grid-cols-12 gap-2 items-center">
//                                       <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">Comp C:</label>
//                                       <div className="col-span-9">
//                                         <input
//                                           type="number"
//                                           value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
//                                           onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
//                                           className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                           placeholder="Qty"
//                                           min="0"
//                                         />
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                 <div className="space-y-3">
//                                   {assignment.comp_ratio_a !== null && (
//                                     <div className="grid grid-cols-12 gap-2 items-center">
//                                       <div className="col-span-9">
//                                         <input
//                                           type="text"
//                                           value={remarks[assignment.id]?.comp_a_remarks ?? ""}
//                                           onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
//                                           className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                           placeholder="Remarks for Component A"
//                                           required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
//                                         />
//                                       </div>
//                                     </div>
//                                   )}
//                                   {assignment.comp_ratio_b !== null && (
//                                     <div className="grid grid-cols-12 gap-2 items-center">
//                                       <div className="col-span-9">
//                                         <input
//                                           type="text"
//                                           value={remarks[assignment.id]?.comp_b_remarks ?? ""}
//                                           onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
//                                           className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                           placeholder="Remarks for Component B"
//                                           required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
//                                         />
//                                       </div>
//                                     </div>
//                                   )}
//                                   {assignment.comp_ratio_c !== null && (
//                                     <div className="grid grid-cols-12 gap-2 items-center">
//                                       <div className="col-span-9">
//                                         <input
//                                           type="text"
//                                           value={remarks[assignment.id]?.comp_c_remarks ?? ""}
//                                           onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
//                                           className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                           placeholder="Remarks for Component C"
//                                           required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
//                                         />
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </details>
//               ))}
//               <div className="p-4 flex justify-end">
//                 <button
//                   onClick={() => setIsTransportModalOpen(true)}
//                   className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
//                     isDispatchEnabled() && assignedMaterials.some(a => a.dispatch_status === "not-dispatched")
//                       ? "bg-teal-600 hover:bg-teal-700"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                   disabled={!isDispatchEnabled() || !assignedMaterials.some(a => a.dispatch_status === "not-dispatched")}
//                 >
//                   <Truck className="h-4 w-4 inline-block mr-2" />
//                   Assign Transport
//                 </button>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-6 mb-6">
//               {Object.entries(groupedMaterials).map(([desc_id, group]) => (
//                 <details key={desc_id} open className="bg-white rounded-xl shadow-lg border border-gray-100">
//                   <summary className="px-5 py-4 bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer flex justify-between items-center">
//                     <span>Work Description: {group.desc_name}</span>
//                   </summary>
//                   <div className="p-5 space-y-6">
//                     {group.items
//                       .filter((assignment) => assignment.dispatch_status === "not-dispatched")
//                       .map((assignment, index) => (
//                         <div key={assignment.id} className="space-y-4">
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-700">Material Details</p>
//                             <p className="text-sm text-gray-600">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
//                               {assignment.quantity || "N/A"} {assignment.uom_name || "N/A"}
//                             </span>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-700">Component Quantities</p>
//                             <div className="space-y-3">
//                               {assignment.comp_ratio_a !== null && (
//                                 <div className="space-y-1">
//                                   <label className="text-xs font-medium text-gray-700">Component A</label>
//                                   <input
//                                     type="number"
//                                     value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
//                                     onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Qty"
//                                     min="0"
//                                   />
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_b !== null && (
//                                 <div className="space-y-1">
//                                   <label className="text-xs font-medium text-gray-700">Component B</label>
//                                   <input
//                                     type="number"
//                                     value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
//                                     onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Qty"
//                                     min="0"
//                                   />
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_c !== null && (
//                                 <div className="space-y-1">
//                                   <label className="text-xs font-medium text-gray-700">Component C</label>
//                                   <input
//                                     type="number"
//                                     value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
//                                     onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Qty"
//                                     min="0"
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-700">Remarks</p>
//                             <div className="space-y-3">
//                               {assignment.comp_ratio_a !== null && (
//                                 <div className="space-y-1">
//                                   <label className="text-xs font-medium text-gray-700">Component A</label>
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_a_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component A"
//                                     required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
//                                   />
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_b !== null && (
//                                 <div className="space-y-1">
//                                   <label className="text-xs font-medium text-gray-700">Component B</label>
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_b_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component B"
//                                     required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
//                                   />
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_c !== null && (
//                                 <div className="space-y-1">
//                                   <label className="text-xs font-medium text-gray-700">Component C</label>
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_c_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component C"
//                                     required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </details>
//               ))}
//               <div className="p-4 flex justify-end">
//                 <button
//                   onClick={() => setIsTransportModalOpen(true)}
//                   className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
//                     isDispatchEnabled() && assignedMaterials.some(a => a.dispatch_status === "not-dispatched")
//                       ? "bg-teal-600 hover:bg-teal-700"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                   disabled={!isDispatchEnabled() || !assignedMaterials.some(a => a.dispatch_status === "not-dispatched")}
//                 >
//                   <Truck className="h-4 w-4 inline-block mr-2" />
//                   Dispatch Materials
//                 </button>
//               </div>
//             </div>

//             {/* Transport Modal */}
//             {isTransportModalOpen && (
//               <div
//                 className="backdrop-blur-xl fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
//                 onClick={() => setIsTransportModalOpen(false)}
//               >
//                 <div
//                   className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() => setIsTransportModalOpen(false)}
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
//                     aria-label="Close transport modal"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Dispatch Materials</h3>
//                   <div className="space-y-6">
//                     {/* Transport Details */}
//                     <div>
//                       <h4 className="text-lg font-medium text-gray-800 mb-4">Transport Details</h4>
//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-2">
//                             Transport Type <span className="text-red-500">*</span>
//                           </label>
//                           <select
//                             value={transportData.transport_type_id}
//                             onChange={(e) => handleTransportChange("transport_type_id", e.target.value)}
//                             className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//                             disabled={loading.transportTypes}
//                             required
//                           >
//                             <option value="">Select Transport Type</option>
//                             {transportTypes.map((type) => (
//                               <option key={type.id} value={type.id}>
//                                 {type.type}
//                               </option>
//                             ))}
//                           </select>
//                           {loading.transportTypes && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//                         </div>

//                         {transportData.transport_type_id && (
//                           <>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 {isOwnVehicle ? "Contract Provider" : "Logistics Provider"} <span className="text-red-500">*</span>
//                               </label>
//                               <SearchableDropdown
//                                 options={providers}
//                                 selectedValue={transportData.provider_id}
//                                 onSelect={(value) => handleTransportChange("provider_id", value)}
//                                 placeholder={`Select or enter ${isOwnVehicle ? "Contract" : "Logistics"} Provider`}
//                                 searchKeys={["provider_name"]}
//                                 label="Provider"
//                                 disabled={!transportData.transport_type_id}
//                                 loading={loading.providers}
//                                 allowNew={true}
//                                 onNewEntryChange={(value) => handleNewEntryDropdown("provider_id", value)}
//                               />
//                               {transportData.provider_id && !providers.some((p) => p.id === transportData.provider_id) && (
//                                 <div className="mt-4 space-y-4">
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Provider Address
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.provider_address}
//                                       onChange={(e) => handleNewEntryChange("provider_address", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Provider Address"
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Provider Mobile
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.provider_mobile}
//                                       onChange={(e) => handleNewEntryChange("provider_mobile", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Provider Mobile"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 Vehicle <span className="text-red-500">*</span>
//                               </label>
//                               <SearchableDropdown
//                                 options={vehicles}
//                                 selectedValue={transportData.vehicle_id}
//                                 onSelect={(value) => handleTransportChange("vehicle_id", value)}
//                                 placeholder="Select or enter Vehicle"
//                                 searchKeys={["vehicle_name", "vehicle_number"]}
//                                 label="Vehicle"
//                                 loading={loading.vehicles}
//                                 allowNew={true}
//                                 onNewEntryChange={(value) => handleNewEntryDropdown("vehicle_id", value)}
//                               />
//                               {transportData.vehicle_id && !vehicles.some((v) => v.id === transportData.vehicle_id) && (
//                                 <div className="mt-4 space-y-4">
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Vehicle Model
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.vehicle_model}
//                                       onChange={(e) => handleNewEntryChange("vehicle_model", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Vehicle Model"
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Vehicle Number
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.vehicle_number}
//                                       onChange={(e) => handleNewEntryChange("vehicle_number", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Vehicle Number"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 Driver <span className="text-red-500">*</span>
//                               </label>
//                               <SearchableDropdown
//                                 options={drivers}
//                                 selectedValue={transportData.driver_id}
//                                 onSelect={(value) => handleTransportChange("driver_id", value)}
//                                 placeholder="Select or enter Driver"
//                                 searchKeys={["driver_name", "driver_mobile"]}
//                                 label="Driver"
//                                 loading={loading.drivers}
//                                 allowNew={true}
//                                 onNewEntryChange={(value) => handleNewEntryDropdown("driver_id", value)}
//                               />
//                               {transportData.driver_id && !drivers.some((d) => d.id === transportData.driver_id) && (
//                                 <div className="mt-4 space-y-4">
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Driver Mobile
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.driver_mobile}
//                                       onChange={(e) => handleNewEntryChange("driver_mobile", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Driver Mobile"
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Driver Address
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.driver_address}
//                                       onChange={(e) => handleNewEntryChange("driver_address", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Driver Address"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 Destination <span className="text-red-500">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 id="destination"
//                                 placeholder="Enter Destination"
//                                 value={transportData.destination}
//                                 onChange={(e) => handleTransportChange("destination", e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                 required
//                               />
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                               {!isOwnVehicle && (
//                                 <div>
//                                   <label className="block text-xs font-medium text-gray-600 mb-2">
//                                     Booking Expense <span className="text-red-500">*</span>
//                                   </label>
//                                   <input
//                                     type="number"
//                                     id="booking_expense"
//                                     placeholder="Enter Booking Expense"
//                                     value={transportData.booking_expense}
//                                     onChange={(e) => handleTransportChange("booking_expense", e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     step="0.01"
//                                     min="0"
//                                     required
//                                   />
//                                 </div>
//                               )}
//                               <div>
//                                 <label className="block text-xs font-medium text-gray-600 mb-2">
//                                   Travel Expense <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                   type="number"
//                                   id="travel_expense"
//                                   placeholder="Enter Travel Expense"
//                                   value={transportData.travel_expense}
//                                   onChange={(e) => handleTransportChange("travel_expense", e.target.value)}
//                                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                   step="0.01"
//                                   min="0"
//                                   required
//                                 />
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-center space-x-4">
//                     <button
//                       onClick={() => setIsTransportModalOpen(false)}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleDispatchSubmit}
//                       className="px-6 py-3 bg-teal-600 text-white rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       disabled={loading.submitting}
//                     >
//                       {loading.submitting ? (
//                         <>
//                           <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
//                           Dispatching...
//                         </>
//                       ) : (
//                         <>
//                           <Truck className="h-5 w-5 inline-block mr-2" />
//                           Dispatch Material
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewAssignedMaterial;

























import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, Package, FileText, X, Truck, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

const SearchableDropdown = ({ options, selectedValue, onSelect, placeholder, searchKeys, label, disabled, loading, allowNew, onNewEntryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (allowNew && searchQuery && !options.some(opt => opt.id === searchQuery)) {
          onSelect(searchQuery);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery, options, onSelect, allowNew]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (allowNew && value) {
      onSelect(value);
      if (onNewEntryChange) {
        onNewEntryChange(value);
      }
    }
  };

  const filteredOptions = options.filter((option) =>
    searchKeys.some((key) =>
      option[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
    setSearchQuery("");
  };

  const selectedOption = options.find((option) => option.id === selectedValue);

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center px-3 py-2 border-b border-gray-200">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                if (allowNew && searchQuery && !options.some(opt => opt.id === searchQuery)) {
                  onSelect(searchQuery);
                }
              }}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-gray-500 text-sm flex items-center">
                <Loader2 className="h-4 w-4 text-teal-500 animate-spin mr-2" />
                Loading {placeholder.toLowerCase()}...
              </div>
            ) : filteredOptions.length === 0 && !allowNew ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No matching {placeholder.toLowerCase()} found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors ${
                    selectedValue === option.id ? "bg-teal-100 text-teal-800" : "text-gray-700"
                  }`}
                >
                  <div className="font-medium">{option[searchKeys[0]]}</div>
                  {searchKeys[1] && (
                    <div className="text-xs text-gray-500">{option[searchKeys[1]]}</div>
                  )}
                </div>
              ))
            )}
            {allowNew && searchQuery && !filteredOptions.some(opt => opt[searchKeys[0]]?.toLowerCase() === searchQuery.toLowerCase()) && (
              <div
                onClick={() => handleSelect(searchQuery)}
                className="px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors text-gray-700"
              >
                <div className="font-medium">Add "{searchQuery}"</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => !disabled && setIsOpen(true)}
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        >
          <div>
            {selectedOption ? (
              <>
                <div className="font-medium text-gray-900 text-sm">
                  {selectedOption[searchKeys[0]]}
                </div>
                {searchKeys[1] && (
                  <div className="text-xs text-gray-500">{selectedOption[searchKeys[1]]}</div>
                )}
              </>
            ) : selectedValue && allowNew ? (
              <div className="font-medium text-gray-900 text-sm">{selectedValue}</div>
            ) : (
              <span className="text-gray-500 text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </button>
      )}
    </div>
  );
};

const ViewAssignedMaterial = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [nextDcNo, setNextDcNo] = useState("");
  const [assignedMaterials, setAssignedMaterials] = useState([]);
  const [groupedMaterials, setGroupedMaterials] = useState({});
  const [loading, setLoading] = useState({
    projects: false,
    sites: false,
    dcNo: false,
    materials: false,
    transportTypes: false,
    providers: false,
    vehicles: false,
    drivers: false,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const [dispatchData, setDispatchData] = useState({
    dc_no: "",
    dispatch_date: "",
    order_no: "",
    vendor_code: "",
  });
  const [transportData, setTransportData] = useState({
    transport_type_id: "",
    provider_id: "",
    vehicle_id: "",
    driver_id: "",
    destination: "",
    booking_expense: "",
    travel_expense: "",
  });
  const [newEntryData, setNewEntryData] = useState({
    vehicle_model: "",
    vehicle_number: "",
    driver_mobile: "",
    driver_address: "",
    provider_address: "",
    provider_mobile: "",
  });
  const [transportTypes, setTransportTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [calculatedQuantities, setCalculatedQuantities] = useState({});
  const [remarks, setRemarks] = useState({});
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://103.118.158.33/api/material/projects");
      setProjects(response.data.data || []);
      if (response.data.data.length > 0 && !selectedProject) {
        setSelectedProject(response.data.data[0].pd_id);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Fetch sites
  const fetchSites = async (pd_id) => {
    try {
      setLoading((prev) => ({ ...prev, sites: true }));
      const response = await axios.get(`http://103.118.158.33/api/material/sites/${pd_id}`);
      setSites(response.data.data || []);
      if (response.data.data.length > 0 && !selectedSite) {
        setSelectedSite(response.data.data[0].site_id);
        setDispatchData((prev) => ({
          ...prev,
          order_no: response.data.data[0].po_number || "",
        }));
      }
      // Set vendor_code based on selected project
      const selectedProjectData = projects.find((project) => project.pd_id === pd_id);
      if (selectedProjectData) {
        setDispatchData((prev) => ({
          ...prev,
          vendor_code: selectedProjectData.vendor_code || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load sites. Please try again.");
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch next DC No
  const fetchNextDcNo = async () => {
    if (!selectedSite) return;
    try {
      setLoading((prev) => ({ ...prev, dcNo: true }));
      const response = await axios.get("http://103.118.158.33/api/material/next-dc-no");
      setNextDcNo(response.data.data.next_dc_no || "");
      setDispatchData((prev) => ({
        ...prev,
        dc_no: response.data.data.next_dc_no || "",
      }));
    } catch (error) {
      console.error("Error fetching next DC No:", error);
      setError("Failed to load next DC No. Please try again.");
      setNextDcNo("");
      setDispatchData((prev) => ({ ...prev, dc_no: "" }));
    } finally {
      setLoading((prev) => ({ ...prev, dcNo: false }));
    }
  };

  // Fetch transport types
  const fetchTransportTypes = async () => {
    try {
      setLoading((prev) => ({ ...prev, transportTypes: true }));
      const response = await axios.get("http://103.118.158.33/api/material/transport-types");
      setTransportTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transport types:", error);
      setError("Failed to load transport types. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, transportTypes: false }));
    }
  };

  // Fetch providers
  const fetchProviders = async (transport_type_id) => {
    try {
      setLoading((prev) => ({ ...prev, providers: true }));
      const response = await axios.get("http://103.118.158.33/api/material/providers", {
        params: { transport_type_id: Number.isInteger(parseInt(transport_type_id)) ? transport_type_id : undefined },
      });
      setProviders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("Failed to load providers. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading((prev) => ({ ...prev, vehicles: true }));
      const response = await axios.get("http://103.118.158.33/api/material/vehicles");
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, vehicles: false }));
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      setLoading((prev) => ({ ...prev, drivers: true }));
      const response = await axios.get("http://103.118.158.33/api/material/drivers");
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Failed to load drivers. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, drivers: false }));
    }
  };

  // Fetch assigned materials
  const fetchAssignedMaterials = async () => {
    if (!selectedProject || !selectedSite) return;
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      setError(null);
      const response = await axios.get("http://103.118.158.33/api/material/assignments-with-dispatch", {
        params: { pd_id: selectedProject, site_id: selectedSite },
      });
      const materials = response.data.data || [];
      setAssignedMaterials(materials);

      // Group materials by desc_id
      const grouped = materials.reduce((acc, item) => {
        const key = item.desc_id || "unknown";
        if (!acc[key]) {
          acc[key] = { desc_name: item.desc_name || "Unknown Description", items: [] };
        }
        acc[key].items.push(item);
        return acc;
      }, {});
      setGroupedMaterials(grouped);

      // Initialize quantities and remarks
      const newQuantities = {};
      const newRemarks = {};
      materials.forEach((assignment) => {
        const totalRatio =
          (assignment.comp_ratio_a || 0) +
          (assignment.comp_ratio_b || 0) +
          (assignment.comp_ratio_c || 0);
        newQuantities[assignment.id] = {
          comp_a_qty:
            totalRatio && assignment.comp_ratio_a !== null
              ? Math.round((assignment.comp_ratio_a / totalRatio) * assignment.quantity)
              : null,
          comp_b_qty:
            totalRatio && assignment.comp_ratio_b !== null
              ? Math.round((assignment.comp_ratio_b / totalRatio) * assignment.quantity)
              : null,
          comp_c_qty:
            totalRatio && assignment.comp_ratio_c !== null
              ? Math.round((assignment.comp_ratio_c / totalRatio) * assignment.quantity)
              : null,
        };
        newRemarks[assignment.id] = {
          comp_a_remarks: "",
          comp_b_remarks: "",
          comp_c_remarks: "",
        };
      });
      setCalculatedQuantities(newQuantities);
      setRemarks(newRemarks);
    } catch (error) {
      console.error("Error fetching material assignments:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to load material assignments. Please try again."
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
    setAssignedMaterials([]);
    setGroupedMaterials({});
    setCalculatedQuantities({});
    setRemarks({});
    setNextDcNo("");
    setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setNewEntryData({
      vehicle_model: "",
      vehicle_number: "",
      driver_mobile: "",
      driver_address: "",
      provider_address: "",
      provider_mobile: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
    if (pd_id) {
      await fetchSites(pd_id);
    }
  };

  // Handle site selection
  const handleSiteChange = (e) => {
    const site_id = e.target.value;
    setSelectedSite(site_id);
    setAssignedMaterials([]);
    setGroupedMaterials({});
    setCalculatedQuantities({});
    setRemarks({});
    setNextDcNo("");
    const selectedSiteData = sites.find((site) => site.site_id === site_id);
    setDispatchData((prev) => ({
      ...prev,
      order_no: selectedSiteData ? selectedSiteData.po_number || "" : "",
      dc_no: nextDcNo,
    }));
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setNewEntryData({
      vehicle_model: "",
      vehicle_number: "",
      driver_mobile: "",
      driver_address: "",
      provider_address: "",
      provider_mobile: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
  };

  // Handle dispatch form input changes
  const handleDispatchChange = (field, value) => {
    setDispatchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle transport form input changes
  const handleTransportChange = (field, value) => {
    setTransportData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "transport_type_id") {
      setProviders([]);
      setTransportData((prev) => ({
        ...prev,
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      }));
      setNewEntryData({
        vehicle_model: "",
        vehicle_number: "",
        driver_mobile: "",
        driver_address: "",
        provider_address: "",
        provider_mobile: "",
      });
      if (value && Number.isInteger(parseInt(value))) {
        fetchProviders(value);
      }
    }
  };

  // Handle new entry input changes
  const handleNewEntryChange = (field, value) => {
    setNewEntryData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle new entry for searchable dropdowns
  const handleNewEntryDropdown = (field, value) => {
    if (field === "vehicle_id") {
      setNewEntryData((prev) => ({
        ...prev,
        vehicle_model: value,
        vehicle_number: "",
      }));
    } else if (field === "driver_id") {
      setNewEntryData((prev) => ({
        ...prev,
        driver_mobile: "",
        driver_address: "",
      }));
    } else if (field === "provider_id") {
      setNewEntryData((prev) => ({
        ...prev,
        provider_address: "",
        provider_mobile: "",
      }));
    }
  };

  // Handle quantity input changes
  const handleQuantityChange = (assignmentId, field, value) => {
    setCalculatedQuantities((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value ? parseInt(value) : null,
      },
    }));
  };

  // Handle remarks input changes
  const handleRemarksChange = (assignmentId, field, value) => {
    setRemarks((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value,
      },
    }));
  };

  // Validate dispatch and remarks for enabling Dispatch button
  const isDispatchEnabled = () => {
    if (!dispatchData.dc_no || !dispatchData.dispatch_date || !dispatchData.order_no || !dispatchData.vendor_code) {
      return false;
    }
    for (const assignment of assignedMaterials) {
      const assignmentId = assignment.id;
      const quantities = calculatedQuantities[assignmentId];
      const assignmentRemarks = remarks[assignmentId];
      if (quantities?.comp_a_qty !== null && !assignmentRemarks?.comp_a_remarks) {
        return false;
      }
      if (quantities?.comp_b_qty !== null && !assignmentRemarks?.comp_b_remarks) {
        return false;
      }
      if (quantities?.comp_c_qty !== null && !assignmentRemarks?.comp_c_remarks) {
        return false;
      }
    }
    return true;
  };

  // Handle dispatch form submission
  const handleDispatchSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      // Validate transport fields
      const requiredFields = [
        transportData.transport_type_id,
        transportData.provider_id,
        transportData.vehicle_id,
        transportData.driver_id,
        transportData.destination,
        transportData.travel_expense,
      ];
      if (transportData.transport_type_id === "2") {
        requiredFields.push(transportData.booking_expense);
      }
      if (requiredFields.some((field) => !field)) {
        setError("Please fill all required transport fields.");
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Please fill all required transport fields",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
        return;
      }

      // Prepare dispatch payload
      const dispatchPayload = assignedMaterials
        .filter((assignment) => assignment.dispatch_status === "not-dispatched")
        .map((assignment) => ({
          material_assign_id: assignment.id,
          desc_id: assignment.desc_id,
          dc_no: parseInt(dispatchData.dc_no),
          dispatch_date: dispatchData.dispatch_date,
          order_no: dispatchData.order_no,
          vendor_code: dispatchData.vendor_code,
          comp_a_qty: calculatedQuantities[assignment.id]?.comp_a_qty || null,
          comp_b_qty: calculatedQuantities[assignment.id]?.comp_b_qty || null,
          comp_c_qty: calculatedQuantities[assignment.id]?.comp_c_qty || null,
          comp_a_remarks: calculatedQuantities[assignment.id]?.comp_a_qty !== null ? remarks[assignment.id]?.comp_a_remarks || null : null,
          comp_b_remarks: calculatedQuantities[assignment.id]?.comp_b_qty !== null ? remarks[assignment.id]?.comp_b_remarks || null : null,
          comp_c_remarks: calculatedQuantities[assignment.id]?.comp_c_qty !== null ? remarks[assignment.id]?.comp_c_remarks || null : null,
        }));

      // Prepare transport payload
      const transportPayload = {
        transport_type_id: parseInt(transportData.transport_type_id),
        provider_id: transportData.provider_id,
        vehicle_id: transportData.vehicle_id,
        driver_id: transportData.driver_id,
        destination: transportData.destination,
        booking_expense: transportData.booking_expense ? parseFloat(transportData.booking_expense) : null,
        travel_expense: parseFloat(transportData.travel_expense),
        provider_address: newEntryData.provider_address || null,
        provider_mobile: newEntryData.provider_mobile || null,
        vehicle_model: newEntryData.vehicle_model || null,
        vehicle_number: newEntryData.vehicle_number || null,
        driver_mobile: newEntryData.driver_mobile || null,
        driver_address: newEntryData.driver_address || null,
      };

      // Combine payloads
      const payload = {
        assignments: dispatchPayload,
        transport: transportPayload,
      };

      // Submit combined payload
      const response = await axios.post("http://103.118.158.33/api/material/add-dispatch", payload);

      if (response.data.status === "already_dispatched") {
        const conflicts = response.data.conflicts
          .map((conflict) => `Material: ${conflict.item_name} (ID: ${conflict.material_assign_id})`)
          .join(", ");
        setError(`Cannot dispatch the following materials as they have already been dispatched: ${conflicts}`);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Some materials have already been dispatched",
          text: conflicts,
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        return;
      }

      // Show success toast
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Materials dispatched and transport details saved successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      // Reset form and close modal
      setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
      setTransportData({
        transport_type_id: "",
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      });
      setNewEntryData({
        vehicle_model: "",
        vehicle_number: "",
        driver_mobile: "",
        driver_address: "",
        provider_address: "",
        provider_mobile: "",
      });
      setCalculatedQuantities({});
      setRemarks({});
      setIsTransportModalOpen(false);
      await fetchAssignedMaterials();
      await fetchTransportTypes();
      await fetchVehicles();
      await fetchDrivers();
      if (Number.isInteger(parseInt(transportData.transport_type_id))) {
        await fetchProviders(transportData.transport_type_id);
      }
      await fetchNextDcNo();
    } catch (error) {
      console.error("Error dispatching materials or saving transport:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to dispatch materials or save transport details. Please try again.";
      setError(errorMessage);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Helper function to format ratio string
  const getRatioString = (assignment) => {
    const ratios = [];
    if (assignment.comp_ratio_a !== null) ratios.push(assignment.comp_ratio_a);
    if (assignment.comp_ratio_b !== null) ratios.push(assignment.comp_ratio_b);
    if (assignment.comp_ratio_c !== null) ratios.push(assignment.comp_ratio_c);
    return ratios.length > 0 ? `(${ratios.join(":")})` : "";
  };

  // Effect hooks
  useEffect(() => {
    fetchProjects();
    fetchTransportTypes();
    fetchVehicles();
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchSites(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      fetchAssignedMaterials();
      fetchNextDcNo();
    }
  }, [selectedProject, selectedSite]);

  useEffect(() => {
    if (transportData.transport_type_id && Number.isInteger(parseInt(transportData.transport_type_id))) {
      fetchProviders(transportData.transport_type_id);
    } else {
      setProviders([]);
      setTransportData((prev) => ({
        ...prev,
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      }));
    }
  }, [transportData.transport_type_id]);

  // Determine if the selected transport type is 'own' (id 1)
  const isOwnVehicle = transportData.transport_type_id === "1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Material Dispatch
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Dispatch non-dispatched materials to your project sites
          </p>
        </div>

        {/* Project and Site Selection */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="project">
              Select Project
            </label>
            <select
              id="project"
              value={selectedProject}
              onChange={handleProjectChange}
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.projects}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.pd_id} value={project.pd_id}>
                  {project.project_name || "Unknown Project"}
                </option>
              ))}
            </select>
            {loading.projects && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="site">
              Select Site
            </label>
            <select
              id="site"
              value={selectedSite}
              onChange={handleSiteChange}
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.sites || !selectedProject}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.site_name} (PO: {site.po_number})
                </option>
              ))}
            </select>
            {loading.sites && selectedProject && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
          </div>
        </div>

        {/* Dispatch Details */}
        {selectedProject && selectedSite && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="dc_no">
                  DC No <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                  {loading.dcNo ? (
                    <Loader2 className="h-5 w-5 text-teal-500 animate-spin inline-block" />
                  ) : (
                    nextDcNo || "N/A"
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="dispatch_date">
                  Dispatch Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dispatch_date"
                  value={dispatchData.dispatch_date}
                  onChange={(e) => handleDispatchChange("dispatch_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                  aria-required="true"
                />
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="order_no">
                  Order No <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                  {dispatchData.order_no || "N/A"}
                </div>
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-600" htmlFor="vendor_code">
                  Vendor Code <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                  {dispatchData.vendor_code || "N/A"}
                </div>
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
              <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
            </div>
          </div>
        ) : !selectedProject || !selectedSite ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">Please select a project and site.</p>
          </div>
        ) : Object.keys(groupedMaterials).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">No non-dispatched material assignments found for this project and site.</p>
            <p className="text-gray-500 mt-2">Assign materials to this project and site to dispatch them.</p>
          </div>
        ) : (
          <>
            {/* Desktop View with Accordions */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              {Object.entries(groupedMaterials).map(([desc_id, group]) => (
                <details key={desc_id} open className="mb-4 border-b border-gray-200">
                  <summary className="px-6 py-4 bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer flex justify-between items-center">
                    <span>Work Description: {group.desc_name}</span>
                  </summary>
                  <div className="p-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">#</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Material Details</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Quantity & UOM</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Component Quantities</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {group.items
                          .filter((assignment) => assignment.dispatch_status === "not-dispatched")
                          .map((assignment, index) => (
                            <tr key={assignment.id} className="hover:bg-teal-50 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="space-y-1">
                                  <p className="font-medium">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="space-y-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
                                    {assignment.quantity || "N/A"} | {assignment.uom_name || "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="space-y-3">
                                  {assignment.comp_ratio_a !== null && (
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">Comp A:</label>
                                      <div className="col-span-9">
                                        <input
                                          type="number"
                                          value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
                                          onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                          placeholder="Qty"
                                          min="0"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {assignment.comp_ratio_b !== null && (
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">Comp B:</label>
                                      <div className="col-span-9">
                                        <input
                                          type="number"
                                          value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
                                          onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                          placeholder="Qty"
                                          min="0"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {assignment.comp_ratio_c !== null && (
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <label className="col-span-3 text-sm font-medium text-gray-700 mr-1.5">Comp C:</label>
                                      <div className="col-span-9">
                                        <input
                                          type="number"
                                          value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
                                          onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                          placeholder="Qty"
                                          min="0"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="space-y-3">
                                  {assignment.comp_ratio_a !== null && (
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <div className="col-span-9">
                                        <input
                                          type="text"
                                          value={remarks[assignment.id]?.comp_a_remarks ?? ""}
                                          onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                          placeholder="Remarks for Component A"
                                          required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {assignment.comp_ratio_b !== null && (
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <div className="col-span-9">
                                        <input
                                          type="text"
                                          value={remarks[assignment.id]?.comp_b_remarks ?? ""}
                                          onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                          placeholder="Remarks for Component B"
                                          required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {assignment.comp_ratio_c !== null && (
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <div className="col-span-9">
                                        <input
                                          type="text"
                                          value={remarks[assignment.id]?.comp_c_remarks ?? ""}
                                          onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                          placeholder="Remarks for Component C"
                                          required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsTransportModalOpen(true)}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDispatchEnabled() && assignedMaterials.some(a => a.dispatch_status === "not-dispatched")
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isDispatchEnabled() || !assignedMaterials.some(a => a.dispatch_status === "not-dispatched")}
                >
                  <Truck className="h-4 w-4 inline-block mr-2" />
                  Assign Transport
                </button>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6 mb-6">
              {Object.entries(groupedMaterials).map(([desc_id, group]) => (
                <details key={desc_id} open className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <summary className="px-5 py-4 bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer flex justify-between items-center">
                    <span>Work Description: {group.desc_name}</span>
                  </summary>
                  <div className="p-5 space-y-6">
                    {group.items
                      .filter((assignment) => assignment.dispatch_status === "not-dispatched")
                      .map((assignment, index) => (
                        <div key={assignment.id} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Material Details</p>
                            <p className="text-sm text-gray-600">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              {assignment.quantity || "N/A"} {assignment.uom_name || "N/A"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Component Quantities</p>
                            <div className="space-y-3">
                              {assignment.comp_ratio_a !== null && (
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-700">Component A</label>
                                  <input
                                    type="number"
                                    value={calculatedQuantities[assignment.id]?.comp_a_qty ?? ""}
                                    onChange={(e) => handleQuantityChange(assignment.id, "comp_a_qty", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Qty"
                                    min="0"
                                  />
                                </div>
                              )}
                              {assignment.comp_ratio_b !== null && (
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-700">Component B</label>
                                  <input
                                    type="number"
                                    value={calculatedQuantities[assignment.id]?.comp_b_qty ?? ""}
                                    onChange={(e) => handleQuantityChange(assignment.id, "comp_b_qty", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Qty"
                                    min="0"
                                  />
                                </div>
                              )}
                              {assignment.comp_ratio_c !== null && (
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-700">Component C</label>
                                  <input
                                    type="number"
                                    value={calculatedQuantities[assignment.id]?.comp_c_qty ?? ""}
                                    onChange={(e) => handleQuantityChange(assignment.id, "comp_c_qty", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Qty"
                                    min="0"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Remarks</p>
                            <div className="space-y-3">
                              {assignment.comp_ratio_a !== null && (
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-700">Component A</label>
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_a_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component A"
                                    required={calculatedQuantities[assignment.id]?.comp_a_qty !== null}
                                  />
                                </div>
                              )}
                              {assignment.comp_ratio_b !== null && (
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-700">Component B</label>
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_b_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component B"
                                    required={calculatedQuantities[assignment.id]?.comp_b_qty !== null}
                                  />
                                </div>
                              )}
                              {assignment.comp_ratio_c !== null && (
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-gray-700">Component C</label>
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_c_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component C"
                                    required={calculatedQuantities[assignment.id]?.comp_c_qty !== null}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </details>
              ))}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsTransportModalOpen(true)}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDispatchEnabled() && assignedMaterials.some(a => a.dispatch_status === "not-dispatched")
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isDispatchEnabled() || !assignedMaterials.some(a => a.dispatch_status === "not-dispatched")}
                >
                  <Truck className="h-4 w-4 inline-block mr-2" />
                  Dispatch Materials
                </button>
              </div>
            </div>

            {/* Transport Modal */}
            {isTransportModalOpen && (
              <div
                className="backdrop-blur-xl fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setIsTransportModalOpen(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsTransportModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                    aria-label="Close transport modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Dispatch Materials</h3>
                  <div className="space-y-6">
                    {/* Transport Details */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Transport Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Transport Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={transportData.transport_type_id}
                            onChange={(e) => handleTransportChange("transport_type_id", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
                            disabled={loading.transportTypes}
                            required
                          >
                            <option value="">Select Transport Type</option>
                            {transportTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.type}
                              </option>
                            ))}
                          </select>
                          {loading.transportTypes && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
                        </div>

                        {transportData.transport_type_id && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                {isOwnVehicle ? "Contract Provider" : "Logistics Provider"} <span className="text-red-500">*</span>
                              </label>
                              <SearchableDropdown
                                options={providers}
                                selectedValue={transportData.provider_id}
                                onSelect={(value) => handleTransportChange("provider_id", value)}
                                placeholder={`Select or enter ${isOwnVehicle ? "Contract" : "Logistics"} Provider`}
                                searchKeys={["provider_name"]}
                                label="Provider"
                                disabled={!transportData.transport_type_id}
                                loading={loading.providers}
                                allowNew={true}
                                onNewEntryChange={(value) => handleNewEntryDropdown("provider_id", value)}
                              />
                              {transportData.provider_id && !providers.some((p) => p.id === transportData.provider_id) && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Provider Address
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.provider_address}
                                      onChange={(e) => handleNewEntryChange("provider_address", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Provider Address"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Provider Mobile
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.provider_mobile}
                                      onChange={(e) => handleNewEntryChange("provider_mobile", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Provider Mobile"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Vehicle <span className="text-red-500">*</span>
                              </label>
                              <SearchableDropdown
                                options={vehicles}
                                selectedValue={transportData.vehicle_id}
                                onSelect={(value) => handleTransportChange("vehicle_id", value)}
                                placeholder="Select or enter Vehicle"
                                searchKeys={["vehicle_name", "vehicle_number"]}
                                label="Vehicle"
                                loading={loading.vehicles}
                                allowNew={true}
                                onNewEntryChange={(value) => handleNewEntryDropdown("vehicle_id", value)}
                              />
                              {transportData.vehicle_id && !vehicles.some((v) => v.id === transportData.vehicle_id) && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Vehicle Model
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.vehicle_model}
                                      onChange={(e) => handleNewEntryChange("vehicle_model", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Vehicle Model"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Vehicle Number
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.vehicle_number}
                                      onChange={(e) => handleNewEntryChange("vehicle_number", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Vehicle Number"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Driver <span className="text-red-500">*</span>
                              </label>
                              <SearchableDropdown
                                options={drivers}
                                selectedValue={transportData.driver_id}
                                onSelect={(value) => handleTransportChange("driver_id", value)}
                                placeholder="Select or enter Driver"
                                searchKeys={["driver_name", "driver_mobile"]}
                                label="Driver"
                                loading={loading.drivers}
                                allowNew={true}
                                onNewEntryChange={(value) => handleNewEntryDropdown("driver_id", value)}
                              />
                              {transportData.driver_id && !drivers.some((d) => d.id === transportData.driver_id) && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Driver Mobile
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.driver_mobile}
                                      onChange={(e) => handleNewEntryChange("driver_mobile", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Driver Mobile"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Driver Address
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.driver_address}
                                      onChange={(e) => handleNewEntryChange("driver_address", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Driver Address"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Destination <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="destination"
                                placeholder="Enter Destination"
                                value={transportData.destination}
                                onChange={(e) => handleTransportChange("destination", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {!isOwnVehicle && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Booking Expense <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id="booking_expense"
                                    placeholder="Enter Booking Expense"
                                    value={transportData.booking_expense}
                                    onChange={(e) => handleTransportChange("booking_expense", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    step="0.01"
                                    min="0"
                                    required
                                  />
                                </div>
                              )}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                  Travel Expense <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  id="travel_expense"
                                  placeholder="Enter Travel Expense"
                                  value={transportData.travel_expense}
                                  onChange={(e) => handleTransportChange("travel_expense", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                  step="0.01"
                                  min="0"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={() => setIsTransportModalOpen(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDispatchSubmit}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={loading.submitting}
                    >
                      {loading.submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                          Dispatching...
                        </>
                      ) : (
                        <>
                          <Truck className="h-5 w-5 inline-block mr-2" />
                          Dispatch Material
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAssignedMaterial;