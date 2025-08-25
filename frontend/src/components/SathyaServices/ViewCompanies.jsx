import { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Edit3,
  X,
  Loader2,
  Save,
  Home,
  User,
  Phone
} from "lucide-react";
import Swal from "sweetalert2";

const ViewCompanies = ({ onUpdate }) => {
  const [companies, setCompanies] = useState([]);
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
  const [expandedCompany, setExpandedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://103.118.158.33/api/project/companies");
        setCompanies(response.data || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load companies. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load companies. Please try again.",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
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
    setExpandedCompany(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate formData before sending
    const missingFields = Object.keys(formData).filter(key => !formData[key]);
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
      await axios.put(`http://103.118.158.33/api/project/companies`, {
        ...formData,
        location_name: null, // Explicitly send null for location_name
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
      if (onUpdate) {
        onUpdate(); // Trigger parent to refresh company list
      }
      // Refresh companies list
      const response = await axios.get("http://103.118.158.33/api/project/companies");
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

  const toggleExpand = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}
      
      {loading && !editingCompany ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : editingCompany ? (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-all duration-300 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-800">
                {formData.company_name}
              </h3>
            </div>
            <div className="flex space-x-2 self-end sm:self-auto">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
                aria-label="Save changes"
                title="Save changes"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setEditingCompany(null)}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                aria-label="Cancel editing"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleUpdate} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
          </form>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new company.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.company_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(company.company_id)}
                    className="flex items-center space-x-3 text-left"
                    aria-label={`Toggle details for ${company.company_name}`}
                  >
                    <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {company.company_name}
                    </span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center"
                      aria-label="Edit Company"
                      title="Edit Company"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {expandedCompany === company.company_id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    <div className="flex items-start space-x-3">
                      <Home className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
                        <p className="text-sm text-gray-800">{company.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SPOC Name</p>
                        <p className="text-sm text-gray-800">{company.spoc_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SPOC Contact</p>
                        <p className="text-sm text-gray-800">{company.spoc_contact_no}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCompanies;