// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { PlusCircle, OctagonMinus, Loader2, CheckCircle } from "lucide-react";

// const AssignMaterial = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [uoms, setUoms] = useState([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [rows, setRows] = useState([
//     {
//       item_id: "",
//       uom_id: "",
//       quantity: "",
//       comp_ratio_a: "",
//       comp_ratio_b: "",
//       comp_ratio_c: "",
//     },
//   ]);
//   const [loading, setLoading] = useState({
//     projects: false,
//     sites: false,
//     materials: false,
//     uoms: false,
//     submitting: false,
//   });
//   const [error, setError] = useState(null);

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, projects: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/projects");
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
//       const response = await axios.get(`http://103.118.158.33/api/material/sites/${pd_id}`);
//       setSites(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching sites:", error);
//       setError("Failed to load sites. Please try again.");
//       setSites([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, sites: false }));
//     }
//   };

//   // Fetch materials
//   const fetchMaterials = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, materials: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/materials");
//       setMaterials(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching materials:", error);
//       setError("Failed to load materials. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, materials: false }));
//     }
//   };

//   // Fetch UOMs
//   const fetchUoms = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, uoms: true }));
//       const response = await axios.get("http://103.118.158.33/api/material/uom");
//       setUoms(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching UOMs:", error);
//       setError("Failed to load UOMs. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, uoms: false }));
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//     fetchMaterials();
//     fetchUoms();
//   }, []);

//   // Handle project selection
//   const handleProjectChange = async (e) => {
//     const pd_id = e.target.value;
//     setSelectedProject(pd_id);
//     setSelectedSite("");
//     setRows([{ item_id: "", uom_id: "", quantity: "", comp_ratio_a: "", comp_ratio_b: "", comp_ratio_c: "" }]);
//     setError(null);
//     if (pd_id) {
//       await fetchSites(pd_id);
//     } else {
//       setSites([]);
//     }
//   };

//   // Handle site selection
//   const handleSiteChange = (e) => {
//     setSelectedSite(e.target.value);
//     setRows([{ item_id: "", uom_id: "", quantity: "", comp_ratio_a: "", comp_ratio_b: "", comp_ratio_c: "" }]);
//     setError(null);
//   };

//   // Handle input changes for table rows
//   const handleInputChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedRows = [...rows];
//     updatedRows[index] = { ...updatedRows[index], [name]: value };
//     setRows(updatedRows);
//     setError(null);
//   };

//   // Add new row
//   const handleAddRow = () => {
//     setRows([
//       ...rows,
//       {
//         item_id: "",
//         uom_id: "",
//         quantity: "",
//         comp_ratio_a: "",
//         comp_ratio_b: "",
//         comp_ratio_c: "",
//       },
//     ]);
//     setError(null);
//   };

//   // Remove row
//   const handleRemoveRow = (index) => {
//     if (rows.length <= 1) {
//       setError("At least one material assignment is required.");
//       return;
//     }
//     setRows(rows.filter((_, i) => i !== index));
//     setError(null);
//   };

//   // Submit assignments
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading((prev) => ({ ...prev, submitting: true }));
//       setError(null);

//       if (!selectedProject) {
//         setError("Please select a project.");
//         return;
//       }
//       if (!selectedSite) {
//         setError("Please select a site.");
//         return;
//       }

//       const validationErrors = [];
//       rows.forEach((row, index) => {
//         if (!row.item_id) validationErrors.push(`Row ${index + 1}: Material is required`);
//         if (!row.uom_id) validationErrors.push(`Row ${index + 1}: Unit of Measure is required`);
//         if (!row.quantity) {
//           validationErrors.push(`Row ${index + 1}: Quantity is required`);
//         } else if (isNaN(row.quantity) || row.quantity <= 0) {
//           validationErrors.push(`Row ${index + 1}: Quantity must be a positive number`);
//         }
//       });

//       if (validationErrors.length > 0) {
//         setError(validationErrors.join("<br />"));
//         return;
//       }

//       const payload = rows.map((row) => ({
//         pd_id: selectedProject,
//         site_id: selectedSite,
//         item_id: row.item_id,
//         uom_id: parseInt(row.uom_id),
//         quantity: parseInt(row.quantity),
//         comp_ratio_a: row.comp_ratio_a ? parseInt(row.comp_ratio_a) : null,
//         comp_ratio_b: row.comp_ratio_b ? parseInt(row.comp_ratio_b) : null,
//         comp_ratio_c: row.comp_ratio_c ? parseInt(row.comp_ratio_c) : null,
//       }));

//       await axios.post("http://103.118.158.33/api/material/assign-material", payload);

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Materials Assigned Successfully!",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//         background: "#ecfdf5",
//         iconColor: "#10b981",
//       });

//       setRows([{ item_id: "", uom_id: "", quantity: "", comp_ratio_a: "", comp_ratio_b: "", comp_ratio_c: "" }]);
//       setSelectedProject("");
//       setSelectedSite("");
//       setSites([]);
//     } catch (error) {
//       console.error("Error submitting material assignments:", error);
//       setError(error.response?.data?.message || "Failed to assign materials. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, submitting: false }));
//     }
//   };

//   // Check if form fields should be enabled
//   const isFormEnabled = selectedProject && selectedSite;

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
//             Material Planning
//           </h2>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Manage and assign materials to your project sites with ease
//           </p>
//         </div>

//         {loading.projects || loading.materials || loading.uoms ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="flex flex-col items-center space-y-3">
//               <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
//               <p className="text-gray-600">Loading resources...</p>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="px-6 pt-6">
//               {error && (
//                 <div
//                   className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm"
//                   dangerouslySetInnerHTML={{ __html: error }}
//                 />
//               )}
//             </div>

//             <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">Select Project</label>
//                 <div className="relative">
//                   <select
//                     value={selectedProject}
//                     onChange={handleProjectChange}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
//                     required
//                   >
//                     <option value="">Select Project</option>
//                     {projects.map((project) => (
//                       <option key={project.pd_id} value={project.pd_id}>
//                         {project.project_name || "Unknown Project"}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
              
//               <div className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">Select Site</label>
//                 <div className="relative">
//                   <select
//                     value={selectedSite}
//                     onChange={handleSiteChange}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all disabled:bg-gray-50"
//                     required
//                     disabled={!selectedProject || loading.sites}
//                   >
//                     <option value="">Select Site</option>
//                     {sites.map((siteInfo) => (
//                       <option key={siteInfo.site_id} value={siteInfo.site_id}>
//                         {`${siteInfo.site_name || "Unknown Site"} (PO: ${siteInfo.po_number || "N/A"})`}
//                       </option>
//                     ))}
//                   </select>
//                   {loading.sites && selectedProject && (
//                     <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       #
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Material
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Unit of Measure
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Quantity
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Comp Ratio A
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Comp Ratio B
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Comp Ratio C
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {rows.map((row, index) => (
//                     <tr
//                       key={`row-${index}`}
//                       className="hover:bg-blue-50 transition-colors duration-150"
//                     >
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <select
//                           name="item_id"
//                           value={row.item_id}
//                           onChange={(e) => handleInputChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
//                           required
//                           disabled={!isFormEnabled}
//                         >
//                           <option value="">Select Material</option>
//                           {materials.map((material) => (
//                             <option key={material.item_id} value={material.item_id}>
//                               {material.item_name}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <select
//                           name="uom_id"
//                           value={row.uom_id}
//                           onChange={(e) => handleInputChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
//                           required
//                           disabled={!isFormEnabled}
//                         >
//                           <option value="">Select UOM</option>
//                           {uoms.map((uom) => (
//                             <option key={uom.uom_id} value={uom.uom_id}>
//                               {uom.uom_name}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="quantity"
//                           value={row.quantity}
//                           onChange={(e) => handleInputChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
//                           required
//                           disabled={!isFormEnabled}
//                           min="1"
//                         />
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="comp_ratio_a"
//                           value={row.comp_ratio_a}
//                           onChange={(e) => handleInputChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
//                           disabled={!isFormEnabled}
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="comp_ratio_b"
//                           value={row.comp_ratio_b}
//                           onChange={(e) => handleInputChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
//                           disabled={!isFormEnabled}
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="comp_ratio_c"
//                           value={row.comp_ratio_c}
//                           onChange={(e) => handleInputChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
//                           disabled={!isFormEnabled}
//                           min="0"
//                         />
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveRow(index)}
//                           disabled={rows.length <= 1 || !isFormEnabled}
//                           className={`p-1.5 rounded-md transition ${
//                             rows.length <= 1 || !isFormEnabled
//                               ? "text-gray-400 cursor-not-allowed"
//                               : "text-red-600 hover:bg-red-50"
//                           }`}
//                           title={rows.length <= 1 ? "At least one row is required" : "Remove this entry"}
//                         >
//                           <OctagonMinus className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
//               <button
//                 type="button"
//                 onClick={handleAddRow}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
//                 disabled={!isFormEnabled}
//               >
//                 <PlusCircle className="h-4 w-4 mr-2" />
//                 Add Entry
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading.submitting || !isFormEnabled}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
//               >
//                 {loading.submitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="h-4 w-4 mr-2" />
//                     Assign Materials
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignMaterial;























import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, Trash2, Loader2, CheckCircle } from "lucide-react";

