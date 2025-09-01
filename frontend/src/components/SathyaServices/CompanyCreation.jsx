// import { useState } from "react";
// import axios from "axios";
// import { X, Building2, Loader2 } from "lucide-react";
// import Swal from "sweetalert2";

// const CompanyCreation = ({ onCompanyCreated, onClose }) => {
//   const [formData, setFormData] = useState({
//     company_name: "",
//     address: "",
//     spoc_name: "",
//     spoc_contact_no: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       await axios.post("http://localhost:5000/project/create-company", formData);
//       setFormData({ company_name: "", address: "", spoc_name: "", spoc_contact_no: "" });
//       onCompanyCreated();
//     } catch (error) {
//       console.error("Error creating company:", error);
//       const errorMsg = error.response?.data?.error || "Failed to create company. Please try again.";
//       setError(errorMsg);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: errorMsg,
//         confirmButtonColor: "#3b82f6",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 transform transition-all duration-300 min-h-[calc(100vh-2rem)] sm:min-h-0 flex flex-col justify-center">
//       <div className="flex justify-between items-center mb-6 sm:mb-8">
//         <div className="flex items-center space-x-2 sm:space-x-3">
//           <Building2 className="text-indigo-600 w-6 h-6 sm:w-7 sm:h-7" />
//           <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Create Company</h3>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           aria-label="Close Modal"
//         >
//           <X className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
//         </button>
//       </div>
//       {error && (
//         <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-xs sm:text-sm animate-fade-in">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
//         <div>
//           <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Company Name</label>
//           <input
//             type="text"
//             name="company_name"
//             placeholder="Enter company name"
//             value={formData.company_name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm shadow-sm hover:shadow-md focus:outline-none"
//             aria-required="true"
//           />
//         </div>
//         <div>
//           <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Address</label>
//           <input
//             type="text"
//             name="address"
//             placeholder="Enter address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//             className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm shadow-sm hover:shadow-md focus:outline-none"
//             aria-required="true"
//           />
//         </div>
//         <div>
//           <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">SPOC Name</label>
//           <input
//             type="text"
//             name="spoc_name"
//             placeholder="Enter SPOC name"
//             value={formData.spoc_name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm shadow-sm hover:shadow-md focus:outline-none"
//             aria-required="true"
//           />
//         </div>
//         <div>
//           <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">SPOC Contact Number</label>
//           <input
//             type="text"
//             name="spoc_contact_no"
//             placeholder="Enter SPOC contact number"
//             value={formData.spoc_contact_no}
//             onChange={handleChange}
//             required
//             className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm shadow-sm hover:shadow-md focus:outline-none"
//             aria-required="true"
//           />
//         </div>
//         <div className="flex justify-end space-x-3 sm:space-x-4 mt-auto sm:mt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
//             aria-label="Cancel"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             disabled={loading}
//             aria-label="Create Company"
//           >
//             {loading && <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />}
//             <span>{loading ? "Creating..." : "Create Company"}</span>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CompanyCreation;














import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Building2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const SearchableSelect = ({ options, onSelect, addNew, label, value }) => {
  const [query, setQuery] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(opt => opt.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, options]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (opt) => {
    setQuery(opt.name);
    onSelect(opt.id);
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    if (query.trim()) {
      const newId = await addNew(query);
      if (newId) {
        setQuery('');
        onSelect(newId);
        setIsOpen(false);
      }
    }
  };

  const showAddOption = query.trim() && filteredOptions.length === 0;

  return (
    <div className="relative">
      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={`Search ${label.toLowerCase()}`}
        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm shadow-sm hover:shadow-md focus:outline-none"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
          {filteredOptions.map((opt) => (
            <li
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className="p-2 cursor-pointer hover:bg-indigo-100 text-xs sm:text-sm"
            >
              {opt.name}
            </li>
          ))}
          {showAddOption && (
            <li
              onClick={handleAddNew}
              className="p-2 cursor-pointer hover:bg-indigo-100 text-xs sm:text-sm font-medium text-indigo-600"
            >
              Add "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const CompanyCreation = ({ onCompanyCreated, onClose }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    address: "",
    gst_number: "",
    vendor_code: "",
    city_id: "",
    state_id: "",
    pincode: "",
    spoc_name: "",
    spoc_contact_no: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesRes = await axios.get("http://localhost:5000/project/states");
        setStates(statesRes.data.data.map(s => ({ id: s.id, name: s.state_name })));
        
        const citiesRes = await axios.get("http://localhost:5000/project/cities");
        setCities(citiesRes.data.data.map(c => ({ id: c.id, name: c.city_name })));
      } catch (err) {
        setError("Failed to load cities and states.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addNewState = async (name) => {
    try {
      const res = await axios.post("http://localhost:5000/project/create-state", { state_name: name });
      const newId = res.data.id;
      setStates(prev => [...prev, { id: newId, name }]);
      return newId;
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error adding state" });
      return null;
    }
  };

  const addNewCity = async (name) => {
    try {
      const res = await axios.post("http://localhost:5000/project/create-city", { city_name: name });
      const newId = res.data.id;
      setCities(prev => [...prev, { id: newId, name }]);
      return newId;
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error adding city" });
      return null;
    }
  };

  const handleStateSelect = (id) => {
    setFormData(prev => ({ ...prev, state_id: id }));
  };

  const handleCitySelect = (id) => {
    setFormData(prev => ({ ...prev, city_id: id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:5000/project/create-company", formData);
      setFormData({
        company_name: "",
        address: "",
        gst_number: "",
        vendor_code: "",
        city_id: "",
        state_id: "",
        pincode: "",
        spoc_name: "",
        spoc_contact_no: "",
      });
      onCompanyCreated();
    } catch (error) {
      console.error("Error creating company:", error);
      const errorMsg = error.response?.data?.error || "Failed to create company. Please try again.";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Building2 className="text-indigo-600 w-6 h-6" />
            <h3 className="text-2xl font-bold text-gray-900">Create Company</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close Modal"
          >
            <X className="text-gray-600 w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name*</label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Enter company name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address*</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
                <input
                  type="text"
                  name="gst_number"
                  placeholder="Enter GST number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client/Vendor Code</label>
                <input
                  type="text"
                  name="vendor_code"
                  placeholder="Enter vendor code"
                  value={formData.vendor_code}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <SearchableSelect
                options={states}
                onSelect={handleStateSelect}
                addNew={addNewState}
                label="State"
                value={states.find(s => s.id === formData.state_id)?.name || ''}
              />

              <SearchableSelect
                options={cities}
                onSelect={handleCitySelect}
                addNew={addNewCity}
                label="City"
                value={cities.find(c => c.id === formData.city_id)?.name || ''}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SPOC Name*</label>
                <input
                  type="text"
                  name="spoc_name"
                  placeholder="Enter SPOC name"
                  value={formData.spoc_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SPOC Contact Number*</label>
                <input
                  type="text"
                  name="spoc_contact_no"
                  placeholder="Enter SPOC contact number"
                  value={formData.spoc_contact_no}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              <span>{loading ? "Creating..." : "Create Company"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyCreation;