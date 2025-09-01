import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const MaterialAcknowledgement = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [dispatchData, setDispatchData] = useState([]);
  const [acknowledgements, setAcknowledgements] = useState({});
  const [ackDetails, setAckDetails] = useState({});
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
          
          // Create a map to store unique dispatches by their ID
          const dispatchMap = new Map();
          (response.data.data || []).forEach(dispatch => {
            if (!dispatchMap.has(dispatch.id)) {
              dispatchMap.set(dispatch.id, dispatch);
            }
          });
          
          // Convert map values back to array
          const uniqueDispatches = Array.from(dispatchMap.values());
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

  const handleAcknowledge = async (dispatchId) => {
    const ackData = acknowledgements[dispatchId];
    if (!ackData) return;

    try {
      const response = await axios.post("http://localhost:5000/site-incharge/acknowledge-material", {
        material_dispatch_id: parseInt(dispatchId),
        comp_a_qty: ackData.comp_a_qty !== "" ? parseInt(ackData.comp_a_qty) : null,
        comp_b_qty: ackData.comp_b_qty !== "" ? parseInt(ackData.comp_b_qty) : null,
        comp_c_qty: ackData.comp_c_qty !== "" ? parseInt(ackData.comp_c_qty) : null,
        comp_a_remarks: ackData.comp_a_remarks || null,
        comp_b_remarks: ackData.comp_b_remarks || null,
        comp_c_remarks: ackData.comp_c_remarks || null,
      });
      toast.success(response.data.message);
      // Refresh acknowledgement data for the specific dispatch
      const responseRefresh = await axios.get(
        `http://localhost:5000/site-incharge/acknowledgement-details?material_dispatch_id=${dispatchId}`
      );
      setAckDetails(prev => ({
        ...prev,
        [dispatchId]: responseRefresh.data.data[0] || null
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save acknowledgement");
    }
  };

  const handleInputChange = (dispatchId, field, value) => {
    setAcknowledgements(prev => ({
      ...prev,
      [dispatchId]: {
        ...prev[dispatchId],
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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Material Acknowledgement</h2>
      
      {/* Project and Site Selection */}
      <div className="mb-6 space-y-4">
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

      {loading && <div className="text-center text-gray-600 py-4">Loading...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      {/* Dispatch Details */}
      {dispatchData.length > 0 && (
        <div className="space-y-4">
          {dispatchData.map(dispatch => {
            const ack = ackDetails[dispatch.id];
            return (
              <div key={dispatch.id} className="border rounded-lg p-4 bg-white shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {formatItemAndRatios(dispatch)}
                </h3>
         
                {/* Quantities dispatched */}
                <div className="mb-3">
                  <h4 className="text-md font-medium text-gray-700 mb-1">Dispatched Quantities</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {dispatch.comp_a_qty !== null && (
                      <div>
                        <span className="font-medium">Comp A:</span> {dispatch.comp_a_qty}
                      </div>
                    )}
                    {dispatch.comp_b_qty !== null && (
                      <div>
                        <span className="font-medium">Comp B:</span> {dispatch.comp_b_qty}
                      </div>
                    )}
                    {dispatch.comp_c_qty !== null && (
                      <div>
                        <span className="font-medium">Comp C:</span> {dispatch.comp_c_qty}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acknowledgement Section */}
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Acknowledge Receipt</h4>
                  {ack && ack.acknowledgement ? (
                    <div className="space-y-2 text-sm">
                      {ack.acknowledgement.comp_a_qty !== null && (
                        <p><strong>Comp A:</strong> {ack.acknowledgement.comp_a_qty} ({ack.acknowledgement.comp_a_remarks || 'No remarks'})</p>
                      )}
                      {ack.acknowledgement.comp_b_qty !== null && (
                        <p><strong>Comp B:</strong> {ack.acknowledgement.comp_b_qty} ({ack.acknowledgement.comp_b_remarks || 'No remarks'})</p>
                      )}
                      {ack.acknowledgement.comp_c_qty !== null && (
                        <p><strong>Comp C:</strong> {ack.acknowledgement.comp_c_qty} ({ack.acknowledgement.comp_c_remarks || 'No remarks'})</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {['comp_a', 'comp_b', 'comp_c'].map(comp => (
                          (dispatch[`${comp}_qty`] !== null || comp !== 'comp_c') && (
                            <div key={comp} className={dispatch[`${comp}_qty`] === null ? 'opacity-50' : ''}>
                              <h5 className="text-sm font-medium text-gray-600 capitalize mb-1">{comp.replace('_', ' ')}</h5>
                              <input
                                type="number"
                                placeholder="Quantity"
                                value={acknowledgements[dispatch.id]?.[`${comp}_qty`] || ""}
                                onChange={(e) => handleInputChange(dispatch.id, `${comp}_qty`, e.target.value)}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                disabled={dispatch[`${comp}_qty`] === null}
                                min="0"
                              />
                              <input
                                type="text"
                                placeholder="Remarks"
                                value={acknowledgements[dispatch.id]?.[`${comp}_remarks`] || ""}
                                onChange={(e) => handleInputChange(dispatch.id, `${comp}_remarks`, e.target.value)}
                                className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                disabled={dispatch[`${comp}_qty`] === null}
                              />
                            </div>
                          )
                        ))}
                      </div>
                      <button
                        onClick={() => handleAcknowledge(dispatch.id)}
                        className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                        disabled={!acknowledgements[dispatch.id] || Object.values(acknowledgements[dispatch.id] || {}).every(val => val === "" || val === null)}
                      >
                        Save Acknowledgement
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default MaterialAcknowledgement;