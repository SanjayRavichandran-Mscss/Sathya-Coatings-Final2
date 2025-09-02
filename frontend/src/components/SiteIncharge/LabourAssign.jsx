import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { Save } from "lucide-react";
import { useParams } from "react-router-dom";

const LabourAssign = () => {
  const { encodedUserId } = useParams();
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWorkDesc, setSelectedWorkDesc] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      setSelectedWorkDesc(null);
      setSelectedEmployees([]);
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      const fetchWorkDescriptions = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/site-incharge/work-descriptions?site_id=${selectedSite.value}`);
          setWorkDescriptions(response.data.data || []);
          setError(null);
        } catch (err) {
          toast.error("Failed to fetch work descriptions");
        } finally {
          setLoading(false);
        }
      };
      fetchWorkDescriptions();

      const fetchEmployees = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/site-incharge/employees");
          setEmployees(response.data.data || []);
          setError(null);
        } catch (err) {
          toast.error("Failed to fetch employees");
        } finally {
          setLoading(false);
        }
      };
      fetchEmployees();
    }
  }, [selectedProject, selectedSite]);

  const handleSaveAssignment = async () => {
    if (!selectedProject || !selectedSite || !selectedWorkDesc || selectedEmployees.length === 0 || !fromDate || !toDate) {
      toast.error("Please fill all required fields");
      return;
    }

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

      const payload = {
        project_id: selectedProject.value, // Use project_id, not pd_id
        site_id: selectedSite.value,
        desc_id: selectedWorkDesc.value,
        emp_ids: selectedEmployees.map(emp => emp.value),
        from_date: fromDate,
        to_date: toDate,
        created_by: parseInt(user_id)
      };
      console.log('Sending payload:', payload); // Debug log
      const response = await axios.post("http://localhost:5000/site-incharge/save-labour-assignment", payload);
      toast.success(response.data.message);
      setSelectedWorkDesc(null);
      setSelectedEmployees([]);
    } catch (err) {
      console.error('Error saving labour assignment:', err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save labour assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.project_id, // Use project_id from API response
    label: project.project_name
  }));

  const siteOptions = sites.map(site => ({
    value: site.site_id,
    label: site.site_name
  }));

  const workDescOptions = workDescriptions.map(desc => ({
    value: desc.desc_id,
    label: desc.desc_name
  }));

  const employeeOptions = employees.map(employee => ({
    value: employee.emp_id,
    label: `${employee.emp_id} - ${employee.full_name}`
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Labour Assignment</h1>

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Work Description</label>
            <Select
              options={workDescOptions}
              value={selectedWorkDesc}
              onChange={setSelectedWorkDesc}
              placeholder="Search Work Description..."
              isSearchable
              isDisabled={loading || !selectedProject || !selectedSite}
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Employees</label>
            <Select
              options={employeeOptions}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
              placeholder="Search Employees..."
              isSearchable
              isMulti
              isDisabled={loading || !selectedProject || !selectedSite || !selectedWorkDesc}
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {loading && <div className="text-center py-6 text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-center py-6 text-sm text-red-600">{error}</div>}

        <button
          onClick={handleSaveAssignment}
          className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
          disabled={submitting || selectedEmployees.length === 0}
        >
          <Save size={14} className="mr-2" />
          Save Labour Assignment
        </button>
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

export default LabourAssign;