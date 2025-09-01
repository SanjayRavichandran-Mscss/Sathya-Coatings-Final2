import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const MaterialUsage = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [dispatchData, setDispatchData] = useState([]);
  const [ackDetails, setAckDetails] = useState({});
  const [usageInputs, setUsageInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch projects and sites
    const fetchProjectsAndSites = async () => {
      try {
        const response = await axios.get("http://localhost:5000/project/projects-with-sites");
        setProjects(response.data || []);
      } catch (err) {
        setError("Failed to fetch projects and sites");
        toast.error("Failed to fetch projects and sites");
      }
    };
    fetchProjectsAndSites();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // Filter sites for selected project
      const selectedProjectData = projects.find(project => project.project_id === selectedProject.value);
      setSites(selectedProjectData ? selectedProjectData.sites : []);
      setSelectedSite(null);
      setDispatchData([]);
      setAckDetails({});
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      // Fetch dispatch details
      const fetchDispatchDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/material/dispatch-details/?pd_id=${selectedProject.value}&site_id=${selectedSite.value}`
          );
          // Remove duplicates based on composite key (id and transport_details.id)
          const uniqueDispatches = [];
          const seenKeys = new Set();
          (response.data.data || []).forEach(dispatch => {
            const compositeKey = `${dispatch.id}-${dispatch.transport_details.id}`;
            if (!seenKeys.has(compositeKey)) {
              seenKeys.add(compositeKey);
              uniqueDispatches.push(dispatch);
            }
          });
          setDispatchData(uniqueDispatches);

          // Fetch acknowledgement details for each dispatch
          const ackPromises = uniqueDispatches.map(dispatch =>
            axios.get(
              `http://localhost:5000/site-incharge/acknowledgement-details?material_dispatch_id=${dispatch.id}`
            ).catch(err => ({ data: { data: [] } })) // Handle cases where no acknowledgement exists
          );

          const ackResponses = await Promise.all(ackPromises);
          const ackMap = {};
          ackResponses.forEach((ackResponse, index) => {
            const dispatchId = uniqueDispatches[index].id;
            const ackData = ackResponse.data.data[0] || null;
            ackMap[dispatchId] = ackData;
          });
          setAckDetails(ackMap);
          setError(null);
        } catch (err) {
          setError("Failed to fetch dispatch or acknowledgement details");
          toast.error("Failed to fetch dispatch or acknowledgement details");
        } finally {
          setLoading(false);
        }
      };
      fetchDispatchDetails();
    }
  }, [selectedProject, selectedSite]);

  const handleSaveUsage = async (compositeKey) => {
    const usageData = usageInputs[compositeKey];
    if (!usageData) return;

    try {
      const [materialDispatchId, ackId] = compositeKey.split('-').map(Number);
      const response = await axios.post("http://localhost:5000/site-incharge/save-material-usage", {
        material_ack_id: ackId,
        comp_a_qty: usageData.comp_a_qty !== "" ? parseInt(usageData.comp_a_qty) : null,
        comp_b_qty: usageData.comp_b_qty !== "" ? parseInt(usageData.comp_b_qty) : null,
        comp_c_qty: usageData.comp_c_qty !== "" ? parseInt(usageData.comp_c_qty) : null,
        comp_a_remarks: usageData.comp_a_remarks || null,
        comp_b_remarks: usageData.comp_b_remarks || null,
        comp_c_remarks: usageData.comp_c_remarks || null,
      });
      toast.success(response.data.message);
      // Optionally, refresh or update UI state here
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save material usage");
    }
  };

  const handleInputChange = (compositeKey, field, value) => {
    setUsageInputs(prev => ({
      ...prev,
      [compositeKey]: {
        ...prev[compositeKey],
        [field]: value
      }
    }));
  };

  // Format item and ratios
  const formatItemAndRatios = (dispatch) => {
    const ratios = [dispatch.comp_ratio_a, dispatch.comp_ratio_b];
    if (dispatch.comp_ratio_c !== null) {
      ratios.push(dispatch.comp_ratio_c);
    }
    return `${dispatch.item_name} (${ratios.join(':')})`;
  };

  // Prepare options for react-select
  const projectOptions = projects.map(project => ({
    value: project.project_id,
    label: project.project_name
  }));

  const siteOptions = sites.map(site => ({
    value: site.site_id,
    label: site.site_name
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Material Usage</h2>
      
      {/* Project and Site Selection */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
          <Select
            options={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Search Project..."
            isSearchable
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Site</label>
          <Select
            options={siteOptions}
            value={selectedSite}
            onChange={setSelectedSite}
            placeholder="Search Site..."
            isSearchable
            isDisabled={!selectedProject}
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {/* Acknowledgement and Usage Details */}
      {dispatchData.length > 0 && (
        <div className="space-y-4">
          {dispatchData.map(dispatch => {
            const ack = ackDetails[dispatch.id];
            if (!ack || !ack.acknowledgement) return null; // Skip if no acknowledgement exists
            const compositeKey = `${dispatch.id}-${ack.acknowledgement.id}`;
            return (
              <div key={compositeKey} className="border rounded-lg p-4 bg-white shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {formatItemAndRatios(dispatch)}
                </h3>
                <div className="space-y-2">
                  {/* Acknowledgement Details */}
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Acknowledgement Details</h4>
                    <div className="space-y-2">
                      <p><strong>Comp A:</strong> {ack.acknowledgement.comp_a_qty !== null ? `${ack.acknowledgement.comp_a_qty} (${ack.acknowledgement.comp_a_remarks || 'No remarks'})` : 'Not acknowledged'}</p>
                      <p><strong>Comp B:</strong> {ack.acknowledgement.comp_b_qty !== null ? `${ack.acknowledgement.comp_b_qty} (${ack.acknowledgement.comp_b_remarks || 'No remarks'})` : 'Not acknowledged'}</p>
                      {ack.acknowledgement.comp_c_qty !== null && (
                        <p><strong>Comp C:</strong> {`${ack.acknowledgement.comp_c_qty} (${ack.acknowledgement.comp_c_remarks || 'No remarks'})`}</p>
                      )}
                    </div>
                  </div>
                  {/* Material Usage Input */}
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Record Material Usage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['comp_a', 'comp_b', 'comp_c'].map(comp => (
                        (ack.acknowledgement[`${comp}_qty`] !== null || comp !== 'comp_c') && (
                          <div key={comp} className={ack.acknowledgement[`${comp}_qty`] === null ? 'opacity-50' : ''}>
                            <h5 className="text-sm font-medium text-gray-600 capitalize">{comp.replace('_', ' ')}</h5>
                            <input
                              type="number"
                              placeholder="Quantity Used"
                              value={usageInputs[compositeKey]?.[`${comp}_qty`] || ""}
                              onChange={(e) => handleInputChange(compositeKey, `${comp}_qty`, e.target.value)}
                              className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              disabled={ack.acknowledgement[`${comp}_qty`] === null}
                              min="0"
                            />
                            <input
                              type="text"
                              placeholder="Remarks"
                              value={usageInputs[compositeKey]?.[`${comp}_remarks`] || ""}
                              onChange={(e) => handleInputChange(compositeKey, `${comp}_remarks`, e.target.value)}
                              className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              disabled={ack.acknowledgement[`${comp}_qty`] === null}
                            />
                          </div>
                        )
                      ))}
                    </div>
                    <button
                      onClick={() => handleSaveUsage(compositeKey)}
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                      disabled={!usageInputs[compositeKey] || Object.values(usageInputs[compositeKey]).every(val => val === "")}
                    >
                      Save Material Usage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

export default MaterialUsage;