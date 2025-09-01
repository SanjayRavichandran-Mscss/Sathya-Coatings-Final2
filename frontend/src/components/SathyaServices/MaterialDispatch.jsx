import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Loader2, Package, Calendar, Truck, X } from "lucide-react";

const MaterialDispatch = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [dcNo, setDcNo] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState({
    projects: false,
    materials: false,
    uoms: false,
    sites: false,
    assignments: false,
    submitting: false,
  });
  const [error, setError] = useState(null);

  // Generate a random DC number
  const generateDcNo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://localhost:5000/material/projects");
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.response?.data?.message || "Failed to load projects. Please try again.");
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
      setError(error.response?.data?.message || "Failed to load sites. Please try again.");
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      const response = await axios.get("http://localhost:5000/material/materials");
      setMaterials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError(error.response?.data?.message || "Failed to load materials. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Fetch UOMs
  const fetchUoms = async () => {
    try {
      setLoading((prev) => ({ ...prev, uoms: true }));
      const response = await axios.get("http://localhost:5000/material/uom");
      setUoms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching UOMs:", error);
      setError(error.response?.data?.message || "Failed to load UOMs. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, uoms: false }));
    }
  };

  // Fetch material assignments
  const fetchAssignments = async (pd_id, site_id) => {
    try {
      setLoading((prev) => ({ ...prev, assignments: true }));
      const response = await axios.get(
        `http://localhost:5000/material/assignments?pd_id=${pd_id}&site_id=${site_id}`
      );
      const assignments = response.data.data || [];
      const updatedRows = assignments.map((assignment) => {
        const totalRatio = (assignment.comp_ratio_a || 0) + (assignment.comp_ratio_b || 0) + (assignment.comp_ratio_c || 0);
        let comp_a_qty = 0, comp_b_qty = 0, comp_c_qty = 0;
        if (totalRatio > 0) {
          const quantity = parseFloat(assignment.quantity) || 0;
          comp_a_qty = assignment.comp_ratio_a
            ? Math.round((quantity * assignment.comp_ratio_a) / totalRatio)
            : 0;
          comp_b_qty = assignment.comp_ratio_b
            ? Math.round((quantity * assignment.comp_ratio_b) / totalRatio)
            : 0;
          comp_c_qty = assignment.comp_ratio_c
            ? Math.round((quantity * assignment.comp_ratio_c) / totalRatio)
            : 0;
          const sum = comp_a_qty + comp_b_qty + comp_c_qty;
          if (sum !== quantity) {
            comp_c_qty += quantity - sum; // Adjust comp_c_qty to match total quantity
          }
        }
        return {
          material_assign_id: assignment.id,
          item_id: assignment.item_id,
          uom_id: assignment.uom_id,
          dispatch_qty: assignment.quantity.toString(),
          comp_a_qty: comp_a_qty.toString(),
          comp_b_qty: comp_b_qty.toString(),
          comp_c_qty: comp_c_qty.toString(),
          comp_a_remarks: "",
          comp_b_remarks: "",
          comp_c_remarks: "",
        };
      });
      setRows(updatedRows);
      setAssignments(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.sqlMessage ||
          "Failed to load assignments. Please check if the project and site have assigned materials."
      );
      setRows([]);
    } finally {
      setLoading((prev) => ({ ...prev, assignments: false }));
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMaterials();
    fetchUoms();
    setDcNo(generateDcNo());
  }, []);

  // Handle project selection
  const handleProjectChange = async (e) => {
    const pd_id = e.target.value;
    setSelectedProject(pd_id);
    setSelectedSite("");
    setRows([]);
    setAssignments([]);
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
    setRows([]);
    setAssignments([]);
    setError(null);
    if (site_id && selectedProject) {
      await fetchAssignments(selectedProject, site_id);
    }
  };

  // Handle input changes for table rows
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };
    setRows(updatedRows);
    setError(null);
  };

  // Handle form input changes
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dc_no") setDcNo(value);
    if (name === "dispatch_date") setDispatchDate(value);
    if (name === "order_no") setOrderNo(value);
    if (name === "vendor_code") setVendorCode(value);
    setError(null);
  };

  // Handle submit
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
      if (!dcNo || isNaN(dcNo)) {
        setError("DC Number is required and must be a number.");
        return;
      }
      if (!dispatchDate) {
        setError("Dispatch Date is required.");
        return;
      }

      const validationErrors = [];
      rows.forEach((row, index) => {
        if (!row.material_assign_id) {
          validationErrors.push(`Row ${index + 1}: Material assignment is required`);
        }
        if (!row.dispatch_qty || isNaN(row.dispatch_qty) || parseFloat(row.dispatch_qty) <= 0) {
          validationErrors.push(`Row ${index + 1}: Dispatch Quantity must be a positive number`);
        }
        if (row.comp_a_qty && (isNaN(row.comp_a_qty) || parseInt(row.comp_a_qty) < 0)) {
          validationErrors.push(`Row ${index + 1}: Component A Quantity must be a non-negative number`);
        }
        if (row.comp_b_qty && (isNaN(row.comp_b_qty) || parseInt(row.comp_b_qty) < 0)) {
          validationErrors.push(`Row ${index + 1}: Component B Quantity must be a non-negative number`);
        }
        if (row.comp_c_qty && (isNaN(row.comp_c_qty) || parseInt(row.comp_c_qty) < 0)) {
          validationErrors.push(`Row ${index + 1}: Component C Quantity must be a non-negative number`);
        }
        if (row.comp_a_remarks && row.comp_a_remarks.length > 255) {
          validationErrors.push(`Row ${index + 1}: Component A Remarks must not exceed 255 characters`);
        }
        if (row.comp_b_remarks && row.comp_b_remarks.length > 255) {
          validationErrors.push(`Row ${index + 1}: Component B Remarks must not exceed 255 characters`);
        }
        if (row.comp_c_remarks && row.comp_c_remarks.length > 255) {
          validationErrors.push(`Row ${index + 1}: Component C Remarks must not exceed 255 characters`);
        }
        if (orderNo && orderNo.length > 50) {
          validationErrors.push(`Order Number must not exceed 50 characters`);
        }
        if (vendorCode && vendorCode.length > 50) {
          validationErrors.push(`Vendor Code must not exceed 50 characters`);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("<br />"));
        return;
      }

      const payload = rows.map((row) => ({
        material_assign_id: parseInt(row.material_assign_id),
        dc_no: parseInt(dcNo),
        dispatch_date: dispatchDate,
        dispatch_qty: parseFloat(row.dispatch_qty),
        comp_a_qty: row.comp_a_qty ? parseInt(row.comp_a_qty) : null,
        comp_b_qty: row.comp_b_qty ? parseInt(row.comp_b_qty) : null,
        comp_c_qty: row.comp_c_qty ? parseInt(row.comp_c_qty) : null,
        comp_a_remarks: row.comp_a_remarks || null,
        comp_b_remarks: row.comp_b_remarks || null,
        comp_c_remarks: row.comp_c_remarks || null,
        order_no: orderNo || null,
        vendor_code: vendorCode || null,
      }));

      await axios.post("http://localhost:5000/material/dispatch-material", payload);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Materials Dispatched Successfully!",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "bg-white rounded-xl shadow-xl border border-green-100",
          title: "text-green-800 font-semibold",
        },
      });

      setRows([]);
      setAssignments([]);
      setSelectedProject("");
      setSelectedSite("");
      setSites([]);
      setDcNo(generateDcNo());
      setDispatchDate("");
      setOrderNo("");
      setVendorCode("");
    } catch (error) {
      console.error("Error dispatching materials:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.sqlMessage ||
          "Failed to dispatch materials. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Material Dispatch Management
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Dispatch materials to project sites with delivery details
          </p>
        </div>

        {loading.projects || loading.materials || loading.uoms ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-2" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 pt-4">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
                  <div dangerouslySetInnerHTML={{ __html: error }} />
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                    aria-label="Close error message"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="dc_no">
                  DC No
                </label>
                <input
                  type="text"
                  id="dc_no"
                  name="dc_no"
                  value={dcNo}
                  onChange={handleFormInputChange}
                  placeholder="Enter DC No"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="dispatch_date">
                  Dispatch Date
                </label>
                <input
                  type="date"
                  id="dispatch_date"
                  name="dispatch_date"
                  value={dispatchDate}
                  onChange={handleFormInputChange}
                  placeholder="dd-mm-yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="order_no">
                  Order Number
                </label>
                <input
                  type="text"
                  id="order_no"
                  name="order_no"
                  value={orderNo}
                  onChange={handleFormInputChange}
                  placeholder="e.g., 3600025256"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="vendor_code">
                  Vendor Code
                </label>
                <input
                  type="text"
                  id="vendor_code"
                  name="vendor_code"
                  value={vendorCode}
                  onChange={handleFormInputChange}
                  placeholder="e.g., DS1750"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="project">
                  Select Project
                </label>
                <select
                  id="project"
                  value={selectedProject}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.pd_id} value={project.pd_id}>
                      {project.project_name || "N/A"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="site">
                  Select Site
                </label>
                <select
                  id="site"
                  value={selectedSite}
                  onChange={handleSiteChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  required
                  disabled={!selectedProject || loading.sites}
                >
                  <option value="">Select Site</option>
                  {sites.map((site) => (
                    <option key={site.site_id} value={site.site_id}>
                      {`${site.site_name || "N/A"} (PO: ${site.po_number || "N/A"})`}
                    </option>
                  ))}
                </select>
                {loading.sites && selectedProject && (
                  <Loader2 className="h-4 w-4 text-teal-600 animate-spin ml-2 inline" />
                )}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Site Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Material Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" aria-hidden="true" />
                        Assigned At
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Dispatch Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Comp A Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Comp A Remarks
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Comp B Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Comp B Remarks
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Comp C Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                      Comp C Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="px-6 py-4 text-center text-sm text-gray-500">
                        No assignments found. Select a project and site to view materials.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <tr
                        key={row.material_assign_id}
                        className="hover:bg-teal-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {assignments.find((a) => a.id === row.material_assign_id)?.project_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {assignments.find((a) => a.id === row.material_assign_id)?.site_name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              PO: {assignments.find((a) => a.id === row.material_assign_id)?.po_number || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {materials.find((m) => m.item_id === row.item_id)?.item_name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              UOM: {uoms.find((u) => u.uom_id === row.uom_id)?.uom_name || "N/A"}
                            </p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              Qty: {assignments.find((a) => a.id === row.material_assign_id)?.quantity || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal-600" aria-hidden="true" />
                            <span>
                              {assignments.find((a) => a.id === row.material_assign_id)?.created_at
                                ? new Date(assignments.find((a) => a.id === row.material_assign_id).created_at).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="dispatch_qty"
                            value={row.dispatch_qty}
                            onChange={(e) => handleInputChange(index, e)}
                            step="0.01"
                            placeholder="Enter Quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="comp_a_qty"
                            value={row.comp_a_qty}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="comp_a_remarks"
                            value={row.comp_a_remarks}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Enter Remarks"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                            maxLength="255"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="comp_b_qty"
                            value={row.comp_b_qty}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="comp_b_remarks"
                            value={row.comp_b_remarks}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Enter Remarks"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                            maxLength="255"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="comp_c_qty"
                            value={row.comp_c_qty}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="comp_c_remarks"
                            value={row.comp_c_remarks}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder="Enter Remarks"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                            maxLength="255"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6 px-6 py-4">
              {rows.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                  <p className="text-gray-600 text-lg font-medium">No assignments found.</p>
                  <p className="text-gray-500 mt-2">Select a project and site to view materials.</p>
                </div>
              ) : (
                rows.map((row, index) => (
                  <div
                    key={row.material_assign_id}
                    className="bg-white rounded-lg shadow-md p-5 border border-gray-100"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Project</p>
                        <p className="text-sm text-gray-600">
                          {assignments.find((a) => a.id === row.material_assign_id)?.project_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Site Details</p>
                        <p className="text-sm text-gray-600">
                          {assignments.find((a) => a.id === row.material_assign_id)?.site_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PO: {assignments.find((a) => a.id === row.material_assign_id)?.po_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Material Details</p>
                        <p className="text-sm text-gray-600">
                          {materials.find((m) => m.item_id === row.item_id)?.item_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          UOM: {uoms.find((u) => u.uom_id === row.uom_id)?.uom_name || "N/A"}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-1">
                          Qty: {assignments.find((a) => a.id === row.material_assign_id)?.quantity || "N/A"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-teal-600" aria-hidden="true" />
                          Assigned At
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignments.find((a) => a.id === row.material_assign_id)?.created_at
                            ? new Date(assignments.find((a) => a.id === row.material_assign_id).created_at).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dispatch Quantity</p>
                        <input
                          type="number"
                          name="dispatch_qty"
                          value={row.dispatch_qty}
                          onChange={(e) => handleInputChange(index, e)}
                          step="0.01"
                          placeholder="Enter Quantity"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Component A Quantity</p>
                        <input
                          type="number"
                          name="comp_a_qty"
                          value={row.comp_a_qty}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Component A Remarks</p>
                        <input
                          type="text"
                          name="comp_a_remarks"
                          value={row.comp_a_remarks}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter Remarks"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          maxLength="255"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Component B Quantity</p>
                        <input
                          type="number"
                          name="comp_b_qty"
                          value={row.comp_b_qty}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Component B Remarks</p>
                        <input
                          type="text"
                          name="comp_b_remarks"
                          value={row.comp_b_remarks}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter Remarks"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          maxLength="255"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Component C Quantity</p>
                        <input
                          type="number"
                          name="comp_c_qty"
                          value={row.comp_c_qty}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Component C Remarks</p>
                        <input
                          type="text"
                          name="comp_c_remarks"
                          value={row.comp_c_remarks}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Enter Remarks"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                          maxLength="255"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
              <button
                type="submit"
                disabled={loading.submitting || !selectedProject || !selectedSite || rows.length === 0}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading.submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Truck className="h-5 w-5 mr-2" />
                    Dispatch Materials
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MaterialDispatch;