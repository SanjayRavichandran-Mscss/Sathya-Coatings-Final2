import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, ChevronDown, ChevronUp, Save } from "lucide-react";

const getRandomColor = (index) => {
  const colors = [
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200",
    "bg-indigo-50 border-indigo-200",
    "bg-teal-50 border-teal-200",
    "bg-orange-50 border-orange-200",
    "bg-cyan-50 border-cyan-200",
    "bg-amber-50 border-amber-200",
  ];
  return colors[index % colors.length];
};

const initialFormData = {
  poNumber: "",
  siteId: "",
  categories: [
    {
      categoryName: "",
      categoryId: "",
      items: [
        {
          itemNo: "",
          descId: "",
          descName: "",
          subcategories: [],
          poQuantity: "",
          unitOfMeasure: "",
          rate: "",
          value: "",
        },
      ],
    },
  ],
};

const SearchableDropdown = ({ options, value, onChange, onCreate, placeholder, disabled, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value);
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    onChange(option.name);
    setSearchTerm(option.name);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (searchTerm && !options.some((opt) => opt.name.toLowerCase() === searchTerm.toLowerCase())) {
      await onCreate(searchTerm);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
        disabled={disabled || isLoading}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 && searchTerm && (
            <div
              className="px-3 py-2 text-sm text-indigo-600 cursor-pointer hover:bg-indigo-100"
              onClick={handleCreate}
            >
              Add "{searchTerm}"
            </div>
          )}
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-100"
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateReckoner = ({ onShowCompanyModal, onShowProjectModal, selectedCompany, onCompanySelect, companies }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(selectedCompany || "");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [loading, setLoading] = useState({
    companies: false,
    projects: false,
    sites: false,
    categories: false,
    subcategories: false,
    workItems: false,
    submitting: false,
    processing: false,
  });
  const [openCategories, setOpenCategories] = useState({ 0: true });

  useEffect(() => {
    setSelectedCompanyId(selectedCompany || "");
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedCompanyId) {
      const fetchProjects = async () => {
        try {
          setLoading((prev) => ({ ...prev, projects: true }));
          const response = await axios.get(`http://localhost:5000/reckoner/projects/${selectedCompanyId}`);
          setProjects(response.data.data || []);
          setSelectedProject("");
          setSites([]);
          setSelectedSite("");
          setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
        } catch (err) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Failed to load projects",
            text: err.response?.data?.message || "Please try again later",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            background: "#fef2f2",
            iconColor: "#ef4444",
          });
        } finally {
          setLoading((prev) => ({ ...prev, projects: false }));
        }
      };
      fetchProjects();
    } else {
      setProjects([]);
      setSelectedProject("");
      setSites([]);
      setSelectedSite("");
      setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedProject) {
      const fetchSites = async () => {
        try {
          setLoading((prev) => ({ ...prev, sites: true }));
          const response = await axios.get(`http://localhost:5000/reckoner/sites-by-project/${selectedProject}`);
          setSites(response.data.data || []);
          setSelectedSite("");
          setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
        } catch (err) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Failed to load sites",
            text: err.response?.data?.message || "Please try again later",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            background: "#fef2f2",
            iconColor: "#ef4444",
          });
        } finally {
          setLoading((prev) => ({ ...prev, sites: false }));
        }
      };
      fetchSites();
    } else {
      setSites([]);
      setSelectedSite("");
      setFormData((prev) => ({ ...prev, poNumber: "", siteId: "" }));
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedSite) {
      const selectedSiteData = sites.find((site) => site.site_id === selectedSite);
      if (selectedSiteData) {
        setFormData((prev) => ({
          ...prev,
          poNumber: selectedSiteData.po_number || "",
          siteId: selectedSiteData.site_id || "",
        }));
      }
    }
  }, [selectedSite, sites]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, categories: true }));
        const categoriesRes = await axios.get("http://localhost:5000/reckoner/categories");
        setCategories(categoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, subcategories: true }));
        const subcategoriesRes = await axios.get("http://localhost:5000/reckoner/subcategories");
        setSubcategories(subcategoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, workItems: true }));
        const workItemsRes = await axios.get("http://localhost:5000/reckoner/work-items");
        setWorkItems(workItemsRes.data.data || []);
      } catch (err) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to load data",
          text: err.response?.data?.message || "Please try again later",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: "#fef2f2",
          iconColor: "#ef4444",
        });
      } finally {
        setLoading((prev) => ({
          ...prev,
          categories: false,
          subcategories: false,
          workItems: false,
        }));
      }
    };
    fetchData();
  }, []);

  const handleCompanyChange = async (e) => {
    const value = e.target.value;
    if (value === "create_new_company") {
      onShowCompanyModal();
    } else {
      setSelectedCompanyId(value);
      if (onCompanySelect) {
        onCompanySelect(value);
      }
    }
  };

  const handleProjectChange = async (e) => {
    const value = e.target.value;
    if (value === "create_new_project") {
      if (!selectedCompanyId) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Select a company first",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#fefce8",
          iconColor: "#facc15",
        });
        return;
      }
      Swal.fire({
        title: "Create New Project",
        input: "text",
        inputLabel: "Project Name",
        inputPlaceholder: "Enter project name",
        showCancelButton: true,
        confirmButtonText: "Create",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "Project name is required!";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post("http://localhost:5000/project/create-project", {
              company_id: selectedCompanyId,
              project_name: result.value,
            });
            const newProject = { pd_id: response.data.project_id, project_name: result.value };
            setProjects((prev) => [...prev, newProject]);
            setSelectedProject(newProject.pd_id);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Project created successfully!",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
              background: "#ecfdf5",
              iconColor: "#10b981",
            });
          } catch (err) {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Failed to create project",
              text: err.response?.data?.error || "Please try again",
              showConfirmButton: false,
              timer: 3000,
              toast: true,
              background: "#fef2f2",
              iconColor: "#ef4444",
            });
          }
        }
      });
    } else {
      setSelectedProject(value);
    }
  };

  const handleSiteChange = (e) => {
    const value = e.target.value;
    if (value === "create_new_site") {
      if (!selectedCompanyId) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Select a company first",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          background: "#fefce8",
          iconColor: "#facc15",
        });
        return;
      }
      onShowProjectModal();
    } else {
      setSelectedSite(value);
    }
  };

  const handleCategoryChange = (categoryIndex, value) => {
    const selectedCategory = categories.find((cat) => cat.category_name === value);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        categoryName: value,
        categoryId: selectedCategory?.category_id || "",
        items: [
          {
            itemNo: "",
            descId: "",
            descName: "",
            subcategories: [],
            poQuantity: "",
            unitOfMeasure: "",
            rate: "",
            value: "",
          },
        ],
      };
      return { ...prev, categories: newCategories };
    });
  };

  const handleCreateCategory = async (categoryName) => {
    try {
      const response = await axios.post("http://localhost:5000/reckoner/categories", { category_name: categoryName });
      const newCategory = response.data.data;
      setCategories((prev) => [...prev, newCategory]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Category created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
      return newCategory;
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to create category",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
      throw err;
    }
  };

  const handleItemDescriptionChange = (categoryIndex, itemIndex, value) => {
    const selectedItem = workItems.find((item) => item.desc_name === value);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];

      // Select the first two subcategories by default if they exist
      const defaultSubcategories = subcategories.slice(0, 2).map((subcat) => ({
        subcategoryId: subcat.subcategory_id,
        subcategoryName: subcat.subcategory_name,
        poQuantity: item.poQuantity || "0",
        rate: Math.floor((parseInt(item.rate) || 0) / (subcategories.length >= 2 ? 2 : subcategories.length)).toString(),
        value: ((parseFloat(item.poQuantity) || 0) * Math.floor((parseInt(item.rate) || 0) / (subcategories.length >= 2 ? 2 : subcategories.length))).toFixed(2),
      }));

      newItems[itemIndex] = {
        ...item,
        descName: value,
        descId: selectedItem?.desc_id || "",
        unitOfMeasure: selectedItem?.unit_of_measure || "",
        subcategories: defaultSubcategories,
      };
      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

  const handleCreateWorkItem = async (descName) => {
    try {
      const response = await axios.post("http://localhost:5000/reckoner/work-items", { desc_name: descName });
      const newWorkItem = response.data.data;
      setWorkItems((prev) => [...prev, newWorkItem]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Work item created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
      return newWorkItem;
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to create work item",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
      throw err;
    }
  };

  const handleSubcategorySelection = (categoryIndex, itemIndex, subcategoryId, checked) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];

      let updatedSubcategories;
      if (checked) {
        const subcat = subcategories.find((sc) => sc.subcategory_id === subcategoryId);
        if (!subcat) return prev;

        updatedSubcategories = [
          ...item.subcategories,
          {
            subcategoryId: subcat.subcategory_id,
            subcategoryName: subcat.subcategory_name,
            poQuantity: item.poQuantity || "0",
            rate: Math.floor((parseInt(item.rate) || 0) / (item.subcategories.length + 1)).toString(),
            value: ((parseFloat(item.poQuantity) || 0) * Math.floor((parseInt(item.rate) || 0) / (item.subcategories.length + 1))).toFixed(2),
          },
        ];
      } else {
        updatedSubcategories = item.subcategories.filter((sc) => sc.subcategoryId !== subcategoryId);
      }

      const splitRate = updatedSubcategories.length > 0 ? Math.floor((parseInt(item.rate) || 0) / updatedSubcategories.length) : 0;
      updatedSubcategories = updatedSubcategories.map((subcat) => ({
        ...subcat,
        rate: splitRate.toString(),
        value: ((parseFloat(item.poQuantity) || 0) * splitRate).toFixed(2),
      }));

      newItems[itemIndex] = {
        ...item,
        subcategories: updatedSubcategories,
      };

      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

  const handleCreateSubcategory = async (categoryIndex, itemIndex) => {
    if (!newSubcategory) return;
    try {
      const response = await axios.post("http://localhost:5000/reckoner/subcategories", { subcategory_name: newSubcategory });
      const newSubcat = response.data.data;
      setSubcategories((prev) => [...prev, newSubcat]);
      setNewSubcategory("");
      handleSubcategorySelection(categoryIndex, itemIndex, newSubcat.subcategory_id, true);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Subcategory created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to create subcategory",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
    }
  };

  const handleItemChange = (categoryIndex, itemIndex, e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];

      newItems[itemIndex] = {
        ...item,
        [name]: value,
      };

      if (name === "poQuantity" || name === "rate") {
        const quantity = name === "poQuantity" ? parseFloat(value) || 0 : parseFloat(item.poQuantity) || 0;
        const rate = name === "rate" ? Math.floor(parseFloat(value) || 0) : parseInt(item.rate) || 0;

        const updatedSubcategories = item.subcategories.map((subcat) => {
          const splitRate = item.subcategories.length > 0 ? Math.floor(rate / item.subcategories.length) : 0;
          return {
            ...subcat,
            poQuantity: quantity.toString(),
            rate: splitRate.toString(),
            value: (quantity * splitRate).toFixed(2),
          };
        });

        newItems[itemIndex] = {
          ...newItems[itemIndex],
          rate: rate.toString(),
          subcategories: updatedSubcategories,
          value: (quantity * rate).toFixed(2),
        };
      }

      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

const handleSubcategoryRateChange = (categoryIndex, itemIndex, subcategoryIndex, e) => {
  const { value } = e.target;
  const newRate = Math.floor(parseFloat(value) || 0);

  setFormData((prev) => {
    const newCategories = [...prev.categories];
    const newItems = [...newCategories[categoryIndex].items];
    const item = newItems[itemIndex];
    const updatedSubcategories = [...item.subcategories];

    // ✅ Update only the changed subcategory (lock it as edited)
    updatedSubcategories[subcategoryIndex] = {
      ...updatedSubcategories[subcategoryIndex],
      rate: newRate.toString(),
      value: ((parseFloat(item.poQuantity) || 0) * newRate).toFixed(2),
      edited: true,
    };

    const itemRate = parseInt(item.rate) || 0;

    // ✅ Current sum of all subcategories
    const currentTotal = updatedSubcategories.reduce(
      (sum, subcat) => sum + (parseInt(subcat.rate) || 0),
      0
    );

    let diff = itemRate - currentTotal;

    if (diff !== 0) {
      // ✅ Try to adjust only AFTER fields
      for (let i = subcategoryIndex + 1; i < updatedSubcategories.length; i++) {
        if (!updatedSubcategories[i].edited) {
          const newAdjustedRate = (parseInt(updatedSubcategories[i].rate) || 0) + diff;
          updatedSubcategories[i] = {
            ...updatedSubcategories[i],
            rate: newAdjustedRate.toString(),
            value: ((parseFloat(item.poQuantity) || 0) * newAdjustedRate).toFixed(2),
          };
          diff = 0; // fully adjusted
          break;
        }
      }

      // ✅ If still not tally → fallback adjust first subcategory
      if (diff !== 0 && updatedSubcategories.length > 0) {
        const firstRate = (parseInt(updatedSubcategories[0].rate) || 0) + diff;
        updatedSubcategories[0] = {
          ...updatedSubcategories[0],
          rate: firstRate.toString(),
          value: ((parseFloat(item.poQuantity) || 0) * firstRate).toFixed(2),
        };
      }
    }

    // ✅ Update item with recalculated subcategories
    newItems[itemIndex] = {
      ...item,
      subcategories: updatedSubcategories,
      value: ((parseFloat(item.poQuantity) || 0) * itemRate).toFixed(2),
    };

    newCategories[categoryIndex].items = newItems;
    return { ...prev, categories: newCategories };
  });
};



  const isSubmitDisabled = () => {
    if (!formData.siteId || loading.submitting || loading.processing) {
      return true;
    }
    for (const category of formData.categories) {
      if (!category.categoryId) {
        return true;
      }
      for (const item of category.items) {
        if (
          !item.itemNo ||
          !item.descId ||
          !item.descName ||
          item.subcategories.length === 0 ||
          !item.poQuantity ||
          !item.unitOfMeasure ||
          !item.rate
        ) {
          return true;
        }
        const itemRate = parseInt(item.rate) || 0;
        const totalSubcategoryRate = item.subcategories.reduce(
          (sum, subcat) => sum + (parseInt(subcat.rate) || 0),
          0
        );
        if (totalSubcategoryRate !== itemRate) {
          return true;
        }
      }
    }
    return false;
  };

  const addCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newCategoryIndex = formData.categories.length;
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          categoryName: "",
          categoryId: "",
          items: [
            {
              itemNo: "",
              descId: "",
              descName: "",
              subcategories: [],
              poQuantity: "",
              unitOfMeasure: "",
              rate: "",
              value: "",
            },
          ],
        },
      ],
    }));
    setOpenCategories((prev) => ({ ...prev, [newCategoryIndex]: true }));
  };

  const removeCategory = (index) => {
    if (formData.categories.length > 1) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
      setOpenCategories((prev) => {
        const newOpenCategories = { ...prev };
        delete newOpenCategories[index];
        const updatedOpenCategories = {};
        Object.keys(newOpenCategories).forEach((key) => {
          const numKey = parseInt(key);
          if (numKey > index) {
            updatedOpenCategories[numKey - 1] = newOpenCategories[key];
          } else {
            updatedOpenCategories[numKey] = newOpenCategories[key];
          }
        });
        return updatedOpenCategories;
      });
    }
  };

  const addItemRow = (categoryIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items = [
        ...newCategories[categoryIndex].items,
        {
          itemNo: "",
          descId: "",
          descName: "",
          subcategories: [],
          poQuantity: "",
          unitOfMeasure: "",
          rate: "",
          value: "",
        },
      ];
      return { ...prev, categories: newCategories };
    });
  };

  const removeItemRow = (categoryIndex, itemIndex) => {
    if (formData.categories[categoryIndex].items.length > 1) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        newCategories[categoryIndex].items = newCategories[categoryIndex].items.filter(
          (_, i) => i !== itemIndex
        );
        return { ...prev, categories: newCategories };
      });
    }
  };

  const toggleCategory = (index) => {
    setOpenCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const processSite = async (poNumber) => {
    try {
      setLoading((prev) => ({ ...prev, processing: true }));
      await axios.get(`http://localhost:5000/sheet/process/${encodeURIComponent(poNumber)}`);
      return true;
    } catch (error) {
      console.error("Error processing site:", error);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, processing: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      if (!formData.siteId) {
        throw new Error("Please select a site.");
      }
      for (const category of formData.categories) {
        if (!category.categoryId) {
          throw new Error("All categories must be selected.");
        }
        for (const item of category.items) {
          if (
            !item.itemNo ||
            !item.descId ||
            !item.descName ||
            item.subcategories.length === 0 ||
            !item.poQuantity ||
            !item.unitOfMeasure ||
            !item.rate
          ) {
            throw new Error("All item fields must be filled and at least one subcategory selected.");
          }
        }
      }

      const submissionData = {
        poNumber: formData.poNumber,
        siteId: formData.siteId,
        categories: formData.categories.map((category) => {
          const subcategoryMap = {};

          category.items.forEach((item) => {
            item.subcategories.forEach((subcat) => {
              if (!subcategoryMap[subcat.subcategoryId]) {
                subcategoryMap[subcat.subcategoryId] = {
                  subcategoryId: subcat.subcategoryId,
                  items: [],
                };
              }
              subcategoryMap[subcat.subcategoryId].items.push({
                itemId: item.itemNo,
                descId: item.descId,
                poQuantity: subcat.poQuantity,
                uom: item.unitOfMeasure,
                rate: subcat.rate,
                value: subcat.value,
              });
            });
          });

          return {
            categoryId: category.categoryId,
            subcategories: Object.values(subcategoryMap),
          };
        }),
      };

      await axios.post("http://localhost:5000/reckoner/reckoner", submissionData);
      await processSite(formData.poNumber);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reckoner created successfully!",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setFormData(initialFormData);
      setSelectedCompanyId("");
      setSelectedProject("");
      setSelectedSite("");
      setOpenCategories({ 0: true });
      if (onCompanySelect) {
        onCompanySelect("");
      }
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Submission failed",
        text: err.message || err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/70 transform transition-all duration-500 animate-slide-in-right">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Master Creation</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select client</label>
              <select
                value={selectedCompanyId}
                onChange={handleCompanyChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm appearance-none bg-white"
                disabled={loading.companies}
              >
                <option value="" className="text-gray-500">Select client</option>
                <option
                  value="create_new_company"
                  className="bg-indigo-100 text-indigo-700 font-medium py-2 px-3 hover:bg-indigo-200 transition-colors duration-200"
                >
                  + Create New client
                </option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id} className="py-2 px-3">
                    {company.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Project</label>
              <select
                value={selectedProject}
                onChange={handleProjectChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm appearance-none bg-white"
                disabled={loading.projects || !selectedCompanyId}
              >
                <option value="" className="text-gray-500">Select Project</option>
                <option
                  value="create_new_project"
                  className="bg-indigo-100 text-indigo-700 font-medium py-2 px-3 hover:bg-indigo-200 transition-colors duration-200"
                >
                  + Create New Project
                </option>
                {projects.map((project) => (
                  <option key={project.pd_id} value={project.pd_id} className="py-2 px-3">
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Site</label>
              <select
                value={selectedSite}
                onChange={handleSiteChange}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm appearance-none bg-white"
                disabled={loading.sites || !selectedProject}
              >
                <option value="" className="text-gray-500">Select Site</option>
                <option
                  value="create_new_site"
                  className="bg-indigo-100 text-indigo-700 font-medium py-2 px-3 hover:bg-indigo-200 transition-colors duration-200"
                >
                  + Create New Site
                </option>
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id} className="py-2 px-3">
                    {site.site_name} (PO: {site.po_number})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="poNumber" value={formData.poNumber} />
          <input type="hidden" name="siteId" value={formData.siteId} />

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>

            {formData.categories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className={`border rounded-lg p-4 space-y-4 ${getRandomColor(categoryIndex)} border-2 shadow-sm transition-all duration-300`}
              >
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                      <SearchableDropdown
                        options={categories.map((cat) => ({ id: cat.category_id, name: cat.category_name }))}
                        value={category.categoryName}
                        onChange={(value) => handleCategoryChange(categoryIndex, value)}
                        onCreate={async (name) => {
                          const newCategory = await handleCreateCategory(name);
                          if (newCategory) {
                            handleCategoryChange(categoryIndex, newCategory.category_name);
                          }
                        }}
                        placeholder="Search or add category"
                        disabled={loading.categories}
                        isLoading={loading.categories}
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      {formData.categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(categoryIndex)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                        >
                          Remove Category
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCategory(categoryIndex)}
                    className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label={openCategories[categoryIndex] ? "Collapse Category" : "Expand Category"}
                  >
                    {openCategories[categoryIndex] ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {openCategories[categoryIndex] && category.categoryName && (
                  <div className="space-y-6 mt-4 transition-all duration-300">
                    <h3 className="text-md font-semibold text-gray-700">Items</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${getRandomColor(categoryIndex + 1)}`}>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Item No
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              UOM
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Rate
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Value
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {category.items.map((item, itemIndex) => (
                            <React.Fragment key={itemIndex}>
                              <tr className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    name="itemNo"
                                    value={item.itemNo}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                    required
                                    placeholder="Item No"
                                  />
                                </td>
                                <td className="px-3 py-2 w-[250px] whitespace-nowrap">
                                  <SearchableDropdown
                                    options={workItems.map((item) => ({ id: item.desc_id, name: item.desc_name }))}
                                    value={item.descName}
                                    onChange={(value) => handleItemDescriptionChange(categoryIndex, itemIndex, value)}
                                    onCreate={async (name) => {
                                      const newWorkItem = await handleCreateWorkItem(name);
                                      if (newWorkItem) {
                                        handleItemDescriptionChange(categoryIndex, itemIndex, newWorkItem.desc_name);
                                      }
                                    }}
                                    placeholder="Search or add description"
                                    disabled={loading.workItems}
                                    isLoading={loading.workItems}
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="number"
                                    name="poQuantity"
                                    value={item.poQuantity}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="Qty"
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    name="unitOfMeasure"
                                    value={item.unitOfMeasure}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                    required
                                    placeholder="UOM"
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="number"
                                    name="rate"
                                    value={item.rate}
                                    onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                    required
                                    min="0"
                                    step="1"
                                    placeholder="Rate"
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    name="value"
                                    value={item.value}
                                    readOnly
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100 text-sm"
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => removeItemRow(categoryIndex, itemIndex)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                    disabled={category.items.length <= 1}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                              <tr className="bg-gray-100">
                                <td colSpan="7" className="px-3 py-2">
                                  <div className="mb-2">
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="block text-sm font-semibold text-gray-700">Select Subcategories</label>
                                      <div className="flex items-center">
                                        <input
                                          type="text"
                                          value={newSubcategory}
                                          onChange={(e) => setNewSubcategory(e.target.value)}
                                          placeholder="Add subcategory"
                                          className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm mr-2"
                                        />
                                        {newSubcategory && (
                                          <button
                                            type="button"
                                            onClick={() => handleCreateSubcategory(categoryIndex, itemIndex)}
                                            className="inline-flex items-center p-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                          >
                                            <Save className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                                      {subcategories.reduce((acc, subcat, index) => {
                                        const chunkIndex = Math.floor(index / 7);
                                        if (!acc[chunkIndex]) {
                                          acc[chunkIndex] = [];
                                        }
                                        acc[chunkIndex].push(subcat);
                                        return acc;
                                      }, []).map((chunk, chunkIndex) => (
                                        <div
                                          key={`chunk-${chunkIndex}`}
                                          className="flex flex-wrap mb-2"
                                        >
                                          {chunk.map((subcat) => (
                                            <div key={subcat.subcategory_id} className="flex items-center mb-1 w-[13%]">
                                              <input
                                                type="checkbox"
                                                id={`subcat-${categoryIndex}-${itemIndex}-${subcat.subcategory_id}`}
                                                checked={item.subcategories.some((sc) => sc.subcategoryId === subcat.subcategory_id)}
                                                onChange={(e) => handleSubcategorySelection(categoryIndex, itemIndex, subcat.subcategory_id, e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                disabled={loading.subcategories || !item.descName}
                                              />
                                              <label
                                                htmlFor={`subcat-${categoryIndex}-${itemIndex}-${subcat.subcategory_id}`}
                                                className="ml-2 text-sm text-gray-700"
                                              >
                                                {subcat.subcategory_name}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {item.subcategories.length > 0 && (
                                <tr className="bg-gray-50">
                                  <td colSpan="7" className="px-3 py-2">
                                    <div className="mb-2">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Subcategory Details</h4>
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-200">
                                          <tr>
                                            <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Subcategory
                                            </th>
                                            <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Qty
                                            </th>
                                            <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Rate
                                            </th>
                                            <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Value
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {item.subcategories.map((subcat, subcatIndex) => (
                                            <tr key={subcatIndex} className={subcatIndex % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                              <td className="px-3 py-1 whitespace-nowrap text-sm">
                                                {subcat.subcategoryName}
                                              </td>
                                              <td className="px-3 py-1 whitespace-nowrap text-sm">
                                                {subcat.poQuantity}
                                              </td>
                                              <td className="px-3 py-1 whitespace-nowrap">
                                                <input
                                                  type="number"
                                                  value={subcat.rate}
                                                  onChange={(e) => handleSubcategoryRateChange(categoryIndex, itemIndex, subcatIndex, e)}
                                                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-sm"
                                                  min="0"
                                                  step="1"
                                                />
                                              </td>
                                              <td className="px-3 py-1 whitespace-nowrap text-sm">
                                                {subcat.value}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={(e) => addItemRow(categoryIndex, e)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitDisabled()}
            >
              {loading.submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : loading.processing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReckoner;