import React,{ useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Edit3,
  X,
  Loader2,
  Save,
  Home,
  User,
  Phone,
  Warehouse,
  MapPin,
} from "lucide-react";
import Swal from "sweetalert2";

const SiteInformation = () => {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    company_id: "",
    company_name: "",
    address: "",
    spoc_name: "",
    spoc_contact_no: "",
  });
  const [selectedCompany, setSelectedCompany] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [companiesResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:5000/project/companies"),
          axios.get("http://localhost:5000/project/projects-with-sites"),
        ]);
        setCompanies(companiesResponse.data || []);
        setProjects(projectsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMsg =
          error.response?.data?.error ||
          (error.response?.status === 500
            ? "Server error: Unable to fetch data. Please check the server and try again."
            : "Failed to load data. Please try again.");
        setError(errorMsg);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (company) => {
    setEditingCompany(company.company_id);
    setFormData({
      company_id: company.company_id,
      company_name: company.company_name,
      address: company.address,
      spoc_name: company.spoc_name,
      spoc_contact_no: company.spoc_contact_no,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const missingFields = Object.keys(formData).filter((key) => !formData[key]);
    if (missingFields.length > 0) {
      setError(`Please fill in all fields: ${missingFields.join(", ")}`);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Please fill in all fields: ${missingFields.join(", ")}`,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      await axios.put(`http://localhost:5000/project/companies`, {
        ...formData,
        location_name: null,
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Company ${formData.company_name} updated successfully!`,
        confirmButtonColor: "#2563eb",
      });
      setEditingCompany(null);
      setFormData({
        company_id: "",
        company_name: "",
        address: "",
        spoc_name: "",
        spoc_contact_no: "",
      });
      const response = await axios.get("http://localhost:5000/project/companies");
      setCompanies(response.data || []);
    } catch (error) {
      console.error("Error updating company:", error);
      setError(error.response?.data?.error || "Failed to update company. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update company. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCompany === "all"
    ? projects
    : projects.filter((project) => project.company_id === selectedCompany);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Companies, Projects & Sites
        </h2>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="text-sm font-semibold text-gray-700">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
          </div>
          <select
            className="w-full sm:w-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-300 bg-white text-gray-800 text-sm font-semibold shadow-sm hover:shadow-md"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="all">All Companies</option>
            {companies.map((company) => (
              <option key={company.company_id} value={company.company_id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm font-semibold animate-fade-in">
          {error}
        </div>
      )}

      {loading && !editingCompany ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        </div>
      ) : editingCompany ? (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-all duration-300 animate-slide-in-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">Edit {formData.company_name}</h3>
            </div>
            <div className="flex space-x-2 self-end sm:self-auto">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                aria-label="Save changes"
                title="Save changes"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setEditingCompany(null)}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Cancel editing"
                title="Cancel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 text-sm font-semibold"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Home className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 text-sm font-semibold"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="spoc_name"
                placeholder="SPOC Name"
                value={formData.spoc_name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 text-sm font-semibold"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="spoc_contact_no"
                placeholder="SPOC Contact Number"
                value={formData.spoc_contact_no}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 text-sm font-semibold"
              />
            </div>
          </form>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200 animate-slide-in-up">
          <Building2 className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-2 text-xl font-bold text-gray-900">No Companies Found</h3>
          <p className="mt-1 text-sm font-semibold text-gray-600">Get started by adding a new company.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="w-full bg-white rounded-xl border border-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                  <Building2 className="inline-block h-5 w-5 mr-2" /> Company Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                  <Home className="inline-block h-5 w-5 mr-2" /> Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                  <User className="inline-block h-5 w-5 mr-2" /> SPOC Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                  <Phone className="inline-block h-5 w-5 mr-2" /> SPOC Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map((company) => {
                const companyProjects = filteredProjects.filter(
                  (project) => project.company_id === company.company_id
                );
                if (selectedCompany !== "all" && selectedCompany !== company.company_id) {
                  return null;
                }
                return (
                  <React.Fragment key={company.company_id}>
                    <tr className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{company.company_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{company.address}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{company.spoc_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{company.spoc_contact_no}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(company)}
                          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                          aria-label="Edit Company"
                          title="Edit Company"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                    {companyProjects.length > 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-6 bg-gray-50">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">
                            <Warehouse className="inline-block h-5 w-5 text-indigo-600 mr-2" /> Projects
                          </h4>
                          <table className="w-full bg-white rounded-lg border border-gray-200">
                            <thead className="bg-indigo-100">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                  Project Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                  Sites
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {companyProjects.map((project) => (
                                <React.Fragment key={project.project_id}>
                                  <tr className="hover:bg-gray-50 transition-all duration-200">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{project.project_name}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{project.project_type}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{project.sites?.length || 0}</td>
                                  </tr>
                                  {project.sites && project.sites.length > 0 && (
                                    <tr>
                                      <td colSpan="3" className="px-6 py-6 bg-gray-50">
                                        <h5 className="text-md font-bold text-gray-900 mb-3">
                                          <MapPin className="inline-block h-5 w-5 text-indigo-600 mr-2" /> Sites
                                        </h5>
                                        <table className="w-full bg-white rounded-lg border border-gray-200">
                                          <thead className="bg-indigo-50">
                                            <tr>
                                              <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                                Site Name
                                              </th>
                                              <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                                PO Number
                                              </th>
                                              <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                                Start Date
                                              </th>
                                              <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                                End Date
                                              </th>
                                              <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                                Incharge
                                              </th>
                                              <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                                Location
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                            {project.sites.map((site) => (
                                              <tr key={site.site_id} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{site.site_name}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">{site.po_number || "N/A"}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                                  {site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                                  {site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">{site.incharge_type || "N/A"}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">{site.location_name || "N/A"}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SiteInformation;