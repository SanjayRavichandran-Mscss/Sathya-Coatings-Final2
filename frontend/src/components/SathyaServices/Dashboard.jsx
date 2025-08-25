// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { 
//   Chart, 
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   ArcElement, 
//   Tooltip, 
//   Legend,
//   PointElement, 
//   LineElement,
//   PolarAreaController,
//   RadialLinearScale
// } from "chart.js";
// import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";

// Chart.register(
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   ArcElement, 
//   Tooltip, 
//   Legend, 
//   PointElement, 
//   LineElement,
//   PolarAreaController,
//   RadialLinearScale
// );

// // Smaller pastel gradient cards
// const cardColorStyles = [
//   "bg-gradient-to-br from-pink-500 to-rose-200 text-white shadow-lg",
//   "bg-gradient-to-br from-cyan-500 to-sky-200 text-white shadow-lg",
//   "bg-gradient-to-br from-emerald-500 to-teal-200 text-white shadow-lg",
//   "bg-gradient-to-br from-amber-500 to-yellow-200 text-white shadow-lg",
//   "bg-gradient-to-br from-purple-500 to-indigo-200 text-white shadow-lg",
// ];

// const cardCompletionStyle = "bg-gradient-to-br from-blue-200 to-indigo-100 text-indigo-900 shadow-lg";
// const card100Style = "bg-gradient-to-r from-green-500 to-emerald-300 text-white shadow-lg";

// const Dashboard = () => {
//   // --- State ---
//   const [companies, setCompanies] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedSite, setSelectedSite] = useState(null);
//   const [completionEntries, setCompletionEntries] = useState([]);
//   const [poTotals, setPoTotals] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [loading, setLoading] = useState({
//     companies: false,
//     projects: false,
//     sites: false,
//     completionEntries: false,
//     poTotals: false,
//   });
//   const [chartType, setChartType] = useState({ value: "po_quantity", label: "PO Quantity" });
//   const [barChartType, setBarChartType] = useState({ value: "bar", label: "Bar" });
//   const [donutChartType, setDonutChartType] = useState({ value: "doughnut", label: "Doughnut" });
//   const [siteDetails, setSiteDetails] = useState({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });

//   // --- Effects/FETCHING ---
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         setLoading((p) => ({ ...p, companies: true }));
//         const response = await axios.get("http://103.118.158.33/api/admin/companies");
//         const companiesData = response.data.data || [];
//         setCompanies(companiesData);
//         if (companiesData.length > 0) {
//           const lastCompany = companiesData[companiesData.length - 1];
//           setSelectedCompany({ value: lastCompany.company_id, label: lastCompany.company_name });
//         }
//       } catch (err) {
//         console.error("Failed to load companies", err);
//       } finally {
//         setLoading((p) => ({ ...p, companies: false }));
//       }
//     };
//     fetchCompanies();
//   }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       const fetchProjects = async () => {
//         try {
//           setLoading((p) => ({ ...p, projects: true }));
//           const response = await axios.get(`http://103.118.158.33/api/admin/projects/${selectedCompany.value}`);
//           const projectsData = response.data.data || [];
//           setProjects(projectsData);
//           if (projectsData.length > 0) {
//             const lastProject = projectsData[projectsData.length - 1];
//             setSelectedProject({ value: lastProject.pd_id, label: lastProject.project_name });
//           }
//         } catch (err) {
//           console.error("Failed to load projects", err);
//         } finally {
//           setLoading((p) => ({ ...p, projects: false }));
//         }
//       };
//       fetchProjects();
//     } else {
//       setProjects([]);
//       setSelectedProject(null);
//       setSites([]);
//       setSelectedSite(null);
//       setCompletionEntries([]);
//       setPoTotals(null);
//       setSelectedCategory(null);
//       setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
//     }
//   }, [selectedCompany]);

//   useEffect(() => {
//     if (selectedProject) {
//       const fetchSites = async () => {
//         try {
//           setLoading((p) => ({ ...p, sites: true }));
//           const response = await axios.get(`http://103.118.158.33/api/admin/sites/${selectedProject.value}`);
//           const sitesData = response.data.data || [];
//           setSites(sitesData);
//           if (sitesData.length > 0) {
//             const lastSite = sitesData[sitesData.length - 1];
//             setSelectedSite({ value: lastSite.site_id, label: `${lastSite.site_name} (PO: ${lastSite.po_number})` });
//           }
//         } catch (err) {
//           console.error("Failed to load sites", err);
//         } finally {
//           setLoading((p) => ({ ...p, sites: false }));
//         }
//       };
//       fetchSites();
//     } else {
//       setSites([]);
//       setSelectedSite(null);
//       setCompletionEntries([]);
//       setPoTotals(null);
//       setSelectedCategory(null);
//       setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
//     }
//   }, [selectedProject]);

//   useEffect(() => {
//     if (selectedSite) {
//       const fetchData = async () => {
//         try {
//           setLoading((p) => ({ ...p, completionEntries: true, poTotals: true }));
//           const [completionResponse, poTotalsResponse] = await Promise.all([
//             axios.get(`http://103.118.158.33/api/admin/completion-entries-by-site/${selectedSite.value}`),
//             axios.get(`http://103.118.158.33/api/admin/po-reckoner-totals/${selectedSite.value}`),
//           ]);
//           setCompletionEntries(completionResponse.data.data || []);
//           const poData = poTotalsResponse.data.data || null;
//           setPoTotals(poData);
//           if (completionResponse.data.data && completionResponse.data.data.length > 0) {
//             const lastCategory = completionResponse.data.data[completionResponse.data.data.length - 1].category_name;
//             setSelectedCategory({ value: lastCategory, label: lastCategory });
//           } else {
//             setSelectedCategory(null);
//           }
//           // Set site details
//           const currentSite = sites.find(s => s.site_id === selectedSite.value);
//           const totalArea = poData ? poData.total_po_quantity : 0;
//           setSiteDetails({
//             start_date: currentSite ? currentSite.start_date : null,
//             location_name: currentSite ? currentSite.location_name : null,
//             total_area: totalArea,
//             current_phase: 'In Progress' // Will be updated in calculateProgressData effect
//           });
//         } catch (err) {
//           console.error("Failed to load data", err);
//           setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
//         } finally {
//           setLoading((p) => ({ ...p, completionEntries: false, poTotals: false }));
//         }
//       };
//       fetchData();
//     } else {
//       setCompletionEntries([]);
//       setPoTotals(null);
//       setSelectedCategory(null);
//       setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
//     }
//   }, [selectedSite, sites]);

//   // Update current_phase when progressData changes
//   useEffect(() => {
//     const progress = calculateProgressData();
//     setSiteDetails(prev => ({
//       ...prev,
//       current_phase: Number(progress.percentage) === 100 ? 'Completed' : 'In Progress'
//     }));
//   }, [completionEntries, poTotals]);

//   // --- DropDown Options ---
//   const companyOptions = companies.map((company) => ({
//     value: company.company_id,
//     label: company.company_name,
//   }));
//   const projectOptions = projects.map((project) => ({
//     value: project.pd_id,
//     label: project.project_name,
//   }));
//   const siteOptions = sites.map((site) => ({
//     value: site.site_id,
//     label: `${site.site_name} (PO: ${site.po_number})`,
//   }));

//   const categoryOptions = completionEntries
//     .map((category) => ({
//       value: category.category_name,
//       label: category.category_name,
//     }))
//     .filter((option, index, self) => index === self.findIndex((t) => t.value === option.value));

//   const chartTypeOptions = [
//     { value: "po_quantity", label: "PO Quantity" },
//     { value: "value", label: "Value" },
//   ];

//   const graphTypeOptions = [
//     { value: "bar", label: "Bar" },
//     { value: "line", label: "Line" },
//     { value: "pie", label: "Pie" },
//     { value: "doughnut", label: "Doughnut" },
//     { value: "polarArea", label: "Polar Area" },
//   ];

//   // --- Totals & Helpers ---
//   const getSubcategoryTotals = (subcategoryName) => {
//     let totalValueAdded = 0;
//     let totalPoQuantity = 0;
//     completionEntries.forEach((category) => {
//       if (category.category_name === selectedCategory?.value) {
//         const subcategory = category.subcategories.find((sc) => sc.subcategory_name === subcategoryName);
//         if (subcategory) {
//           subcategory.entries_by_date.forEach((dateEntry) => {
//             dateEntry.entries.forEach((entry) => {
//               totalValueAdded += entry.value_added || 0;
//             });
//           });
//         }
//       }
//     });
//     if (poTotals && poTotals.subcategory_totals) {
//       const categoryData = poTotals.subcategory_totals.find((cat) => cat.category_name === selectedCategory?.value);
//       if (categoryData) {
//         const subData = categoryData.subcategories.find((sc) => sc.subcategory_name === subcategoryName);
//         if (subData) {
//           totalPoQuantity = subData.po_quantity || 0;
//         }
//       }
//     }
//     return { totalValueAdded, totalPoQuantity };
//   };

//   // Project Completion percent based on po_quantity and area_added
//   const calculateProgressData = () => {
//     if (!poTotals || !completionEntries || completionEntries.length === 0)
//       return { percentage: 0, totalCompletedArea: 0, totalPoQuantity: 0 };
//     const totalCompletedArea = completionEntries
//       .flatMap((cat) => cat.subcategories)
//       .flatMap((subcat) => subcat.entries_by_date)
//       .flatMap((dateEntry) => dateEntry.entries)
//       .reduce((sum, entry) => sum + (entry.area_added || 0), 0);
//     const totalPoQuantity = poTotals.total_po_quantity || 0;
//     const percentage =
//       totalPoQuantity === 0
//         ? 0
//         : (totalCompletedArea / totalPoQuantity) * 100;
//     return {
//       percentage: Math.min(percentage, 100).toFixed(2),
//       totalCompletedArea: totalCompletedArea.toFixed(2),
//       totalPoQuantity: totalPoQuantity.toFixed(2),
//     };
//   };
//   const progressData = calculateProgressData();

//   // ---- Chart Data Preparation ----
//   const subcategories =
//     completionEntries.find((cat) => cat.category_name === selectedCategory?.value)?.subcategories || [];
//   const barLabels = subcategories.map((sub) => sub.subcategory_name);
//   const completedData = subcategories.map((sub) => {
//     let completedArea = 0;
//     let completedValue = 0;
//     sub.entries_by_date.forEach((dateEntry) => {
//       dateEntry.entries.forEach((e) => {
//         completedArea += e.area_added || 0;
//         completedValue += e.value_added || 0;
//       });
//     });
//     return chartType.value === "po_quantity" ? completedArea : completedValue;
//   });
//   const targetData = poTotals && poTotals.subcategory_totals
//     ? poTotals.subcategory_totals
//         .find((cat) => cat.category_name === selectedCategory?.value)
//         ?.subcategories.map((sc) => chartType.value === "po_quantity" ? sc.po_quantity : sc.value) || []
//     : [];

//   const barChartData = {
//     labels: barLabels,
//     datasets: [
//       {
//         label: chartType.value === "po_quantity" ? "Completed Quantity (sqm)" : "Completed Value (₹)",
//         data: completedData,
//         backgroundColor: ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"],
//         borderColor: "#e5e7eb",
//         borderWidth: 1,
//       },
//       {
//         label: chartType.value === "po_quantity" ? "Planned Quantity (sqm)" : "Planned Value (₹)",
//         data: targetData,
//         backgroundColor: "#e5e7eb",
//         borderColor: "#d1d5db",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieChartData = {
//     labels: subcategories.map((sub) => 
//       `${sub.subcategory_name} (PO: ${poTotals?.subcategory_totals?.find(cat => cat.category_name === selectedCategory?.value)?.subcategories.find(sc => sc.subcategory_name === sub.subcategory_name)?.po_quantity || 0}, Val: ${poTotals?.subcategory_totals?.find(cat => cat.category_name === selectedCategory?.value)?.subcategories.find(sc => sc.subcategory_name === sub.subcategory_name)?.value || 0})`
//     ),
//     datasets: [
//       {
//         label: chartType.value === "po_quantity" ? "Completed Quantity (sqm)" : "Completed Value (₹)",
//         data: completedData,
//         backgroundColor: ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"],
//         borderColor: "#ffffff",
//         borderWidth: 2,
//       },
//     ],
//   };

//   // Line Chart (Daily progress for the selected category)
//   const prepareLineChartData = () => {
//     if (!selectedCategory || !completionEntries.length) return null;
    
//     const allDates = new Set();
//     completionEntries.forEach(category => {
//       if (category.category_name === selectedCategory.value) {
//         category.subcategories.forEach(subcategory => {
//           subcategory.entries_by_date.forEach(dateEntry => {
//             allDates.add(dateEntry.entry_date);
//           });
//         });
//       }
//     });
    
//     const sortedDates = Array.from(allDates).sort();
//     const datasets = [];
//     const colors = ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"];
    
//     completionEntries.forEach(category => {
//       if (category.category_name === selectedCategory.value) {
//         category.subcategories.forEach((subcategory, index) => {
//           const cumulativeData = [];
//           let cumulativeTotal = 0;
          
//           sortedDates.forEach(date => {
//             const dateEntry = subcategory.entries_by_date.find(d => d.entry_date === date);
//             if (dateEntry) {
//               cumulativeTotal += dateEntry.entries.reduce((sum, entry) => sum + (entry.area_added || 0), 0);
//             }
//             cumulativeData.push(cumulativeTotal);
//           });
          
//           datasets.push({
//             label: subcategory.subcategory_name,
//             data: cumulativeData,
//             borderColor: colors[index % colors.length],
//             backgroundColor: colors[index % colors.length] + "20",
//             tension: 0.3,
//             fill: false,
//           });
//         });
//       }
//     });
    
//     return {
//       labels: sortedDates,
//       datasets: datasets
//     };
//   };

//   const lineChartData = prepareLineChartData();

//   // Render Chart based on selected type
//   const renderChart = (chartType, data, options) => {
//     switch (chartType) {
//       case "bar":
//         return <Bar data={data} options={options} />;
//       case "line":
//         return <Line data={data} options={options} />;
//       case "pie":
//         return <Pie data={data} options={options} />;
//       case "doughnut":
//         return <Doughnut data={data} options={options} />;
//       case "polarArea":
//         return <PolarArea data={data} options={options} />;
//       default:
//         return <Bar data={data} options={options} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateStr) => {
//     if (!dateStr) return 'N/A';
//     const date = new Date(dateStr);
//     return date.toLocaleDateString();
//   };

//   // ---- UI Rendering ----
//   return (
//     <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
//       {/* --- Filter Controls --- */}
//       <div className="flex flex-col items-center mb-6">
//         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
//           <div className="w-full sm:w-[200px]">
//             <Select
//               options={companyOptions}
//               value={selectedCompany}
//               onChange={setSelectedCompany}
//               placeholder="Company"
//               isLoading={loading.companies}
//               isClearable
//               className="text-sm"
//               styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
//             />
//           </div>
//           <div className="w-full sm:w-[200px]">
//             <Select
//               options={projectOptions}
//               value={selectedProject}
//               onChange={setSelectedProject}
//               placeholder="Project"
//               isDisabled={!selectedCompany}
//               isClearable
//               className="text-sm"
//               styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
//             />
//           </div>
//           <div className="w-full sm:w-[250px]">
//             <Select
//               options={siteOptions}
//               value={selectedSite}
//               onChange={setSelectedSite}
//               placeholder="Site"
//               isLoading={loading.sites}
//               isDisabled={!selectedProject}
//               isClearable
//               className="text-sm"
//               styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
//             />
//           </div>
//           <div className="w-full sm:w-[200px]">
//             <Select
//               options={categoryOptions}
//               value={selectedCategory}
//               onChange={setSelectedCategory}
//               placeholder="Category"
//               isClearable
//               className="text-sm"
//               styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* --- Site Details Section --- */}
//       {selectedSite && (
//         <div className="flex flex-col items-center mb-8">
//           <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-4">
//             <div className="text-center">
//               <h4 className="font-semibold text-gray-700">Start Date</h4>
//               <p className="text-gray-900">{formatDate(siteDetails.start_date) || 'No data found'}</p>
//             </div>
//             <div className="text-center">
//               <h4 className="font-semibold text-gray-700">Current Phase</h4>
//               <p className="text-gray-900">{siteDetails.current_phase || 'No data found'}</p>
//             </div>
//             <div className="text-center">
//               <h4 className="font-semibold text-gray-700">Location</h4>
//               <p className="text-gray-900">{siteDetails.location_name || 'No data found'}</p>
//             </div>
//             <div className="text-center">
//               <h4 className="font-semibold text-gray-700">Total Area (sqm)</h4>
//               <p className="text-gray-900">{siteDetails.total_area.toLocaleString() || 'No data found'}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- Cards Section --- */}
//       {(loading.completionEntries || loading.poTotals) ? (
//         <div className="text-center text-gray-500 py-10">Loading...</div>
//       ) : (
//         selectedSite && selectedCategory && poTotals && completionEntries.length > 0 ? (
//           <>
//             <div className="flex flex-wrap items-stretch gap-6 justify-center mb-8 pt-3">
//               {/* Subcategory Cards */}
//               {subcategories.map((subcategory, i) => {
//                 const { totalValueAdded, totalPoQuantity } = getSubcategoryTotals(subcategory.subcategory_name);
//                 let completedArea = 0;
//                 let completedValue = 0;
//                 subcategory.entries_by_date.forEach((dateEntry) => {
//                   dateEntry.entries.forEach((e) => {
//                     completedArea += e.area_added || 0;
//                     completedValue += e.value_added || 0;
//                   });
//                 });
//                 const totalValue = poTotals.subcategory_totals
//                   .find((cat) => cat.category_name === selectedCategory.value)
//                   ?.subcategories.find((sc) => sc.subcategory_name === subcategory.subcategory_name)?.value || 0;
//                 return (
//                   <div
//                     key={subcategory.subcategory_name}
//                     className={`bg-gradient-to-br from-gray-50 to-gray-100 w-full sm:w-[250px] rounded-xl p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 shadow-lg`}
//                   >
//                     <h3 className="text-lg font-bold text-gray-800 mb-3">{subcategory.subcategory_name}</h3>
//                     <div className="bg-gray-200 bg-opacity-20 p-3 rounded-lg w-full">
//                       <div className="flex justify-between text-sm text-gray-800">
//                         <span>Completed Area (sqm):</span>
//                         <span className="font-semibold">{completedArea.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-800 mt-1">
//                         <span>Total (sqm):</span>
//                         <span className="font-semibold">{totalPoQuantity.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-800 mt-2">
//                         <span>Completed Value:</span>
//                         <span className="font-semibold">₹{completedValue.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-800 mt-1">
//                         <span>Total Value:</span>
//                         <span className="font-semibold">₹{totalValue.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               {/* Project Completion Card */}
//               <div
//                 className={`${Number(progressData.percentage) === 100 ? 'bg-gradient-to-r from-cyan-500 to-teal-300 text-gray-800 shadow-lg' : 'bg-gradient-to-br from-blue-200 to-cyan-100 text-gray-800 shadow-lg'} w-full sm:w-[250px] rounded-xl p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105`}
//                 style={{ minHeight: "150px" }}
//               >
//                 <h3 className="text-lg font-bold text-gray-800 mb-2">Project Completion</h3>
//                 <div className="flex-1 flex items-center justify-center w-full">
//                   <span className="text-5xl font-extrabold text-gray-800">{progressData.percentage}%</span>
//                 </div>
//               </div>
//             </div>

//             {/* --- Charts Area (below cards) --- */}
//             <div className="flex flex-col gap-6 items-stretch justify-center pt-2">
//               {/* First row: Bar and Doughnut charts */}
//               <div className="flex flex-col sm:flex-row gap-6">
//                 {/* Chart 1 (Bar/Line/Pie/Doughnut/PolarArea) */}
//                 <div className="bg-white rounded-lg shadow-lg p-4 flex-1 min-w-[340px]">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-semibold text-lg text-gray-800">
//                       {chartType.value === "po_quantity" ? "Area" : "Value"} Completion Overview
//                     </h3>
//                     <div className="flex gap-2">
//                       <div className="w-[140px]">
//                         <Select
//                           options={chartTypeOptions}
//                           value={chartType}
//                           onChange={setChartType}
//                           placeholder="Data Type"
//                           isClearable={false}
//                           className="text-xs"
//                           styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
//                         />
//                       </div>
//                       <div className="w-[140px]">
//                         <Select
//                           options={graphTypeOptions}
//                           value={barChartType}
//                           onChange={setBarChartType}
//                           placeholder="Chart Type"
//                           isClearable={false}
//                           className="text-xs"
//                           styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="w-full h-[320px]">
//                     {renderChart(barChartType.value, barChartData, {
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       scales: barChartType.value === "bar" || barChartType.value === "line" ? {
//                         y: {
//                           beginAtZero: true,
//                           title: { display: true, text: chartType.value === "po_quantity" ? "Area (sqm)" : "Value (₹)" },
//                         },
//                         x: {
//                           title: { display: true, text: "Stage" },
//                         },
//                       } : {},
//                       plugins: {
//                         legend: {
//                           position: "bottom",
//                           labels: { font: { size: 12 } },
//                         },
//                         title: { display: false },
//                       },
//                     })}
//                   </div>
//                 </div>
//                 {/* Chart 2 (Pie/Doughnut/PolarArea) */}
//                 <div className="bg-white rounded-lg shadow-lg p-4 flex-1 min-w-[340px]">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-semibold text-lg text-gray-800">
//                       {chartType.value === "po_quantity" ? "Area" : "Value"} Progress Comparison
//                     </h3>
//                     <div className="w-[140px]">
//                       <Select
//                         options={graphTypeOptions}
//                         value={donutChartType}
//                         onChange={setDonutChartType}
//                         placeholder="Chart Type"
//                         isClearable={false}
//                         className="text-xs"
//                         styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
//                       />
//                     </div>
//                   </div>
//                   <div className="w-full h-[320px]">
//                     {renderChart(donutChartType.value, pieChartData, {
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: "bottom",
//                           labels: { font: { size: 12 } },
//                         },
//                         title: { display: false },
//                       },
//                     })}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Second row: Line Chart */}
//               {lineChartData && (
//                 <div className="bg-white rounded-lg shadow-lg p-4">
//                   <h3 className="font-semibold text-center mb-2 text-lg text-gray-800">
//                     Daily Progress Trend
//                   </h3>
//                   <div className="w-full h-[400px]">
//                     <Line
//                       data={lineChartData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         scales: {
//                           y: {
//                             beginAtZero: true,
//                             title: { display: true, text: "Cumulative Area (sqm)" },
//                           },
//                           x: {
//                             title: { display: true, text: "Date" },
//                           },
//                         },
//                         plugins: {
//                           legend: {
//                             position: "bottom",
//                             labels: { font: { size: 12 } },
//                           },
//                           title: { display: false },
//                         },
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="text-center text-gray-400 py-12 text-base">
//             Please select all options to view dashboard.
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default Dashboard;



























import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Tooltip, 
  Legend,
  PointElement, 
  LineElement,
  PolarAreaController,
  RadialLinearScale
} from "chart.js";
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";

Chart.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement,
  PolarAreaController,
  RadialLinearScale
);

// Smaller pastel gradient cards
const cardColorStyles = [
  "bg-gradient-to-br from-pink-500 to-rose-200 text-white shadow-lg",
  "bg-gradient-to-br from-cyan-500 to-sky-200 text-white shadow-lg",
  "bg-gradient-to-br from-emerald-500 to-teal-200 text-white shadow-lg",
  "bg-gradient-to-br from-amber-500 to-yellow-200 text-white shadow-lg",
  "bg-gradient-to-br from-purple-500 to-indigo-200 text-white shadow-lg",
];

const cardCompletionStyle = "bg-gradient-to-br from-blue-200 to-indigo-100 text-indigo-900 shadow-lg";
const card100Style = "bg-gradient-to-r from-green-500 to-emerald-300 text-white shadow-lg";

const Dashboard = () => {
  // --- State ---
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [completionEntries, setCompletionEntries] = useState([]);
  const [poTotals, setPoTotals] = useState(null);
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    companies: false,
    projects: false,
    sites: false,
    completionEntries: false,
    poTotals: false,
    workDescriptions: false,
    expenseDetails: false,
  });
  const [chartType, setChartType] = useState({ value: "po_quantity", label: "PO Quantity" });
  const [barChartType, setBarChartType] = useState({ value: "bar", label: "Bar" });
  const [donutChartType, setDonutChartType] = useState({ value: "doughnut", label: "Doughnut" });
  const [expenseGraphType, setExpenseGraphType] = useState({ value: "bar", label: "Bar" });
  const [expenseDataType, setExpenseDataType] = useState({ value: "overall", label: "Overall" });
  const [siteDetails, setSiteDetails] = useState({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });

  // --- Effects/FETCHING ---
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading((p) => ({ ...p, companies: true }));
        setError(null);
        const response = await axios.get("http://103.118.158.33/api/admin/companies");
        const companiesData = response.data.data || [];
        setCompanies(companiesData);
        if (companiesData.length > 0) {
          const lastCompany = companiesData[companiesData.length - 1];
          setSelectedCompany({ value: lastCompany.company_id, label: lastCompany.company_name });
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
        setError("Failed to load companies. Please try again.");
      } finally {
        setLoading((p) => ({ ...p, companies: false }));
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const fetchProjects = async () => {
        try {
          setLoading((p) => ({ ...p, projects: true }));
          setError(null);
          const response = await axios.get(`http://103.118.158.33/api/admin/projects/${selectedCompany.value}`);
          const projectsData = response.data.data || [];
          setProjects(projectsData);
          if (projectsData.length > 0) {
            const lastProject = projectsData[projectsData.length - 1];
            setSelectedProject({ value: lastProject.pd_id, label: lastProject.project_name });
          }
        } catch (err) {
          console.error("Failed to load projects:", err);
          setError("Failed to load projects. Please try again.");
        } finally {
          setLoading((p) => ({ ...p, projects: false }));
        }
      };
      fetchProjects();
    } else {
      setProjects([]);
      setSelectedProject(null);
      setSites([]);
      setSelectedSite(null);
      setCompletionEntries([]);
      setPoTotals(null);
      setExpenseDetails(null);
      setSelectedCategory(null);
      setSelectedDescription(null);
      setWorkDescriptions([]);
      setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
      setError(null);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedProject) {
      const fetchSites = async () => {
        try {
          setLoading((p) => ({ ...p, sites: true }));
          setError(null);
          const response = await axios.get(`http://103.118.158.33/api/admin/sites/${selectedProject.value}`);
          const sitesData = response.data.data || [];
          setSites(sitesData);
          if (sitesData.length > 0) {
            const lastSite = sitesData[sitesData.length - 1];
            setSelectedSite({ value: lastSite.site_id, label: `${lastSite.site_name} (PO: ${lastSite.po_number})` });
          }
        } catch (err) {
          console.error("Failed to load sites:", err);
          setError("Failed to load sites. Please try again.");
        } finally {
          setLoading((p) => ({ ...p, sites: false }));
        }
      };
      fetchSites();
    } else {
      setSites([]);
      setSelectedSite(null);
      setCompletionEntries([]);
      setPoTotals(null);
      setExpenseDetails(null);
      setSelectedCategory(null);
      setSelectedDescription(null);
      setWorkDescriptions([]);
      setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
      setError(null);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedSite && selectedCategory) {
      const fetchWorkDescriptions = async () => {
        try {
          setLoading((p) => ({ ...p, workDescriptions: true }));
          setError(null);
          const response = await axios.get(`http://103.118.158.33/api/admin/work-descriptions/${selectedSite.value}/${selectedCategory.value}`);
          const descriptionsData = response.data.data || [];
          setWorkDescriptions(descriptionsData);
          setSelectedDescription(null);
        } catch (err) {
          console.error("Failed to load work descriptions:", err);
          setError("Failed to load work descriptions. Please try again.");
          setWorkDescriptions([]);
          setSelectedDescription(null);
        } finally {
          setLoading((p) => ({ ...p, workDescriptions: false }));
        }
      };
      fetchWorkDescriptions();
    } else {
      setWorkDescriptions([]);
      setSelectedDescription(null);
    }
  }, [selectedSite, selectedCategory]);

  useEffect(() => {
    if (selectedSite) {
      const fetchData = async () => {
        try {
          setLoading((p) => ({ ...p, completionEntries: true, poTotals: true, expenseDetails: true }));
          setError(null);
          const [completionResponse, poTotalsResponse, expenseResponse] = await Promise.all([
            axios.get(`http://103.118.158.33/api/admin/completion-entries-by-site/${selectedSite.value}`),
            axios.get(`http://103.118.158.33/api/admin/po-reckoner-totals/${selectedSite.value}`),
            axios.get(`http://103.118.158.33/api/admin/expense-details/${selectedSite.value}`)
          ]);
          const completionData = completionResponse.data.data || [];
          setCompletionEntries(completionData);
          const poData = poTotalsResponse.data.data || null;
          setPoTotals(poData);
          const expenseData = expenseResponse.data.data || null;
          setExpenseDetails(expenseData);
          if (completionData.length > 0) {
            const lastCategory = completionData[completionData.length - 1];
            setSelectedCategory({
              value: lastCategory.category_id,
              label: lastCategory.category_name || lastCategory.category_id || "Unknown Category"
            });
          } else {
            setSelectedCategory(null);
            setSelectedDescription(null);
            setWorkDescriptions([]);
          }
          const currentSite = sites.find(s => s.site_id === selectedSite.value);
          const totalArea = poData ? poData.total_po_quantity : 0;
          setSiteDetails({
            start_date: currentSite ? currentSite.start_date : null,
            location_name: currentSite ? currentSite.location_name : null,
            total_area: totalArea,
            current_phase: 'In Progress'
          });
        } catch (err) {
          console.error("Failed to load data:", err);
          if (err.response && err.response.status === 404) {
            setError(`No data found for site ${selectedSite.value}. Please select a different site.`);
          } else {
            setError("Failed to load dashboard data. Please try again.");
          }
          setCompletionEntries([]);
          setPoTotals(null);
          setExpenseDetails(null);
          setSelectedCategory(null);
          setSelectedDescription(null);
          setWorkDescriptions([]);
          setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
        } finally {
          setLoading((p) => ({ ...p, completionEntries: false, poTotals: false, expenseDetails: false }));
        }
      };
      fetchData();
    } else {
      setCompletionEntries([]);
      setPoTotals(null);
      setExpenseDetails(null);
      setSelectedCategory(null);
      setSelectedDescription(null);
      setWorkDescriptions([]);
      setSiteDetails({ start_date: null, location_name: null, total_area: 0, current_phase: 'In Progress' });
      setError(null);
    }
  }, [selectedSite, sites]);

  useEffect(() => {
    const progress = calculateProgressData();
    setSiteDetails(prev => ({
      ...prev,
      current_phase: Number(progress.percentage) === 100 ? 'Completed' : 'In Progress'
    }));
  }, [completionEntries, poTotals]);

  // --- DropDown Options ---
  const companyOptions = companies.map((company) => ({
    value: company.company_id,
    label: company.company_name || company.company_id || "Unknown Company",
  }));

  const projectOptions = projects.map((project) => ({
    value: project.pd_id,
    label: project.project_name || project.pd_id || "Unknown Project",
  }));

  const siteOptions = sites.map((site) => ({
    value: site.site_id,
    label: `${site.site_name || site.site_id || "Unknown Site"} (PO: ${site.po_number || "N/A"})`,
  }));

  const categoryOptions = completionEntries
    .map((category) => ({
      value: category.category_id,
      label: category.category_name || category.category_id || "Unknown Category",
    }))
    .filter((option, index, self) => 
      option.value && index === self.findIndex((t) => t.value === option.value)
    );

  const descriptionOptions = workDescriptions.map((desc) => ({
    value: desc.desc_id,
    label: desc.desc_name || desc.desc_id || "Unknown Description",
  }));

  const chartTypeOptions = [
    { value: "po_quantity", label: "PO Quantity" },
    { value: "value", label: "Value" },
  ];

  const graphTypeOptions = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
    { value: "doughnut", label: "Doughnut" },
    { value: "polarArea", label: "Polar Area" },
  ];

  const expenseDataTypeOptions = [
    { value: "overall", label: "Overall" },
    { value: "category", label: "Category" },
    { value: "details", label: "Work Description" },
    // { value: "expensed", label: "Expensed Amount" },
  ];

  // --- Totals & Helpers ---
  const getSubcategoryTotals = (subcategoryName, descId) => {
    let totalValueAdded = 0;
    let totalPoQuantity = 0;
    completionEntries.forEach((category) => {
      if (category.category_id === selectedCategory?.value) {
        const subcategory = category.subcategories.find((sc) => sc.subcategory_name === subcategoryName);
        if (subcategory) {
          subcategory.entries_by_date.forEach((dateEntry) => {
            dateEntry.entries.forEach((entry) => {
              if (!descId || entry.desc_id == descId) {
                totalValueAdded += entry.value_added || 0;
              }
            });
          });
        }
      }
    });
    if (poTotals && poTotals.subcategory_totals) {
      const categoryData = poTotals.subcategory_totals.find((cat) => cat.category_id === selectedCategory?.value);
      if (categoryData) {
        const descriptionData = categoryData.descriptions.find((desc) => desc.desc_id == descId);
        if (descriptionData) {
          const subData = descriptionData.subcategories.find((sc) => sc.subcategory_name === subcategoryName);
          if (subData) {
            totalPoQuantity = subData.po_quantity || 0;
          }
        }
      }
    }
    return { totalValueAdded, totalPoQuantity };
  };

  const getFilteredSubcategories = () => {
    if (!selectedCategory || !poTotals?.subcategory_totals) return [];
    const category = poTotals.subcategory_totals.find((cat) => cat.category_id === selectedCategory.value);
    if (!category) return [];
    
    if (!selectedDescription) {
      return category.descriptions.flatMap(desc => desc.subcategories);
    }
    
    const description = category.descriptions.find((desc) => desc.desc_id == selectedDescription.value);
    return description ? description.subcategories : [];
  };

  const subcategories = getFilteredSubcategories();

  const calculateProgressData = () => {
    if (!poTotals || !completionEntries || completionEntries.length === 0 || !subcategories.length) {
      return { percentage: 0, totalCompletedArea: 0, totalPoQuantity: 0 };
    }

    // Get the last subcategory
    const lastSubcategory = subcategories[subcategories.length - 1];
    const subcategoryName = lastSubcategory.subcategory_name;

    // Calculate completed area for the last subcategory
    let completedArea = 0;
    const category = completionEntries.find((cat) => cat.category_id === selectedCategory?.value);
    if (category) {
      const subcategory = category.subcategories.find((sc) => sc.subcategory_name === subcategoryName);
      if (subcategory) {
        subcategory.entries_by_date.forEach((dateEntry) => {
          dateEntry.entries.forEach((entry) => {
            if (!selectedDescription || entry.desc_id === selectedDescription.value) {
              completedArea += entry.area_added || 0;
            }
          });
        });
      }
    }

    // Get total PO quantity for the last subcategory
    let totalPoQuantity = 0;
    if (poTotals?.subcategory_totals) {
      const categoryData = poTotals.subcategory_totals.find((cat) => cat.category_id === selectedCategory?.value);
      if (categoryData) {
        const descriptionData = categoryData.descriptions.find((desc) =>
          desc.subcategories.some((sc) => sc.subcategory_name === subcategoryName)
        );
        if (descriptionData) {
          const subData = descriptionData.subcategories.find((sc) => sc.subcategory_name === subcategoryName);
          totalPoQuantity = subData?.po_quantity || 0;
        }
      }
    }

    // Calculate percentage based on last subcategory's completed area and total area
    const percentage = totalPoQuantity === 0 ? 0 : (completedArea / totalPoQuantity) * 100;

    return {
      percentage: Math.min(percentage, 100).toFixed(2),
      totalCompletedArea: completedArea.toFixed(2),
      totalPoQuantity: totalPoQuantity.toFixed(2),
    };
  };

  const progressData = calculateProgressData();

  const calculateExpenseTotals = () => {
    if (!expenseDetails) {
      return { totalAllocated: 0, totalSpent: 0, cashInHand: 0 };
    }
    const totalAllocated = expenseDetails.total_allocated || 0;
    const totalSpent = expenseDetails.total_spent || 0;
    const cashInHand = totalAllocated - totalSpent;
    return { totalAllocated, totalSpent, cashInHand };
  };
  const expenseTotals = calculateExpenseTotals();

  // ---- Chart Data Preparation ----
  const barLabels = subcategories.map((sub) => sub.subcategory_name);
  const completedData = subcategories.map((sub) => {
    let completedArea = 0;
    let completedValue = 0;
    const category = completionEntries.find((cat) => cat.category_id === selectedCategory?.value);
    if (category) {
      const subcategory = category.subcategories.find((sc) => sc.subcategory_name === sub.subcategory_name);
      if (subcategory) {
        subcategory.entries_by_date.forEach((dateEntry) => {
          dateEntry.entries.forEach((e) => {
            if (!selectedDescription || e.desc_id == selectedDescription.value) {
              completedArea += e.area_added || 0;
              completedValue += e.value_added || 0;
            }
          });
        });
      }
    }
    return chartType.value === "po_quantity" ? completedArea : completedValue;
  });
  const targetData = subcategories.map((sc) => chartType.value === "po_quantity" ? sc.po_quantity : sc.value);

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: chartType.value === "po_quantity" ? "Completed Quantity (sqm)" : "Completed Value (₹)",
        data: completedData,
        backgroundColor: ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"],
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
      {
        label: chartType.value === "po_quantity" ? "Planned Quantity (sqm)" : "Planned Value (₹)",
        data: targetData,
        backgroundColor: "#e5e7eb",
        borderColor: "#d1d5db",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: subcategories.map((sub) => 
      `${sub.subcategory_name} (PO: ${sub.po_quantity || 0}, Val: ${sub.value || 0})`
    ),
    datasets: [
      {
        label: chartType.value === "po_quantity" ? "Completed Quantity (sqm)" : "Completed Value (₹)",
        data: completedData,
        backgroundColor: ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const prepareLineChartData = () => {
    if (!selectedCategory || !completionEntries.length) return null;
    
    const allDates = new Set();
    completionEntries.forEach(category => {
      if (category.category_id === selectedCategory.value) {
        category.subcategories.forEach(subcategory => {
          subcategory.entries_by_date.forEach(dateEntry => {
            allDates.add(dateEntry.entry_date);
          });
        });
      }
    });
    
    const sortedDates = Array.from(allDates).sort();
    const datasets = [];
    const colors = ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"];
    
    const filteredSubcategories = getFilteredSubcategories();
    filteredSubcategories.forEach((subcategory, index) => {
      const cumulativeData = [];
      let cumulativeTotal = 0;
      
      sortedDates.forEach(date => {
        const category = completionEntries.find(cat => cat.category_id === selectedCategory.value);
        if (category) {
          const sub = category.subcategories.find(sc => sc.subcategory_name === subcategory.subcategory_name);
          if (sub) {
            const dateEntry = sub.entries_by_date.find(d => d.entry_date === date);
            if (dateEntry) {
              cumulativeTotal += dateEntry.entries
                .filter(e => !selectedDescription || e.desc_id == selectedDescription.value)
                .reduce((sum, entry) => sum + (entry.area_added || 0), 0);
            }
          }
        }
        cumulativeData.push(cumulativeTotal);
      });
      
      datasets.push({
        label: subcategory.subcategory_name,
        data: cumulativeData,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + "20",
        tension: 0.3,
        fill: false,
      });
    });
    
    return {
      labels: sortedDates,
      datasets: datasets
    };
  };

  const lineChartData = prepareLineChartData();

  // Expense Chart Data (Overall, Category, Details, Expensed Amount)
  const prepareExpenseChartData = () => {
    if (!expenseDetails) return null;

    let labels = [];
    let data = [];
    let title = "";
    let xAxisTitle = "";

    switch (expenseDataType.value) {
      case "overall":
        labels = ['Allocated', 'Spent'];
        data = [expenseTotals.totalAllocated, expenseTotals.totalSpent];
        title = "Allocated vs Spent";
        xAxisTitle = "Status";
        break;
      case "category":
        labels = expenseDetails.expenses_by_category.map(e => e.expense_category_name || "Unknown Category");
        data = expenseDetails.expenses_by_category.map(e => e.total_expense || 0);
        title = "Expenses by Category";
        xAxisTitle = "Expense Category";
        break;
      case "details":
      case "expensed":
        labels = expenseDetails.expenses_by_work_description.map(e => e.desc_name || "Unknown Description");
        data = expenseDetails.expenses_by_work_description.map(e => e.total_expense || 0);
        title = expenseDataType.value === "details" ? "Expenses by Description" : "Expensed Amount by Description";
        xAxisTitle = "Work Description";
        break;
      default:
        return null;
    }

    return {
      labels,
      datasets: [
        {
          label: "Amount (₹)",
          data,
          backgroundColor: ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd"],
          borderColor: "#e5e7eb",
          borderWidth: 1,
        },
      ],
      title,
      xAxisTitle,
    };
  };

  const expenseChartData = prepareExpenseChartData();

  // Daily Expense Trend Line Chart (by Category or Description)
  const prepareDailyExpenseTrendChartData = () => {
    if (!expenseDetails || !expenseDetails.expenses_by_date) return null;

    const sortedDates = expenseDetails.expenses_by_date
      .map(e => e.expense_date)
      .sort((a, b) => a.localeCompare(b));
    const datasets = [];
    const colors = ["#fb7185", "#38bdf8", "#fde047", "#2dd4bf", "#c4b5fd", "#f43f5e", "#0ea5e9", "#eab308", "#14b8a6", "#8b5cf6"];

    if (expenseDataType.value === "category") {
      // Group by expense category
      const categories = expenseDetails.expenses_by_category.map(e => e.expense_category_name || "Unknown Category");
      categories.forEach((category, index) => {
        const data = sortedDates.map(date => {
          // Find the total expense for this category on the given date
          // Since API provides expenses_by_date, we need to assume expenses are split by category
          // For simplicity, we distribute category totals proportionally based on daily totals
          const dailyTotal = expenseDetails.expenses_by_date.find(e => e.expense_date === date)?.total_expense || 0;
          const categoryTotal = expenseDetails.expenses_by_category.find(c => c.expense_category_name === category)?.total_expense || 0;
          const totalAcrossDates = expenseDetails.expenses_by_date.reduce((sum, e) => sum + e.total_expense, 0);
          return totalAcrossDates ? (categoryTotal * dailyTotal) / totalAcrossDates : 0;
        });
        datasets.push({
          label: category,
          data,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + "20",
          tension: 0.3,
          fill: false,
        });
      });
    } else {
      // Group by work description
      const descriptions = expenseDetails.expenses_by_work_description.map(e => e.desc_name || "Unknown Description");
      descriptions.forEach((desc, index) => {
        const data = sortedDates.map(date => {
          // Directly use expenses_by_date for the specific work description
          const dailyTotal = expenseDetails.expenses_by_date.find(e => e.expense_date === date)?.total_expense || 0;
          const descTotal = expenseDetails.expenses_by_work_description.find(d => d.desc_name === desc)?.total_expense || 0;
          const totalAcrossDates = expenseDetails.expenses_by_date.reduce((sum, e) => sum + e.total_expense, 0);
          return totalAcrossDates ? (descTotal * dailyTotal) / totalAcrossDates : 0;
        });
        datasets.push({
          label: desc,
          data,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + "20",
          tension: 0.3,
          fill: false,
        });
      });
    }

    return {
      labels: sortedDates,
      datasets,
    };
  };
  const dailyExpenseTrendChartData = prepareDailyExpenseTrendChartData();

  // Render Chart based on selected type
  const renderChart = (chartType, data, options) => {
    switch (chartType) {
      case "bar":
        return <Bar data={data} options={options} />;
      case "line":
        return <Line data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      case "polarArea":
        return <PolarArea data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // ---- UI Rendering ----
  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* --- Filter Controls --- */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
          <div className="w-full sm:w-[200px]">
            <Select
              options={companyOptions}
              value={selectedCompany}
              onChange={setSelectedCompany}
              placeholder="Company"
              isLoading={loading.companies}
              isClearable
              className="text-sm"
              styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select
              options={projectOptions}
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder="Project"
              isDisabled={!selectedCompany}
              isClearable
              className="text-sm"
              styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
            />
          </div>
          <div className="w-full sm:w-[250px]">
            <Select
              options={siteOptions}
              value={selectedSite}
              onChange={setSelectedSite}
              placeholder="Site"
              isLoading={loading.sites}
              isDisabled={!selectedProject}
              isClearable
              className="text-sm"
              styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(option) => {
                setSelectedCategory(option);
                setSelectedDescription(null);
                setWorkDescriptions([]);
              }}
              placeholder="Category"
              isClearable
              className="text-sm"
              styles={{ control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }) }}
            />
          </div>
          {/* <div className="w-full sm:w-[200px]">
            <Select
              options={descriptionOptions}
              value={selectedDescription}
              onChange={setSelectedDescription}
              placeholder="Work Description"
              isLoading={loading.workDescriptions}
              isDisabled={!selectedCategory || loading.workDescriptions}
              isClearable
              className="text-sm"
              styles={{ 
                control: (base) => ({ ...base, minHeight: "36px", fontSize: "1rem" }),
                menu: (base) => ({ ...base, zIndex: 9999 })
              }}
            />
          </div> */}
        </div>
      </div>

      {/* --- Error Message --- */}
      {error && (
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      )}

      {/* --- Site Details Section --- */}
      {selectedSite && !error && (
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-700">Start Date</h4>
              <p className="text-gray-900">{formatDate(siteDetails.start_date) || 'No data found'}</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-700">Current Phase</h4>
              <p className="text-gray-900">{siteDetails.current_phase || 'No data found'}</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-700">Location</h4>
              <p className="text-gray-900">{siteDetails.location_name || 'No data found'}</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-700">Total Area (sqm)</h4>
              <p className="text-gray-900">{siteDetails.total_area.toLocaleString() || 'No data found'}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- Cards Section --- */}
      {(loading.completionEntries || loading.poTotals || loading.workDescriptions || loading.expenseDetails) ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : (
        selectedSite && selectedCategory && poTotals && completionEntries.length > 0 && !error ? (
          <>
            <div className="flex flex-wrap items-stretch gap-6 justify-center mb-8 pt-3">
              {/* Subcategory Cards */}
              {subcategories.map((subcategory, i) => {
                const descId = selectedDescription 
                  ? selectedDescription.value 
                  : poTotals.subcategory_totals
                      .find(cat => cat.category_id === selectedCategory.value)
                      ?.descriptions.find(desc => 
                        desc.subcategories.some(sc => sc.subcategory_name === subcategory.subcategory_name)
                      )?.desc_id;
                const { totalValueAdded, totalPoQuantity } = getSubcategoryTotals(subcategory.subcategory_name, descId);
                let completedArea = 0;
                let completedValue = 0;
                const category = completionEntries.find((cat) => cat.category_id === selectedCategory.value);
                if (category) {
                  const sub = category.subcategories.find((sc) => sc.subcategory_name === subcategory.subcategory_name);
                  if (sub) {
                    sub.entries_by_date.forEach((dateEntry) => {
                      dateEntry.entries.forEach((e) => {
                        if (!selectedDescription || e.desc_id == selectedDescription.value) {
                          completedArea += e.area_added || 0;
                          completedValue += e.value_added || 0;
                        }
                      });
                    });
                  }
                }
                const totalValue = subcategories.find((sc) => sc.subcategory_name === subcategory.subcategory_name)?.value || 0;
                return (
                  <div
                    key={subcategory.subcategory_name}
                    className={`bg-gradient-to-br from-gray-50 to-gray-100 w-full sm:w-[250px] rounded-xl p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 shadow-lg`}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{subcategory.subcategory_name}</h3>
                    <div className="bg-gray-200 bg-opacity-20 p-3 rounded-lg w-full">
                      <div className="flex justify-between text-sm text-gray-800">
                        <span>Completed Area (sqm):</span>
                        <span className="font-semibold">{completedArea.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-800 mt-1">
                        <span>Total (sqm):</span>
                        <span className="font-semibold">{totalPoQuantity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-800 mt-2">
                        <span>Completed Value:</span>
                        <span className="font-semibold">₹{completedValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-800 mt-1">
                        <span>Total Value:</span>
                        <span className="font-semibold">₹{totalValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Project Completion Card */}
              <div
                className={`${Number(progressData.percentage) === 100 ? 'bg-gradient-to-r from-cyan-500 to-teal-300 text-gray-800 shadow-lg' : 'bg-gradient-to-br from-blue-200 to-cyan-100 text-gray-800 shadow-lg'} w-full sm:w-[250px] rounded-xl p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105`}
                style={{ minHeight: "150px" }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">Project Completion</h3>
                <div className="flex-1 flex items-center justify-center w-full">
                  <span className="text-5xl font-extrabold text-gray-800">{progressData.percentage}%</span>
                </div>
              </div>
              {/* Expense Summary Card */}
              <div
                className="bg-gradient-to-br from-blue-200 to-cyan-100 text-gray-800 w-full sm:w-[250px] rounded-xl p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 shadow-lg"
                style={{ minHeight: "150px" }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">Expense Summary</h3>
                <div className="bg-gray-200 bg-opacity-20 p-3 rounded-lg w-full">
                  <div className="flex justify-between text-sm text-gray-800">
                    <span>Total Allocated (₹):</span>
                    <span className="font-semibold">{expenseTotals.totalAllocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-800 mt-1">
                    <span>Total Spent (₹):</span>
                    <span className="font-semibold">{expenseTotals.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-800 mt-1">
                    <span>Cash in Hand (₹):</span>
                    <span className="font-semibold">{expenseTotals.cashInHand.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Charts Area (below cards) --- */}
            <div className="flex flex-col gap-6 items-stretch justify-center pt-2">
              {/* First Row: Completion Overview and Progress Comparison */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Completion Overview Chart */}
                <div className="bg-white rounded-lg shadow-lg p-4 flex-1 min-w-[340px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {chartType.value === "po_quantity" ? "Area" : "Value"} Completion Overview
                    </h3>
                    <div className="flex gap-2">
                      <div className="w-[140px]">
                        <Select
                          options={chartTypeOptions}
                          value={chartType}
                          onChange={setChartType}
                          placeholder="Data Type"
                          isClearable={false}
                          className="text-xs"
                          styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
                        />
                      </div>
                      <div className="w-[140px]">
                        <Select
                          options={graphTypeOptions}
                          value={barChartType}
                          onChange={setBarChartType}
                          placeholder="Chart Type"
                          isClearable={false}
                          className="text-xs"
                          styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[320px]">
                    {renderChart(barChartType.value, barChartData, {
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: barChartType.value === "bar" || barChartType.value === "line" ? {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: chartType.value === "po_quantity" ? "Area (sqm)" : "Value (₹)" },
                        },
                        x: {
                          title: { display: true, text: "Stage" },
                        },
                      } : {},
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { size: 12 } },
                        },
                        title: { display: false },
                      },
                    })}
                  </div>
                </div>
                {/* Progress Comparison Chart */}
                <div className="bg-white rounded-lg shadow-lg p-4 flex-1 min-w-[340px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {chartType.value === "po_quantity" ? "Area" : "Value"} Progress Comparison
                    </h3>
                    <div className="w-[140px]">
                      <Select
                        options={graphTypeOptions}
                        value={donutChartType}
                        onChange={setDonutChartType}
                        placeholder="Chart Type"
                        isClearable={false}
                        className="text-xs"
                        styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
                      />
                    </div>
                  </div>
                  <div className="w-full h-[320px]">
                    {renderChart(donutChartType.value, pieChartData, {
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { size: 12 } },
                        },
                        title: { display: false },
                      },
                    })}
                  </div>
                </div>
              </div>

              {/* Second Row: Expense Data and Daily Expense Trend */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Expense Data Chart */}
                {expenseChartData && (
                  <div className="bg-white rounded-lg shadow-lg p-4 flex-1 min-w-[340px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {expenseChartData.title}
                      </h3>
                      <div className="flex gap-2">
                        <div className="w-[140px]">
                          <Select
                            options={expenseDataTypeOptions}
                            value={expenseDataType}
                            onChange={setExpenseDataType}
                            placeholder="Data Type"
                            isClearable={false}
                            className="text-xs"
                            styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
                          />
                        </div>
                        <div className="w-[140px]">
                          <Select
                            options={graphTypeOptions}
                            value={expenseGraphType}
                            onChange={setExpenseGraphType}
                            placeholder="Graph Type"
                            isClearable={false}
                            className="text-xs"
                            styles={{ control: (base) => ({ ...base, minHeight: "32px", fontSize: "0.90rem" }) }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[400px]">
                      {renderChart(expenseGraphType.value, expenseChartData, {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: expenseGraphType.value === "bar" || expenseGraphType.value === "line" ? {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: "Amount (₹)" },
                          },
                          x: {
                            title: { display: true, text: expenseChartData.xAxisTitle },
                          },
                        } : {},
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { font: { size: 12 } },
                          },
                          title: { display: false },
                        },
                      })}
                    </div>
                  </div>
                )}
                {/* Daily Expense Trend Chart */}
                {dailyExpenseTrendChartData && (
                  <div className="bg-white rounded-lg shadow-lg p-4 flex-1 min-w-[340px]">
                    <h3 className="font-semibold text-center mb-2 text-lg text-gray-800">
                      Daily Expense Trend by {expenseDataType.value === "category" ? "Category" : "Work Description"}
                    </h3>
                    <div className="w-full h-[400px]">
                      <Line
                        data={dailyExpenseTrendChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: "Amount (₹)" },
                            },
                            x: {
                              title: { display: true, text: "Date" },
                            },
                          },
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: { font: { size: 12 } },
                            },
                            title: { display: false },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Third Row: Daily Progress Trend */}
              {lineChartData && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-semibold text-center mb-2 text-lg text-gray-800">
                    Daily Progress Trend
                  </h3>
                  <div className="w-full h-[400px]">
                    <Line
                      data={lineChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: "Cumulative Area (sqm)" },
                          },
                          x: {
                            title: { display: true, text: "Date" },
                          },
                        },
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { font: { size: 12 } },
                          },
                          title: { display: false },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          !error && (
            <div className="text-center text-gray-400 py-12 text-base">
              Please select all options to view dashboard.
            </div>
          )
        )
      )}
    </div>
  );
};

export default Dashboard;