const AssignMaterial = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [materialAssignments, setMaterialAssignments] = useState({});
  const [loading, setLoading] = useState({
    projects: false,
    sites: false,
    materials: false,
    uoms: false,
    workDescriptions: false,
    submitting: false,
  });
  const [error, setError] = useState(null);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://103.118.158.33/api/material/projects");
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
      const response = await axios.get(`http://103.118.158.33/api/material/sites/${pd_id}`);
      setSites(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load sites. Please try again.");
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      const response = await axios.get("http://103.118.158.33/api/material/materials");
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError("Failed to load materials. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Fetch UOMs
  const fetchUoms = async () => {
    try {
      setLoading((prev) => ({ ...prev, uoms: true }));
      const response = await axios.get("http://103.118.158.33/api/material/uom");
      setUoms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching UOMs:", error);
      setError("Failed to load UOMs. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, uoms: false }));
    }
  };

  // Fetch work descriptions for selected site
  const fetchWorkDescriptions = async (site_id) => {
    try {
      setLoading((prev) => ({ ...prev, workDescriptions: true }));
      const response = await axios.get(`http://103.118.158.33/api/material/work-descriptions?site_id=${site_id}`);
      const descriptions = response.data.data || [];
      setWorkDescriptions(descriptions);
      // Initialize material assignments for each work description
      const initialAssignments = descriptions.reduce((acc, desc) => {
        acc[desc.desc_id] = [
          {
            item_id: "",
            uom_id: "",
            quantity: "",
            comp_ratio_a: "",
            comp_ratio_b: "",
            comp_ratio_c: "",
          },
        ];
        return acc;
      }, {});
      setMaterialAssignments(initialAssignments);
    } catch (error) {
      console.error("Error fetching work descriptions:", error);
      setError("Failed to load work descriptions. Please try again.");
      setWorkDescriptions([]);
      setMaterialAssignments({});
    } finally {
      setLoading((prev) => ({ ...prev, workDescriptions: false }));
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMaterials();
    fetchUoms();
  }, []);

  // Handle project selection
  const handleProjectChange = async (e) => {
    const pd_id = e.target.value;
    setSelectedProject(pd_id);
    setSelectedSite("");
    setMaterialAssignments({});
    setWorkDescriptions([]);
    setError(null);
    if (pd_id) {
      await fetchSites(pd_id);
    } else {
      setSites([]);
    }
  };

  // Handle site selection
  const handleSiteChange = async (e) => {
    const site_id = e.target.value;
    setSelectedSite(site_id);
    setMaterialAssignments({});
    setError(null);
    if (site_id) {
      await fetchWorkDescriptions(site_id);
    } else {
      setWorkDescriptions([]);
    }
  };

  // Handle material input changes
  const handleMaterialChange = (desc_id, matIndex, e) => {
    const { name, value } = e.target;
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: prev[desc_id].map((mat, i) =>
        i === matIndex ? { ...mat, [name]: value } : mat
      ),
    }));
    setError(null);
  };

  // Add new material to a work description
  const handleAddMaterial = (desc_id) => {
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: [
        ...prev[desc_id],
        {
          item_id: "",
          uom_id: "",
          quantity: "",
          comp_ratio_a: "",
          comp_ratio_b: "",
          comp_ratio_c: "",
        },
      ],
    }));
    setError(null);
  };

  // Remove material from a work description
  const handleRemoveMaterial = (desc_id, matIndex) => {
    setMaterialAssignments((prev) => {
      const materials = prev[desc_id];
      if (materials.length <= 1) {
        setError(`At least one material assignment is required for ${workDescriptions.find((desc) => desc.desc_id === desc_id)?.desc_name || "work description"}.`);
        return prev;
      }
      return {
        ...prev,
        [desc_id]: materials.filter((_, i) => i !== matIndex),
      };
    });
  };

  // Submit assignments
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      if (!selectedProject) {
        setError("Please select a project.");
        return;
      }
      if (!selectedSite) {
        setError("Please select a site.");
        return;
      }

      const validationErrors = [];
      const usedMaterials = new Set();
      Object.entries(materialAssignments).forEach(([desc_id, materials]) => {
        const descName = workDescriptions.find((desc) => desc.desc_id === desc_id)?.desc_name || `Work Description ${desc_id}`;
        materials.forEach((row, index) => {
          const materialKey = `${desc_id}-${row.item_id}`;
          if (!row.item_id) {
            validationErrors.push(`${descName}, Row ${index + 1}: Material is required`);
          } else if (usedMaterials.has(materialKey)) {
            validationErrors.push(`${descName}, Row ${index + 1}: Material must be unique within this work description`);
          } else {
            usedMaterials.add(materialKey);
          }
          if (!row.uom_id) validationErrors.push(`${descName}, Row ${index + 1}: Unit of Measure is required`);
          if (!row.quantity) {
            validationErrors.push(`${descName}, Row ${index + 1}: Quantity is required`);
          } else if (isNaN(row.quantity) || row.quantity <= 0) {
            validationErrors.push(`${descName}, Row ${index + 1}: Quantity must be a positive number`);
          }
        });
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("<br />"));
        return;
      }

      const payload = Object.entries(materialAssignments).flatMap(([desc_id, materials]) =>
        materials.map((row) => ({
          pd_id: selectedProject,
          site_id: selectedSite,
          item_id: row.item_id,
          uom_id: parseInt(row.uom_id),
          quantity: parseInt(row.quantity),
          desc_id: desc_id,
          comp_ratio_a: row.comp_ratio_a ? parseInt(row.comp_ratio_a) : null,
          comp_ratio_b: row.comp_ratio_b ? parseInt(row.comp_ratio_b) : null,
          comp_ratio_c: row.comp_ratio_c ? parseInt(row.comp_ratio_c) : null,
        }))
      );

      if (payload.length === 0) {
        setError("Please add at least one material assignment.");
        return;
      }

      await axios.post("http://103.118.158.33/api/material/assign-material", payload);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Materials Assigned Successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setMaterialAssignments(
        workDescriptions.reduce((acc, desc) => {
          acc[desc.desc_id] = [
            {
              item_id: "",
              uom_id: "",
              quantity: "",
              comp_ratio_a: "",
              comp_ratio_b: "",
              comp_ratio_c: "",
            },
          ];
          return acc;
        }, {})
      );
      setSelectedProject("");
      setSelectedSite("");
      setSites([]);
      setWorkDescriptions([]);
    } catch (error) {
      console.error("Error submitting material assignments:", error);
      setError(error.response?.data?.message || "Failed to assign materials. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Check if form fields should be enabled
  const isFormEnabled = selectedProject && selectedSite;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Material Planning
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage and assign materials to your project sites with ease
          </p>
        </div>

        {loading.projects || loading.materials || loading.uoms || loading.workDescriptions ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 pt-6">
              {error && (
                <div
                  className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm"
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Select Project</label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={handleProjectChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project.pd_id} value={project.pd_id}>
                        {project.project_name || "Unknown Project"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Select Site</label>
                <div className="relative">
                  <select
                    value={selectedSite}
                    onChange={handleSiteChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all disabled:bg-gray-50"
                    required
                    disabled={!selectedProject || loading.sites}
                  >
                    <option value="">Select Site</option>
                    {sites.map((siteInfo) => (
                      <option key={siteInfo.site_id} value={siteInfo.site_id}>
                        {`${siteInfo.site_name || "Unknown Site"} (PO: ${siteInfo.po_number || "N/A"})`}
                      </option>
                    ))}
                  </select>
                  {loading.sites && selectedProject && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              {workDescriptions.length === 0 && isFormEnabled ? (
                <div className="text-center py-8 text-gray-600">
                  No work descriptions available for this site.
                </div>
              ) : (
                workDescriptions.map((desc, index) => (
                  <details
                    key={desc.desc_id}
                    open={index === 0} // Open the first accordion by default
                    className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <summary className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer flex justify-between items-center">
                      <span>{desc.desc_name}</span>
                    </summary>
                    <div className="p-4">
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Material
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit of Measure
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comp Ratio A
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comp Ratio B
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comp Ratio C
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {materialAssignments[desc.desc_id]?.map((mat, matIndex) => (
                              <tr
                                key={matIndex}
                                className="hover:bg-blue-50 transition-colors duration-150"
                              >
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {matIndex + 1}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <select
                                    name="item_id"
                                    value={mat.item_id}
                                    onChange={(e) => handleMaterialChange(desc.desc_id, matIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                                    required
                                    disabled={!isFormEnabled}
                                  >
                                    <option value="">Select Material</option>
                                    {materials.map((material) => (
                                      <option key={material.item_id} value={material.item_id}>
                                        {material.item_name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <select
                                    name="uom_id"
                                    value={mat.uom_id}
                                    onChange={(e) => handleMaterialChange(desc.desc_id, matIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                                    required
                                    disabled={!isFormEnabled}
                                  >
                                    <option value="">Select UOM</option>
                                    {uoms.map((uom) => (
                                      <option key={uom.uom_id} value={uom.uom_id}>
                                        {uom.uom_name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    name="quantity"
                                    value={mat.quantity}
                                    onChange={(e) => handleMaterialChange(desc.desc_id, matIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                                    required
                                    disabled={!isFormEnabled}
                                    min="1"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    name="comp_ratio_a"
                                    value={mat.comp_ratio_a}
                                    onChange={(e) => handleMaterialChange(desc.desc_id, matIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                                    disabled={!isFormEnabled}
                                    min="0"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    name="comp_ratio_b"
                                    value={mat.comp_ratio_b}
                                    onChange={(e) => handleMaterialChange(desc.desc_id, matIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                                    disabled={!isFormEnabled}
                                    min="0"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    name="comp_ratio_c"
                                    value={mat.comp_ratio_c}
                                    onChange={(e) => handleMaterialChange(desc.desc_id, matIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                                    disabled={!isFormEnabled}
                                    min="0"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMaterial(desc.desc_id, matIndex)}
                                    disabled={materialAssignments[desc.desc_id]?.length <= 1 || !isFormEnabled}
                                    className={`p-1.5 rounded-md transition ${
                                      materialAssignments[desc.desc_id]?.length <= 1 || !isFormEnabled
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-red-600 hover:bg-red-50"
                                    }`}
                                    title={
                                      materialAssignments[desc.desc_id]?.length <= 1
                                        ? "At least one material is required"
                                        : "Remove this entry"
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddMaterial(desc.desc_id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                        disabled={!isFormEnabled}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Material
                      </button>
                    </div>
                  </details>
                ))
              )}
            </div>

            {workDescriptions.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={loading.submitting || !isFormEnabled}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
                >
                  {loading.submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Assign Materials
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignMaterial;