// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Select from "react-select";

// const MaterialUsage = () => {
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedSite, setSelectedSite] = useState(null);
//   const [dispatchData, setDispatchData] = useState([]);
//   const [ackDetails, setAckDetails] = useState({});
//   const [usageInputs, setUsageInputs] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProjectsAndSites = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/project/projects-with-sites");
//         setProjects(response.data || []);
//       } catch (err) {
//         setError("Failed to fetch projects and sites");
//         toast.error("Failed to fetch projects and sites");
//       }
//     };
//     fetchProjectsAndSites();
//   }, []);

//   useEffect(() => {
//     if (selectedProject) {
//       const selectedProjectData = projects.find(project => project.project_id === selectedProject.value);
//       setSites(selectedProjectData ? selectedProjectData.sites : []);
//       setSelectedSite(null);
//       setDispatchData([]);
//       setAckDetails({});
//     }
//   }, [selectedProject, projects]);

//   useEffect(() => {
//     if (selectedProject && selectedSite) {
//       const fetchDispatchDetails = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(
//             `http://localhost:5000/material/dispatch-details/?pd_id=${selectedProject.value}&site_id=${selectedSite.value}`
//           );
//           const uniqueDispatches = [];
//           const seenKeys = new Set();
//           (response.data.data || []).forEach(dispatch => {
//             const compositeKey = `${dispatch.id}-${dispatch.transport_details.id}`;
//             if (!seenKeys.has(compositeKey)) {
//               seenKeys.add(compositeKey);
//               uniqueDispatches.push(dispatch);
//             }
//           });
//           setDispatchData(uniqueDispatches);

//           const ackPromises = uniqueDispatches.map(dispatch =>
//             axios.get(
//               `http://localhost:5000/site-incharge/acknowledgement-details?material_dispatch_id=${dispatch.id}`
//             ).catch(err => ({ data: { data: [] } }))
//           );

//           const ackResponses = await Promise.all(ackPromises);
//           const ackMap = {};
//           ackResponses.forEach((ackResponse, index) => {
//             const dispatchId = uniqueDispatches[index].id;
//             const ackData = ackResponse.data.data[0] || null;
//             ackMap[dispatchId] = ackData;
//           });
//           setAckDetails(ackMap);
//           setError(null);
//         } catch (err) {
//           setError("Failed to fetch dispatch or acknowledgement details");
//           toast.error("Failed to fetch dispatch or acknowledgement details");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchDispatchDetails();
//     }
//   }, [selectedProject, selectedSite]);

//   const handleSaveUsage = async (compositeKey) => {
//     const usageData = usageInputs[compositeKey];
//     if (!usageData) return;

//     try {
//       const [materialDispatchId, ackId] = compositeKey.split('-').map(Number);
//       const response = await axios.post("http://localhost:5000/site-incharge/save-material-usage", {
//         material_ack_id: ackId,
//         comp_a_qty: usageData.comp_a_qty !== "" ? parseInt(usageData.comp_a_qty) : null,
//         comp_b_qty: usageData.comp_b_qty !== "" ? parseInt(usageData.comp_b_qty) : null,
//         comp_c_qty: usageData.comp_c_qty !== "" ? parseInt(usageData.comp_c_qty) : null,
//         comp_a_remarks: usageData.comp_a_remarks || null,
//         comp_b_remarks: usageData.comp_b_remarks || null,
//         comp_c_remarks: usageData.comp_c_remarks || null,
//       });
//       toast.success(response.data.message);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to save material usage");
//     }
//   };

//   const handleInputChange = (compositeKey, field, value) => {
//     setUsageInputs(prev => ({
//       ...prev,
//       [compositeKey]: {
//         ...prev[compositeKey],
//         [field]: value
//       }
//     }));
//   };

//   const formatItemAndRatios = (dispatch) => {
//     const ratios = [dispatch.comp_ratio_a, dispatch.comp_ratio_b];
//     if (dispatch.comp_ratio_c !== null) {
//       ratios.push(dispatch.comp_ratio_c);
//     }
//     return `${dispatch.item_name} (${ratios.join(':')})`;
//   };

//   const projectOptions = projects.map(project => ({
//     value: project.project_id,
//     label: project.project_name
//   }));

//   const siteOptions = sites.map(site => ({
//     value: site.site_id,
//     label: site.site_name
//   }));

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">Material Usage</h2>

//       <div className="mb-6 space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
//           <Select
//             options={projectOptions}
//             value={selectedProject}
//             onChange={setSelectedProject}
//             placeholder="Search Project..."
//             isSearchable
//             className="w-full"
//             classNamePrefix="react-select"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Select Site</label>
//           <Select
//             options={siteOptions}
//             value={selectedSite}
//             onChange={setSelectedSite}
//             placeholder="Search Site..."
//             isSearchable
//             isDisabled={!selectedProject}
//             className="w-full"
//             classNamePrefix="react-select"
//           />
//         </div>
//       </div>

//       {loading && <div className="text-center text-gray-600 py-4">Loading...</div>}
//       {error && <div className="text-center text-red-600 py-4">{error}</div>}

//       {dispatchData.length > 0 && (
//         <div className="space-y-4">
//           {dispatchData.map(dispatch => {
//             const ack = ackDetails[dispatch.id];
//             if (!ack || !ack.acknowledgement) return null;
//             const compositeKey = `${dispatch.id}-${ack.acknowledgement.id}`;
//             return (
//               <div key={compositeKey} className="border rounded-lg p-4 bg-white shadow-md">
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">
//                   {formatItemAndRatios(dispatch)}
//                 </h3>

//                 <div className="mb-3">
//                   <h4 className="text-md font-medium text-gray-700 mb-1">Acknowledgement Details</h4>
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div>
//                       <span className="font-medium">Comp A:</span>{" "}
//                       {ack.acknowledgement.comp_a_qty !== null
//                         ? `${ack.acknowledgement.comp_a_qty} (${ack.acknowledgement.comp_a_remarks || 'No remarks'})`
//                         : 'Not acknowledged'}
//                     </div>
//                     <div>
//                       <span className="font-medium">Comp B:</span>{" "}
//                       {ack.acknowledgement.comp_b_qty !== null
//                         ? `${ack.acknowledgement.comp_b_qty} (${ack.acknowledgement.comp_b_remarks || 'No remarks'})`
//                         : 'Not acknowledged'}
//                     </div>
//                     {ack.acknowledgement.comp_c_qty !== null && (
//                       <div>
//                         <span className="font-medium">Comp C:</span>{" "}
//                         {`${ack.acknowledgement.comp_c_qty} (${ack.acknowledgement.comp_c_remarks || 'No remarks'})`}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-4 border-t pt-3">
//                   <h4 className="text-md font-semibold text-gray-700 mb-2">Record Material Usage</h4>
//                   <div className="space-y-3">
//                     {['comp_a', 'comp_b', 'comp_c'].map(comp => (
//                       (ack.acknowledgement[`${comp}_qty`] !== null || comp !== 'comp_c') && (
//                         <div key={comp} className={ack.acknowledgement[`${comp}_qty`] === null ? 'opacity-50' : ''}>
//                           <h5 className="text-sm font-medium text-gray-600 capitalize mb-1">{comp.replace('_', ' ')}</h5>
//                           <input
//                             type="number"
//                             placeholder="Quantity Used"
//                             value={usageInputs[compositeKey]?.[`${comp}_qty`] || ""}
//                             onChange={(e) => handleInputChange(compositeKey, `${comp}_qty`, e.target.value)}
//                             className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
//                             disabled={ack.acknowledgement[`${comp}_qty`] === null}
//                             min="0"
//                           />
//                           <input
//                             type="text"
//                             placeholder="Remarks"
//                             value={usageInputs[compositeKey]?.[`${comp}_remarks`] || ""}
//                             onChange={(e) => handleInputChange(compositeKey, `${comp}_remarks`, e.target.value)}
//                             className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
//                             disabled={ack.acknowledgement[`${comp}_qty`] === null}
//                           />
//                         </div>
//                       )
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => handleSaveUsage(compositeKey)}
//                     className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
//                     disabled={!usageInputs[compositeKey] || Object.values(usageInputs[compositeKey]).every(val => val === "")}
//                   >
//                     Save Material Usage
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//       />
//     </div>
//   );
// };

// export default MaterialUsage;







import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { BookCheck, Save } from "lucide-react";
import { useParams } from "react-router-dom";

const MaterialUsage = () => {
  const { encodedUserId } = useParams();
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [dispatchData, setDispatchData] = useState([]);
  const [ackDetails, setAckDetails] = useState({});
  const [usageInputs, setUsageInputs] = useState({});
  const [usageDetails, setUsageDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
      const selectedProjectData = projects.find(project => project.project_id === selectedProject.value);
      setSites(selectedProjectData ? selectedProjectData.sites : []);
      setSelectedSite(null);
      setDispatchData([]);
      setAckDetails({});
      setUsageDetails({});
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      const fetchDispatchDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/material/dispatch-details/?pd_id=${selectedProject.value}&site_id=${selectedSite.value}`
          );
          const uniqueDispatches = [];
          const seenKeys = new Set();
          (response.data.data || []).forEach(dispatch => {
            const key = dispatch.id;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              uniqueDispatches.push(dispatch);
            }
          });
          setDispatchData(uniqueDispatches);

          const ackPromises = uniqueDispatches.map(dispatch =>
            axios.get(
              `http://localhost:5000/site-incharge/acknowledgement-details?material_dispatch_id=${dispatch.id}`
            ).catch(err => ({ data: { data: [] } }))
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

  useEffect(() => {
    if (selectedDate && dispatchData.length > 0) {
      dispatchData.forEach(dispatch => {
        const ack = ackDetails[dispatch.id];
        if (ack && ack.acknowledgement) {
          fetchUsageDetails(ack.acknowledgement.id);
        }
      });
    }
  }, [selectedDate, dispatchData, ackDetails]);

  const fetchUsageDetails = async (ackId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/site-incharge/material-usage-details?material_ack_id=${ackId}&date=${selectedDate}`
      );
      setUsageDetails(prev => ({
        ...prev,
        [ackId]: response.data.data
      }));
    } catch (err) {
      toast.error("Failed to fetch usage details");
    }
  };

  const handleSaveUsage = async (compositeKey) => {
    const usageData = usageInputs[compositeKey];
    if (!usageData) return;

    const [_, ackIdStr] = compositeKey.split('-');
    const ackId = parseInt(ackIdStr);

    try {
      setSubmitting(true);
      if (!encodedUserId) {
        toast.error("User ID is missing from URL");
        return;
      }
      let user_id;
      try {
        user_id = atob(encodedUserId);
        if (!/^\d+$/.test(user_id)) throw new Error();
      } catch {
        toast.error("Invalid User ID in URL");
        return;
      }

      const response = await axios.post("http://localhost:5000/site-incharge/save-material-usage", {
        material_ack_id: ackId,
        entry_date: selectedDate,
        overall_qty: usageData.overall_qty !== "" ? parseInt(usageData.overall_qty) : null,
        remarks: usageData.remarks || null,
        created_by: parseInt(user_id)
      });
      toast.success(response.data.message);
      setUsageInputs(prev => ({ ...prev, [compositeKey]: {} }));
      fetchUsageDetails(ackId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save material usage");
    } finally {
      setSubmitting(false);
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

  const formatItemAndRatios = (dispatch) => {
    const ratios = [dispatch.comp_ratio_a, dispatch.comp_ratio_b];
    if (dispatch.comp_ratio_c !== null) {
      ratios.push(dispatch.comp_ratio_c);
    }
    return `${dispatch.item_name} (${ratios.join(':')})`;
  };

  const projectOptions = projects.map(project => ({
    value: project.project_id,
    label: project.project_name
  }));

  const siteOptions = sites.map(site => ({
    value: site.site_id,
    label: site.site_name
  }));

  const getTotalAckQty = (ack) => {
    return (ack.comp_a_qty || 0) + (ack.comp_b_qty || 0) + (ack.comp_c_qty || 0);
  };

  const isCompleted = (ack, usage) => {
    const totalAck = getTotalAckQty(ack);
    return (usage.total_cumulative.overall_qty || 0) >= totalAck;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Material Usage</h1>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Select Date:</div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white border rounded-lg shadow-sm text-sm"
          />
        </div>

        <div className="mb-4 space-y-4">
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

        {loading && <div className="text-center py-6 text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-center py-6 text-sm text-red-600">{error}</div>}

        {dispatchData.length > 0 && (
          <div className="space-y-4">
            {dispatchData.map(dispatch => {
              const ackData = ackDetails[dispatch.id];
              if (!ackData || !ackData.acknowledgement) return null;
              const ack = ackData.acknowledgement;
              const compositeKey = `${dispatch.id}-${ack.id}`;
              const displayData = usageDetails[ack.id] || {
                cumulative: { overall_qty: 0 },
                total_cumulative: { overall_qty: 0 },
                entries: []
              };
              const totalAckQty = getTotalAckQty(ack);

              return (
                <div key={compositeKey} className="bg-white border rounded-lg p-3 mb-3 shadow-sm">
                  <div className="font-semibold text-base text-gray-800 mb-1">
                    {formatItemAndRatios(dispatch)}
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Acknowledged Quantities</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {ack.comp_a_qty !== null && (
                        <div>Comp A: {ack.comp_a_qty} ({ack.comp_a_remarks || 'No remarks'})</div>
                      )}
                      {ack.comp_b_qty !== null && (
                        <div>Comp B: {ack.comp_b_qty} ({ack.comp_b_remarks || 'No remarks'})</div>
                      )}
                      {ack.comp_c_qty !== null && (
                        <div>Comp C: {ack.comp_c_qty} ({ack.comp_c_remarks || 'No remarks'})</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Progress as of {selectedDate}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Overall: {displayData.cumulative.overall_qty || 0} / {totalAckQty}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Entries on {selectedDate}</h4>
                    {displayData.entries.length === 0 ? (
                      <div className="text-sm text-gray-500">No entries</div>
                    ) : (
                      displayData.entries.map((entry) => (
                        <div key={entry.entry_id} className="text-sm text-gray-700 space-y-1">
                          <div className="font-semibold">
                            At {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:
                          </div>
                          {entry.overall_qty !== null && (
                            <div>Overall: {entry.overall_qty} ({entry.remarks || 'No remarks'})</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {isCompleted(ack, displayData) ? (
                    <div className="p-2 border rounded-lg text-green-700 flex items-center text-sm">
                      Completed
                      <BookCheck size={14} className="ml-2 text-green-600" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 capitalize mb-1">Overall Quantity</h5>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Quantity Used"
                            value={usageInputs[compositeKey]?.overall_qty || ""}
                            onChange={(e) => handleInputChange(compositeKey, 'overall_qty', e.target.value)}
                            className="flex-1 p-2 border rounded-lg text-sm"
                            disabled={(displayData.total_cumulative.overall_qty || 0) >= totalAckQty}
                            min="0"
                            max={totalAckQty - (displayData.total_cumulative.overall_qty || 0)}
                          />
                          <input
                            type="text"
                            placeholder="Remarks"
                            value={usageInputs[compositeKey]?.remarks || ""}
                            onChange={(e) => handleInputChange(compositeKey, 'remarks', e.target.value)}
                            className="flex-1 p-2 border rounded-lg text-sm mt-1"
                            disabled={(displayData.total_cumulative.overall_qty || 0) >= totalAckQty}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleSaveUsage(compositeKey)}
                        className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
                        disabled={
                          submitting ||
                          !usageInputs[compositeKey] ||
                          Object.values(usageInputs[compositeKey] || {}).every(val => val === "" || val === null)
                        }
                      >
                        <Save size={14} className="mr-2" />
                        Save Material Usage
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default MaterialUsage;