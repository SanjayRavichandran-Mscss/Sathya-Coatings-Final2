import { useState, useEffect } from "react";
import axios from "axios";
import {
  Warehouse,
  MapPin,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";

const ViewProjects = () => {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedSites, setExpandedSites] = useState({});

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
          error.response?.status === 500
            ? "Server error: Unable to fetch data. Please check the server and try again."
            : "Failed to load data. Please try again.";
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

  const toggleCompany = (companyId) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const toggleSite = (siteId) => {
    setExpandedSites((prev) => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  const filteredProjects = selectedCompany === "all"
    ? projects
    : projects.filter((project) => project.company_id === selectedCompany);

  return (
    <div className="w-full max-w-full mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Projects by Company</h2>
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="text-xs sm:text-sm text-gray-600">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
          </div>
          <select
            className="w-full sm:w-auto p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 text-xs sm:text-sm shadow-sm hover:shadow-md"
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
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-xs sm:text-sm animate-fade-in">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 text-gray-600 text-sm sm:text-base shadow-sm">
          No companies found.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {companies.map((company) => {
            const companyProjects = filteredProjects.filter(
              (project) => project.company_id === company.company_id
            );
            if (selectedCompany !== "all" && selectedCompany !== company.company_id) {
              return null;
            }
            return (
              <div key={company.company_id}>
                <div
                  className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleCompany(company.company_id)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {expandedCompanies[company.company_id] ? (
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {company.company_name}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800">
                    {companyProjects.length} {companyProjects.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                {expandedCompanies[company.company_id] && (
                  <ul className="ml-2 sm:ml-4 border-l-2 border-gray-200 divide-y divide-gray-200">
                    {companyProjects.length === 0 ? (
                      <li className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 italic">
                        No projects available for {company.company_name}
                      </li>
                    ) : (
                      companyProjects.map((project) => (
                        <li
                          key={project.project_id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div
                            className="flex items-center justify-between p-3 sm:p-4 cursor-pointer"
                            onClick={() => toggleProject(project.project_id)}
                          >
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              {expandedProjects[project.project_id] ? (
                                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                              )}
                              <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                              <span className="font-medium text-gray-800 text-sm sm:text-base">
                                {project.project_name}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500">
                                ({project.project_type})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800">
                                {project.sites?.length || 0} {project.sites?.length === 1 ? "site" : "sites"}
                              </span>
                            </div>
                          </div>

                          {expandedProjects[project.project_id] && (
                            <ul className="ml-4 sm:ml-8 border-l-2 border-gray-200 divide-y divide-gray-200">
                              {!project.sites || project.sites.length === 0 ? (
                                <li className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 italic">
                                  No sites available
                                </li>
                              ) : (
                                project.sites.map((site) => (
                                  <li
                                    key={site.site_id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                  >
                                    <div
                                      className="flex items-center justify-between p-3 sm:p-4 cursor-pointer"
                                      onClick={() => toggleSite(site.site_id)}
                                    >
                                      <div className="flex items-center space-x-2 sm:space-x-3">
                                        {expandedSites[site.site_id] ? (
                                          <ChevronDown className="h-4 w-4 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-gray-500" />
                                        )}
                                        <MapPin className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-700 text-sm sm:text-base">
                                          {site.site_name}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-500">
                                        <span>PO: {site.po_number || "N/A"}</span>
                                      </div>
                                    </div>

                                    {expandedSites[site.site_id] && (
                                      <div className="ml-4 sm:ml-6 p-3 sm:p-4 bg-gray-50/80 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                          <div>
                                            <p className="font-medium text-gray-700">Dates</p>
                                            <p className="text-gray-600">
                                              Start: {site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A"}
                                            </p>
                                            <p className="text-gray-600">
                                              End: {site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A"}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="font-medium text-gray-700">Details</p>
                                            <p className="text-gray-600">
                                              Incharge: {site.incharge_type || "N/A"}
                                            </p>
                                            <p className="text-gray-600">
                                              Location: {site.location_name || "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </li>
                                ))
                              )}
                            </ul>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewProjects;