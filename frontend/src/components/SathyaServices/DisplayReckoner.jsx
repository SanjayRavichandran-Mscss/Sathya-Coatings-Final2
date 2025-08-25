import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  ChevronDown,
  UserPlus,
  Package,
  Truck,
  HardHat,
  CalendarCheck,
} from "lucide-react";
import AssignSiteIncharge from "./AssignSiteIncharge";
import ViewAssignedIncharges from "./ViewAssignedIncharges";
import MaterialPlanning from "./AssignMaterial";
import MaterialDispatch from "./ViewAssignedMaterial";

const DisplayReckoner = () => {
  const { encodedUserId } = useParams();
  let createdBy = null;
  try {
    createdBy = encodedUserId ? atob(encodedUserId) : null;
  } catch (error) {
    console.error("Error decoding encodedUserId:", error);
  }

  const [reckonerData, setReckonerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [poGroups, setPoGroups] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [loadingSite, setLoadingSite] = useState(false);
  const [siteOptions, setSiteOptions] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedSiteDetails, setSelectedSiteDetails] = useState({
    po_number: "",
    site_name: "",
    site_id: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSites, setLoadingSites] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAssignIncharge, setShowAssignIncharge] = useState(false);
  const [showMaterialPlanning, setShowMaterialPlanning] = useState(false);
  const [showMaterialDispatch, setShowMaterialDispatch] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
    fetchReckonerData();
    // eslint-disable-next-line
  }, [selectedSite]);

  useEffect(() => {
    if (reckonerData.length > 0 && selectedSite) {
      const filtered = reckonerData.filter((item) => item.po_number === selectedSite);
      setFilteredData(filtered);
      groupDataByPoNumber(filtered);
    } else {
      setFilteredData(reckonerData);
      groupDataByPoNumber(reckonerData);
    }
    // eslint-disable-next-line
  }, [reckonerData, selectedSite]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSites = async () => {
    try {
      setLoadingSites(true);
      const res = await axios.get("http://localhost:5000/reckoner/sites");
      if (res.data.success) {
        const options = res.data.data.map((site) => ({
          po_number: site.po_number,
          site_name: site.site_name,
          site_id: site.site_id,
          label: `${site.site_name} (PO: ${site.po_number})`,
        }));
        setSiteOptions(options);
        if (options.length > 0 && !selectedSite) {
          setSelectedSite(options[0].po_number);
          setSelectedSiteDetails({
            po_number: options[0].po_number,
            site_name: options[0].site_name,
            site_id: options[0].site_id,
          });
          fetchSiteInfo(options[0].po_number);
        }
      } else {
        showAlert("error", "Failed to fetch site options");
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      showAlert("error", "Failed to fetch site options");
    } finally {
      setLoadingSites(false);
    }
  };

  const groupDataByPoNumber = (data) => {
    const groups = {};
    data.forEach((item) => {
      if (!groups[item.po_number]) groups[item.po_number] = [];
      groups[item.po_number].push(item);
    });
    setPoGroups(Object.values(groups));
  };

  const fetchSiteInfo = async (poNumber) => {
    try {
      setLoadingSite(true);
      const res = await axios.get(`http://localhost:5000/reckoner/sites/${poNumber}`);
      if (res.data.success) {
        setSiteInfo(res.data.data);
        setSelectedSiteDetails({
          po_number: poNumber,
          site_name: res.data.data.site_name,
          site_id: res.data.data.site_id,
        });
      } else {
        const fallbackSite = siteOptions.find((option) => option.po_number === poNumber);
        setSiteInfo(
          fallbackSite
            ? {
                site_name: fallbackSite.site_name,
                site_id: fallbackSite.site_id,
              }
            : null
        );
        setSelectedSiteDetails({
          po_number: poNumber,
          site_name: fallbackSite?.site_name || "",
          site_id: fallbackSite?.site_id || "",
        });
      }
    } catch (error) {
      console.error("Error fetching site info:", error);
      const fallbackSite = siteOptions.find((option) => option.po_number === poNumber);
      setSiteInfo(
        fallbackSite
          ? {
              site_name: fallbackSite.site_name,
              site_id: fallbackSite.site_id,
            }
          : null
      );
      setSelectedSiteDetails({
        po_number: poNumber,
        site_name: fallbackSite?.site_name || "",
        site_id: fallbackSite?.site_id || "",
      });
    } finally {
      setLoadingSite(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const fetchReckonerData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/reckoner/reckoner/");
      const data = res.data.success ? res.data.data : [];
      const updatedData = data.map((item) => {
        const completedQty = parseFloat(item.area_completed) || 0;
        const completedValue = parseFloat(item.completion_value) || 0;
        const poQty = parseFloat(item.po_quantity) || 0;
        const poValue = parseFloat(item.value) || 0;
        const balanceQty = poQty - completedQty;
        const balanceValue = poValue - completedValue;
        let work_status;
        if (completedQty === 0 || completedValue === 0) {
          work_status = "Pending";
        } else if (balanceQty <= 0 && balanceValue <= 0) {
          work_status = "Completed";
        } else {
          work_status = "In Progress";
        }
        return {
          ...item,
          work_status,
        };
      });
      setReckonerData(updatedData);
      if (selectedSite) {
        setFilteredData(updatedData.filter((item) => item.po_number === selectedSite));
      } else {
        setFilteredData(updatedData);
      }
    } catch (error) {
      console.error(error);
      showAlert("error", "Failed to fetch reckoner data");
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelect = (poNumber) => {
    setSelectedSite(poNumber);
    const selected = siteOptions.find((option) => option.po_number === poNumber);
    setSelectedSiteDetails({
      po_number: poNumber,
      site_name: selected?.site_name || "",
      site_id: selected?.site_id || "",
    });
    fetchSiteInfo(poNumber);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

  const closeGradeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowMaterialPlanning(false);
      setShowAssignIncharge(false);
      setShowMaterialDispatch(false);
      setIsModalClosing(false);
    }, 400);
  };

  const handleEdit = (record) => {
    setEditingId(record.rec_id);
    setEditingData({
      area_completed: record.area_completed,
      value: record.completion_value,
      work_status: record.work_status,
    });
  };

  const handleEditChange = (field, value) => {
    setEditingData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "area_completed") {
        const record = filteredData.find((item) => item.rec_id === editingId);
        if (record) {
          const poQty = parseFloat(record.po_quantity) || 0;
          let area = parseFloat(value) || 0;
          if (area > poQty) {
            showAlert("error", "Completed area cannot exceed PO quantity");
            area = poQty;
          }
          const rate = parseFloat(record.rate) || 0;
          newData.area_completed = area.toString();
          newData.value = (area * rate).toFixed(2);
          const poValue = parseFloat(record.value) || 0;
          const balanceQty = poQty - area;
          const balanceValue = poValue - (area * rate);
          if (area === 0) {
            newData.work_status = "Pending";
          } else if (balanceQty <= 0 && balanceValue <= 0) {
            newData.work_status = "Completed";
          } else {
            newData.work_status = "In Progress";
          }
        }
      }
      return newData;
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleSubmit = async (rec_id) => {
    try {
      setSubmitting(true);
      const record = filteredData.find((item) => item.rec_id === rec_id);
      if (!record) {
        showAlert("error", "Record not found");
        return;
      }
      if (!createdBy) {
        showAlert("error", "User ID is required");
        return;
      }
      const area_completed = parseFloat(editingData.area_completed) || 0;
      const rate = parseFloat(record.rate) || 0;
      const value = parseFloat(editingData.value) || 0;
      const poQty = parseFloat(record.po_quantity) || 0;
      const poValue = parseFloat(record.value) || 0;
      const balance_area = poQty - area_completed;
      const balance_value = poValue - value;
      let work_status;
      if (area_completed === 0 || value === 0) {
        work_status = "Pending";
      } else if (balance_area <= 0 && balance_value <= 0) {
        work_status = "Completed";
      } else {
        work_status = "In Progress";
      }
      const payload = {
        rec_id,
        area_completed,
        rate,
        value,
        billed_area: 0, // Default value, adjust if needed
        billed_value: 0, // Default value, adjust if needed
        balance_area,
        balance_value,
        work_status,
        billing_status: "Not Billed", // Default value, adjust if needed
        created_by: createdBy, // Include decoded created_by
      };
      await axios.put(`http://localhost:5000/reckoner/completion_status/${rec_id}`, payload);
      showAlert("success", "Data updated successfully");
      await fetchReckonerData();
      setEditingId(null);
    } catch (error) {
      console.error(error);
      showAlert("error", error.response?.data?.message || "Failed to update data");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusTag = (status) => {
    const icon =
      status === "Completed" ? (
        <CalendarCheck className="w-4 h-4 text-green-600 mr-1" />
      ) : status === "In Progress" ? (
        <HardHat className="w-4 h-4 text-blue-600 mr-1" />
      ) : (
        <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
      );
    const color =
      status === "Completed"
        ? "bg-green-100 text-green-800"
        : status === "In Progress"
        ? "bg-blue-100 text-blue-800"
        : "bg-orange-100 text-orange-800";
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status}
      </div>
    );
  };

  const calculateBalance = (record) => {
    const poQty = parseFloat(record.po_quantity) || 0;
    const completedQty = parseFloat(record.area_completed) || 0;
    const balanceQty = poQty - completedQty;
    const poValue = parseFloat(record.value) || 0;
    const completedValue = parseFloat(record.completion_value) || 0;
    const balanceValue = poValue - completedValue;
    return {
      qty: balanceQty.toFixed(2),
      value: balanceValue.toFixed(2),
    };
  };

  const currentPoGroup = poGroups.find((group) => group[0]?.po_number === selectedSite) || [];
  const filteredSiteOptions = siteOptions.filter(
    (option) =>
      option.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.po_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Assign Site Incharge Modal */}
      {showAssignIncharge && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-400 p-4 ${
            isModalClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className={`bg-white relative w-full max-w-7xl h-[750px] rounded-lg shadow-xl transform transition-all duration-400 ${
              isModalClosing
                ? "opacity-0 scale-90 -translate-y-4"
                : "opacity-100 scale-100 translate-y-0"
            } max-h-[90vh] overflow-auto`}
          >
            <AssignSiteIncharge selectedSite={selectedSiteDetails} />
            <div className="absolute top-4 right-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-200 hover:shadow-md"
                onClick={closeGradeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Planning Modal */}
      {showMaterialPlanning && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-400 p-4 ${
            isModalClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className={`bg-white relative w-full max-w-7xl rounded-lg shadow-xl transform transition-all duration-400 ${
              isModalClosing
                ? "opacity-0 scale-90 -translate-y-4"
                : "opacity-100 scale-100 translate-y-0"
            } max-h-[90vh] overflow-auto`}
          >
            <MaterialPlanning selectedSite={selectedSiteDetails} />
            <div className="absolute top-4 right-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-200 hover:shadow-md"
                onClick={closeGradeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Dispatch Modal */}
      {showMaterialDispatch && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-400 p-4 ${
            isModalClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className={`bg-white relative w-full max-w-7xl rounded-lg shadow-xl transform transition-all duration-400 ${
              isModalClosing
                ? "opacity-0 scale-90 -translate-y-4"
                : "opacity-100 scale-100 translate-y-0"
            } max-h-[90vh] overflow-auto`}
          >
            <MaterialDispatch selectedSite={selectedSiteDetails} />
            <div className="absolute top-4 right-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-200 hover:shadow-md"
                onClick={closeGradeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        {/* Alert Notification */}
        {alert.message && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-transform duration-300 transform ${
              alert.type === "error"
                ? "bg-red-50 text-red-800 border-l-4 border-red-500"
                : "bg-green-50 text-green-800 border-l-4 border-green-500"
            }`}
          >
            <div className="flex items-center">
              {alert.type === "error" ? (
                <AlertCircle className="w-5 h-5 mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Master For Primary Management</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Track and manage your project progress seamlessly
            </p>
          </div>

          {/* Site Selection Dropdown and Action Buttons */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end gap-4" ref={dropdownRef}>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Site</label>
              <div className="relative max-w-md">
                {dropdownOpen ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center px-3 py-2 border-b border-gray-200">
                      <Search className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search sites or PO numbers..."
                        className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
                      />
                      <button
                        onClick={() => setDropdownOpen(false)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {loadingSites ? (
                        <div className="px-4 py-3 text-gray-500 text-sm flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2" />
                          Loading sites...
                        </div>
                      ) : filteredSiteOptions.length === 0 ? (
                        <div className="px-4 py-3 text-gray-500 text-sm">No matching sites found</div>
                      ) : (
                        filteredSiteOptions.map((option) => (
                          <div
                            key={option.po_number}
                            onClick={() => handleSiteSelect(option.po_number)}
                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-indigo-50 transition-colors ${
                              selectedSite === option.po_number
                                ? "bg-indigo-100 text-indigo-800"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="font-medium">{option.site_name}</div>
                            <div className="text-xs text-gray-500">PO: {option.po_number}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDropdownOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  >
                    <div>
                      {selectedSite ? (
                        <>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            {siteOptions.find((opt) => opt.po_number === selectedSite)?.site_name}
                          </div>
                          <div className="text-xs text-gray-500">PO: {selectedSite}</div>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm sm:text-base">Select a site...</span>
                      )}
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAssignIncharge(true)}
                className="px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex items-center text-sm sm:text-base font-medium"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Assign Site Incharge
              </button>
              <button
                onClick={() => setShowMaterialPlanning(true)}
                className="px-4 py-3 bg-purple-600 text-white rounded-xl shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex items-center text-sm sm:text-base font-medium"
              >
                <Package className="h-5 w-5 mr-2" />
                Material Planning
              </button>
              <button
                onClick={() => setShowMaterialDispatch(true)}
                className="px-4 py-3 bg-teal-600 text-white rounded-xl shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all flex items-center text-sm sm:text-base font-medium"
              >
                <Truck className="h-5 w-5 mr-2" />
                Material Dispatch
              </button>
            </div>
          </div>

          {/* Action: Assigned Incharges */}
          <div className="mb-6 sm:mb-8">
            <ViewAssignedIncharges selectedSite={selectedSiteDetails} />
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : currentPoGroup.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center text-gray-500">
              No reckoner data found for the selected site.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {/* Mobile View: Card Layout */}
<div className="md:hidden divide-y divide-gray-200">
  {currentPoGroup.map((r) => {
    const balance = calculateBalance(r);
    return (
      <div key={r.rec_id} className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-gray-900">{r.item_id}</div>
            <div className="text-xs text-gray-500">
              {r.category_name} / {r.subcategory_name}
            </div>
          </div>
          <div className="flex gap-2">
            {editingId === r.rec_id ? (
              <>
                <button
                  onClick={() => handleSubmit(r.rec_id)}
                  disabled={submitting}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(r)}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-900 flex items-center">
          <FileText className="mr-2 h-4 w-4 text-indigo-600" />
          <span className="truncate">{r.work_descriptions}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">PO Details</div>
            <div>Qty: {r.po_quantity} {r.uom}</div>
            <div>Rate: {r.rate}</div>
            <div>Value: {r.value}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Completion</div>
            {editingId === r.rec_id ? (
              <>
                <input
                  type="text"
                  value={editingData.area_completed}
                  onChange={(e) => handleEditChange("area_completed", e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                  placeholder="Area"
                />
                <div className="mt-2">Value: {editingData.value || "0.00"}</div>
              </>
            ) : (
              <>
                <div>Area: {r.area_completed}</div>
                <div>Value: {r.completion_value}</div>
              </>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-700">Balance</div>
            <div>Qty: {balance.qty} {r.uom}</div>
            <div>Value: {balance.value}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Status</div>
            <div className="space-y-2">
              {editingId === r.rec_id
                ? renderStatusTag(editingData.work_status)
                : renderStatusTag(r.work_status)}
              <div className="text-xs text-gray-500">
                By: {r.created_by_name || "Unknown"}
              </div>
              <div className="text-xs text-gray-500">
                Updated: {r.updated_at ? new Date(r.updated_at).toLocaleString() : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
{/* Desktop: Table Layout */}
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700">
        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" rowSpan={2}>
          Item
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" rowSpan={2}>
          Description
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider" colSpan={3}>
          PO Details
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider" colSpan={2}>
          Completion
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider" colSpan={2}>
          Balance
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider" rowSpan={2}>
          Status
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider" rowSpan={2}>
          Action
        </th>
      </tr>
      <tr className="bg-indigo-500">
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Qty</th>
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Rate</th>
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Value</th>
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Area</th>
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Value</th>
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Qty</th>
        <th className="px-2 py-2 text-center text-xs font-semibold text-white">Value</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {currentPoGroup.map((r) => {
        const balance = calculateBalance(r);
        return (
          <tr key={r.rec_id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4 text-sm font-medium text-gray-900">
              <div>{r.item_id}</div>
              <div className="text-xs text-gray-500">
                {r.category_name} / {r.subcategory_name}
              </div>
            </td>
            <td className="px-4 py-4 max-w-xs text-sm text-gray-900">
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                <span className="truncate">{r.work_descriptions}</span>
              </div>
            </td>
            <td className="px-2 py-4 text-center text-sm">{r.po_quantity} {r.uom}</td>
            <td className="px-2 py-4 text-center text-sm">{r.rate}</td>
            <td className="px-2 py-4 text-center text-sm">{r.value}</td>
            {editingId === r.rec_id ? (
              <>
                <td className="px-2 py-4 text-center">
                  <input
                    type="text"
                    value={editingData.area_completed}
                    onChange={(e) => handleEditChange("area_completed", e.target.value)}
                    className="w-20 p-1 border border-gray-300 rounded text-sm text-center"
                    placeholder="Area"
                  />
                </td>
                <td className="px-2 py-4 text-center text-sm">{editingData.value || "0.00"}</td>
              </>
            ) : (
              <>
                <td className="px-2 py-4 text-center text-sm">{r.area_completed}</td>
                <td className="px-2 py-4 text-center text-sm">{r.completion_value}</td>
              </>
            )}
            <td className="px-2 py-4 text-center text-sm">{balance.qty} {r.uom}</td>
            <td className="px-2 py-4 text-center text-sm">{balance.value}</td>
            <td className="px-4 py-4 text-center text-sm space-y-2">
              {editingId === r.rec_id
                ? renderStatusTag(editingData.work_status)
                : renderStatusTag(r.work_status)}
              <div className="text-xs text-gray-500">
                Updated By: {r.created_by_name || ""}
              </div>
              <div className="text-xs text-gray-500">
                Updated at: {r.updated_at ? new Date(r.updated_at).toLocaleString() : ""}
              </div>
            </td>
            <td className="px-4 py-4 text-right text-sm">
              {editingId === r.rec_id ? (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleSubmit(r.rec_id)}
                    disabled={submitting}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                  >
                    <Save className="mr-1 h-4 w-4" /> Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
                  >
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(r)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayReckoner;