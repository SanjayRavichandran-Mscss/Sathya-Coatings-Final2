// import React, { useEffect, useState } from 'react';
// import html2pdf from 'html2pdf.js';

// const DispatchReport = ({ commonDispatchDetails = {}, dispatchedMaterials = [] }) => {
//   // State to store API data
//   const [inchargeData, setInchargeData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Use dynamic dispatch details with static GSTIN
//   const dispatchDetails = {
//     recipient_name: commonDispatchDetails.recipient_name || 'N/A',
//     recipient_phone: commonDispatchDetails.recipient_phone || 'N/A',
//     recipient_department: commonDispatchDetails.recipient_department || 'N/A',
//     recipient_company: commonDispatchDetails.recipient_company || 'N/A',
//     recipient_address: commonDispatchDetails.destination || 'N/A',
//     recipient_gstin: '34AAACC3000F1ZL', // Static GSTIN
//     dc_no: commonDispatchDetails.dc_no || 'N/A',
//     dispatch_date: commonDispatchDetails.dispatch_date || 'N/A',
//     order_no: commonDispatchDetails.order_no || 'N/A',
//     order_date: commonDispatchDetails.order_date || 'N/A',
//     vendor_code: commonDispatchDetails.vendor_code || 'N/A',
//     approximate_value: commonDispatchDetails.approximate_value || 'N/A'
//   };

//   // Fetch incharge data from API
//   useEffect(() => {
//     const fetchInchargeData = async () => {
//       try {
//         const response = await fetch('http://103.118.158.33/api/material/assigned-incharges');
//         const result = await response.json();
//         if (result.status === 'success') {
//           // Convert dispatch_date to a comparable format (assuming dispatch_date is in DD.MM.YYYY format)
//           const dcDateParts = dispatchDetails.dispatch_date.split('.');
//           const dcDate = new Date(`${dcDateParts[2]}-${dcDateParts[1]}-${dcDateParts[0]}`);
          
//           // Find matching incharge data where dcDate is between from_date and to_date
//           const matchingIncharge = result.data.find(item => {
//             const fromDate = new Date(item.from_date);
//             const toDate = new Date(item.to_date);
//             return dcDate >= fromDate && dcDate <= toDate;
//           });

//           setInchargeData(matchingIncharge || null);
//         } else {
//           setError('Failed to fetch incharge data');
//         }
//       } catch (err) {
//         setError('Error fetching data from API');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (dispatchDetails.dispatch_date !== 'N/A') {
//       fetchInchargeData();
//     } else {
//       setLoading(false);
//       setInchargeData(null);
//     }
//   }, [dispatchDetails.dispatch_date]);

//   // Use dynamic materials only
//   const materials = dispatchedMaterials;

//   const handleDownloadPDF = () => {
//     console.log('Download button clicked');
//     const element = document.getElementById('report-content');
//     if (!element) {
//       console.error('Element with ID "report-content" not found');
//       return;
//     }
//     console.log('Element found, generating PDF...');
//     const opt = {
//       margin: 0.5,
//       filename: `dispatch_report_${dispatchDetails.dc_no}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         onclone: (clonedDoc) => {
//           const images = clonedDoc.querySelectorAll('img');
//           const promises = Array.from(images).map(img => {
//             if (!img.complete) {
//               return new Promise((resolve) => {
//                 img.onload = resolve;
//                 img.onerror = resolve;
//               });
//             }
//             return Promise.resolve();
//           });
//           return Promise.all(promises);
//         }
//       },
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };
//     html2pdf().set(opt).from(element).save().then(() => {
//       console.log('PDF generation complete');
//     }).catch(err => {
//       console.error('PDF generation failed:', err);
//     });
//   };

//   // Determine what to display in the address section
//   const renderAddressSection = () => {
//     if (loading) {
//       return <div>Loading incharge data...</div>;
//     }
//     if (error) {
//       return <div>{error}</div>;
//     }
//     if (!inchargeData) {
//       return <div>No site incharges assigned for this date</div>;
//     }
//     return (
//       <div>
//         <span className="address-label">To </span>
//         <span className="recipient-name">{inchargeData.full_name}</span> 
//         <span className="recipient-phone">(PH.No.{inchargeData.mobile})</span><br />
//         {inchargeData.department}<br />
//          {/* {inchargeData.site_name}<br /> */}
//         {inchargeData.current_address}<br />
//         GSTIN: {dispatchDetails.recipient_gstin}
//       </div>
//     );
//   };

//   // Helper function to format component ratios
//   const formatComponentRatios = (comp_ratio_a, comp_ratio_b, comp_ratio_c) => {
//     const ratios = [comp_ratio_a, comp_ratio_b];
//     if (comp_ratio_c !== null) {
//       ratios.push(comp_ratio_c);
//     }
//     return ` (${ratios.join(':')})`;
//   };

//   return (
//     <div className="dispatch-report-container">
//       <div className="download-btn-container">
//         <button
//           onClick={handleDownloadPDF}
//           className="download-btn no-print"
//         >
//           Download as PDF
//         </button>
//       </div>
//       <div id="report-content" className="report-content">
//         <table className="main-table">
//           <tbody>
//             <tr>
//               <td colSpan={6} className="header-logo">
//                 <img src="/logo_abstract.png" alt="Logo" className="logo-img" />
//                 <span className="company-name">
//                   SATHYA HITEC SOLUTIONS LLP
//                 </span>
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={6} className="company-address">
//                 222, Chinnammal Nagar, Edayarpalayam, Vadavalli Road, Coimbatore - 641041<br />
//                 Ph.No. 0422 2401231, 9600555870 E-mail: sathyaec@gmail.com<br />
//                 FACTORY : BHAGAVATHIPALAYAM, KINATHUKADAVU, COIMBATORE 642 109<br />
//                 GSTIN: 33ACJFS1582J1ZW
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={6} className="document-title">
//                 DELIVERY CHALLAN
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={3} className="address-section">
//                 {renderAddressSection()}
//               </td>
//               <td colSpan={3} className="details-section">
//                 <table className="details-table">
//                   <tbody>
//                     <tr>
//                       <td className="details-label">Delivery challan</td>
//                       <td className="details-value"></td>
//                     </tr>
//                     <tr>
//                       <td className="details-label-bold">DC NO.</td>
//                       <td className="details-value-bold">{dispatchDetails.dc_no}</td>
//                     </tr>
//                     <tr>
//                       <td className="details-label-bold">DC Date</td>
//                       <td className="details-value-bold">{dispatchDetails.dispatch_date}</td>
//                     </tr>
//                     <tr>
//                       <td className="details-label-bold">Your Order No.</td>
//                       <td className="details-value">{dispatchDetails.order_no}</td>
//                     </tr>
//                     <tr>
//                       <td className="details-label-bold">Your order date</td>
//                       {/* <td className="details-value">{dispatchDetails.order_date}</td> */}
//                       <td className="details-value">16.05.2025</td>
//                     </tr>
//                     <tr>
//                       <td className="details-label-bold">Vendor Code</td>
//                       <td className="details-value">{dispatchDetails.vendor_code}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </td>
//             </tr>
//             <tr>
//               <td className="table-header" width="5%">Sl.No</td>
//               <td className="table-header" width="32%">Particulars</td>
//               <td className="table-header" width="9%">Qty</td>
//               <td className="table-header" width="8%">UOM</td>
//               <td className="table-header" width="30%">Remarks</td>
//             </tr>
//             <tr>
//               <td className="empty-cell"></td>
//               <td className="mtf-work-label" colSpan={5}>MTF Work :</td>
//             </tr>
//             {materials.length > 0 ? materials.map((material, index) => (
//               <tr key={material.id || index}>
//                 <td className="cell-center">{index + 1}</td>
//                 <td className="cell-left">
//                   {material.item_name || 'N/A'}{formatComponentRatios(material.comp_ratio_a, material.comp_ratio_b, material.comp_ratio_c)}
//                   {material.comp_a_qty !== null && <><br /><span className="component">Comp.A</span></>}
//                   {material.comp_b_qty !== null && <><br /><span className="component">Comp.B</span></>}
//                   {material.comp_c_qty !== null && <><br /><span className="component">Comp.C</span></>}
//                 </td>
//                 <td className="cell-left-bold">
//                   <span className="highlighted-qty">{material.total_qty || material.dispatch_qty || material.assigned_quantity || '0'}</span>
//                   {material.comp_a_qty !== null && <><br /><span className="component-qty">{material.comp_a_qty}</span></>}
//                   {material.comp_b_qty !== null && <><br /><span className="component-qty">{material.comp_b_qty}</span></>}
//                   {material.comp_c_qty !== null && <><br /><span className="component-qty">{material.comp_c_qty}</span></>}
//                 </td>
//                 <td className="cell-left">
//                   {material.uom_name || 'N/A'}
//                   {material.comp_a_qty !== null && <><br /><span className="component-uom">{material.uom_name || 'N/A'}</span></>}
//                   {material.comp_b_qty !== null && <><br /><span className="component-uom">{material.uom_name || 'N/A'}</span></>}
//                   {material.comp_c_qty !== null && <><br /><span className="component-uom">{material.uom_name || 'N/A'}</span></>}
//                 </td>
//                 <td className="cell-left">
//                   {material.comp_a_remarks && <>{material.comp_a_remarks}<br /></>}
//                   {material.comp_b_remarks && <>{material.comp_b_remarks}<br /></>}
//                   {material.comp_c_remarks && <>{material.comp_c_remarks}<br /></>}
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan={5} className="cell-left">No materials available</td>
//               </tr>
//             )}
//             <tr>
//               {/* <td colSpan={6} className="approximate-value">
//                 Approximate Value Rs.{dispatchDetails.approximate_value}/-
//               </td> */}
//             </tr>
//             <tr>
//               <td colSpan={6} className="returnable-note">
//                 The above materials sent for our works contract purpose on returnable basis
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={3} className="footer-left">
//                 <div className="gst-label">GSTIN NO.</div>
//                 <div className="gst-number">33ACJFS1582J1ZW</div>
//                 <div>JK Groups</div>
//                 <div className="jk-gst">GSTIN NO : 33BPIPJ0960C1ZC</div>
//               </td>
//               <td colSpan={3} className="footer-right">
//                 <div className="signature-label">for Sathya Hitec Solutions LLP</div>
//                 <div className="signature-img-container">
//                   {/* <img src="./signature.png" alt="Authorised Signatory" className="signature-img" /> */}
//                 </div>
//                 <div className="signature-text">Authorised Signatory</div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <style>{`
//         .dispatch-report-container {
//           background-color: #f1f5f9;
//           min-height: 100vh;
//           padding: 24px;
//         }
//         .download-btn-container {
//           text-align: right;
//           margin-bottom: 24px;
//         }
//         .download-btn {
//           background-color: #2563eb;
//           color: white;
//           padding: 8px 24px;
//           border-radius: 4px;
//           border: none;
//           cursor: pointer;
//           font-size: 14px;
//         }
//         .download-btn:hover {
//           background-color: #1d4ed8;
//         }
//         .report-content {
//           max-width: 56rem;
//           margin-left: auto;
//           margin-right: auto;
//           background-color: white;
//           padding: 16px;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//           border: 1px solid #d1d5db;
//         }
//         .main-table {
//           width: 100%;
//           border: 1px solid black;
//           font-size: 14px;
//           border-collapse: collapse;
//         }
//         .header-logo {
//           text-align: center;
//           padding-bottom: 8px;
//           border: none;
//         }
//         .logo-img {
//           height: 50px;
//           display: inline-block;
//           vertical-align: middle;
//           margin-right: 12px;
//         }
//         .company-name {
//           font-size: 24px;
//           font-weight: 800;
//           letter-spacing: 0.025em;
//           color: #0369a1;
//           vertical-align: middle;
//         }
//         .company-address {
//           text-align: center;
//           font-size: 12px;
//           padding-top: 4px;
//           padding-bottom: 4px;
//           border: none;
//           color: #0369a1;
//         }
//         .document-title {
//           text-align: center;
//           font-size: 16px;
//           font-weight: bold;
//           color: #1f2937;
//           border: 1px solid black;
//           padding-top: 4px;
//           padding-bottom: 4px;
//           background-color: #e0f2fe;
//         }
//         .address-section {
//           vertical-align: top;
//           border: 1px solid black;
//           padding: 8px;
//           width: 60%;
//         }
//         .address-label {
//           font-weight: 600;
//         }
//         .recipient-name {
//           color: black;
//           font-weight: bold;
//           margin-left: 8px;
//         }
//         .recipient-phone {
//           font-weight: bold;
//           font-size: 12px;
//           color: #ef4444;
//           padding-left: 50px;
//         }
//         .details-section {
//           vertical-align: top;
//           border: 1px solid black;
//           padding: 0;
//           width: 40%;
//         }
//         .details-table {
//           width: 100%;
//           font-size: 12px;
//           border: 1px solid black;
//           border-collapse: collapse;
//         }
//         .details-label {
//           font-weight: 600;
//           border: 1px solid black;
//           padding-left: 8px;
//           padding-right: 8px;
//           padding-top: 4px;
//           padding-bottom: 4px;
//         }
//         .details-label-bold {
//           font-weight: bold;
//           border: 1px solid black;
//           padding-left: 8px;
//           padding-right: 8px;
//           padding-top: 4px;
//           padding-bottom: 4px;
//         }
//         .details-value {
//           border: 1px solid black;
//           padding-left: 8px;
//           padding-right: 8px;
//           padding-top: 4px;
//           padding-bottom: 4px;
//         }
//         .details-value-bold {
//           font-weight: bold;
//           border: 1px solid black;
//           padding-left: 8px;
//           padding-right: 8px;
//           padding-top: 4px;
//           padding-bottom: 4px;
//         }
//         .table-header {
//           border: 1px solid black;
//           text-align: center;
//           font-weight: bold;
//           padding: 8px;
//           background-color: #7dd3fc;
//         }
//         .empty-cell {
//           padding: 8px;
//         }
//         .mtf-work-label {
//           border: 1px solid black;
//           font-size: 14px;
//           font-weight: 600;
//           color: #dc2626;
//         }
//         .cell-center {
//           border-left: 1px solid black;
//           border-right: 1px solid black;
//           text-align: center;
//           padding: 8px;
//         }
//         .cell-left {
//           border-left: 1px solid black;
//           border-right: 1px solid black;
//           text-align: left;
//           padding: 8px;
//           vertical-align: top;
//         }
//         .cell-left-bold {
//           border-left: 1px solid black;
//           border-right: 1px solid black;
//           text-align: left;
//           padding: 8px;
//           font-weight: bold;
//           vertical-align: top;
//         }
//         .component {
//           padding-left: 10px;
//         }
//         .component-qty {
//           padding-left: 10px;
//           display: inline-block;
//         }
//         .component-uom {
          
//           display: inline-block;
//         }
//         .highlighted-qty {
//           background-color: #f8e71c;
//           display: inline-block;
//           min-width: 40px;
//           text-align: center;
//         }
//         .approximate-value {
//           border: 1px solid black;
//           text-align: left;
//           font-weight: 600;
//           padding-left: 8px;
//         }
//         .returnable-note {
//           border: 1px solid black;
//           text-align: left;
//           padding-left: 8px;
//           color: #dc2626;
//           font-weight: bold;
//           text-decoration: underline;
//         }
//         .footer-left {
//           vertical-align: top;
//           width: 60%;
//           padding: 8px;
//         }
//         .gst-label {
//           background-color: #bae6fd;
//           padding-left: 8px;
//           padding-right: 8px;
//           padding-top: 4px;
//           padding-bottom: 4px;
//           border-radius: 4px;
//           font-weight: bold;
//           display: inline-block;
//           margin-bottom: 4px;
//         }
//         .gst-number {
//           font-weight: 800;
//           font-size: 18px;
//           letter-spacing: 0.05em;
//           color: #1e40af;
//           margin-bottom: 4px;
//         }
//         .jk-gst {
//           font-size: 12px;
//         }
//         .footer-right {
//           vertical-align: top;
//           width: 40%;
//           padding: 8px;
//           text-align: right;
//         }
//         .signature-label {
//           margin-bottom: 24px;
//           margin-top: 8px;
//           padding-right: 8px;
//         }
//         .signature-text {
//           font-size: 12px;
//           padding-right: 32px;
//         }
//         .signature-img-container {
//           margin-bottom: 4px;
//         }
//         .signature-img {
//           height: 48px;
//           display: inline-block;
//         }
//         @media print {
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DispatchReport;




























import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';

const DispatchReport = ({ commonDispatchDetails = {}, dispatchedMaterials = [] }) => {
  // State to store API data
  const [inchargeData, setInchargeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use dynamic dispatch details
  const dispatchDetails = {
    recipient_name: commonDispatchDetails.recipient_name || 'N/A',
    recipient_phone: commonDispatchDetails.recipient_phone || 'N/A',
    recipient_department: commonDispatchDetails.recipient_department || 'N/A',
    recipient_company: commonDispatchDetails.recipient_company || 'N/A',
    recipient_address: commonDispatchDetails.destination || 'N/A',
    recipient_gstin: commonDispatchDetails.gst_number || 'N/A', // Dynamic GSTIN
    dc_no: commonDispatchDetails.dc_no || 'N/A',
    dispatch_date: commonDispatchDetails.dispatch_date || 'N/A',
    order_no: commonDispatchDetails.order_no || 'N/A',
    order_date: commonDispatchDetails.order_date
      ? new Date(commonDispatchDetails.order_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).split('/').join('.')
      : 'N/A', // Dynamic order_date formatted as DD.MM.YYYY
    vendor_code: commonDispatchDetails.vendor_code || 'N/A',
    approximate_value: commonDispatchDetails.approximate_value || 'N/A'
  };

  // Fetch incharge data from API
  useEffect(() => {
    const fetchInchargeData = async () => {
      try {
        const response = await fetch('http://103.118.158.33/api/material/assigned-incharges');
        const result = await response.json();
        if (result.status === 'success') {
          // Convert dispatch_date to a comparable format (assuming dispatch_date is in DD.MM.YYYY format)
          const dcDateParts = dispatchDetails.dispatch_date.split('.');
          const dcDate = new Date(`${dcDateParts[2]}-${dcDateParts[1]}-${dcDateParts[0]}`);
          
          // Find matching incharge data where dcDate is between from_date and to_date
          const matchingIncharge = result.data.find(item => {
            const fromDate = new Date(item.from_date);
            const toDate = new Date(item.to_date);
            return dcDate >= fromDate && dcDate <= toDate;
          });

          setInchargeData(matchingIncharge || null);
        } else {
          setError('Failed to fetch incharge data');
        }
      } catch (err) {
        console.log(err);
        
        setError('Error fetching data from API');
      } finally {
        setLoading(false);
      }
    };

    if (dispatchDetails.dispatch_date !== 'N/A') {
      fetchInchargeData();
    } else {
      setLoading(false);
      setInchargeData(null);
    }
  }, [dispatchDetails.dispatch_date]);

  // Use dynamic materials only
  const materials = dispatchedMaterials;

  const handleDownloadPDF = () => {
    console.log('Download button clicked');
    const element = document.getElementById('report-content');
    if (!element) {
      console.error('Element with ID "report-content" not found');
      return;
    }
    console.log('Element found, generating PDF...');
    const opt = {
      margin: 0.5,
      filename: `dispatch_report_${dispatchDetails.dc_no}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll('img');
          const promises = Array.from(images).map(img => {
            if (!img.complete) {
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            }
            return Promise.resolve();
          });
          return Promise.all(promises);
        }
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => {
      console.log('PDF generation complete');
    }).catch(err => {
      console.error('PDF generation failed:', err);
    });
  };

  // Determine what to display in the address section
  const renderAddressSection = () => {
    if (loading) {
      return <div>Loading incharge data...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    if (!inchargeData) {
      return <div>No site incharges assigned for this date</div>;
    }
    return (
      <div>
        <span className="address-label">To </span>
        <span className="recipient-name">{inchargeData.full_name}</span> 
        <span className="recipient-phone">(PH.No.{inchargeData.mobile})</span><br />
        {inchargeData.department}<br />
        {inchargeData.current_address}<br />
        GSTIN: {dispatchDetails.recipient_gstin}
      </div>
    );
  };

  // Helper function to format component ratios
  const formatComponentRatios = (comp_ratio_a, comp_ratio_b, comp_ratio_c) => {
    const ratios = [comp_ratio_a, comp_ratio_b];
    if (comp_ratio_c !== null) {
      ratios.push(comp_ratio_c);
    }
    return ` (${ratios.join(':')})`;
  };

  return (
    <div className="dispatch-report-container">
      <div className="download-btn-container">
        <button
          onClick={handleDownloadPDF}
          className="download-btn no-print"
        >
          Download as PDF
        </button>
      </div>
      <div id="report-content" className="report-content">
        <table className="main-table">
          <tbody>
            <tr>
              <td colSpan={6} className="header-logo">
                <img src="/logo_abstract.png" alt="Logo" className="logo-img" />
                <span className="company-name">
                  SATHYA HITEC SOLUTIONS LLP
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="company-address">
                222, Chinnammal Nagar, Edayarpalayam, Vadavalli Road, Coimbatore - 641041<br />
                Ph.No. 0422 2401231, 9600555870 E-mail: sathyaec@gmail.com<br />
                FACTORY : BHAGAVATHIPALAYAM, KINATHUKADAVU, COIMBATORE 642 109<br />
                GSTIN: 33ACJFS1582J1ZW
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="document-title">
                DELIVERY CHALLAN
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="address-section">
                {renderAddressSection()}
              </td>
              <td colSpan={3} className="details-section">
                <table className="details-table">
                  <tbody>
                    <tr>
                      <td className="details-label">Delivery challan</td>
                      <td className="details-value"></td>
                    </tr>
                    <tr>
                      <td className="details-label-bold">DC NO.</td>
                      <td className="details-value-bold">{dispatchDetails.dc_no}</td>
                    </tr>
                    <tr>
                      <td className="details-label-bold">DC Date</td>
                      <td className="details-value-bold">{dispatchDetails.dispatch_date}</td>
                    </tr>
                    <tr>
                      <td className="details-label-bold">Your Order No.</td>
                      <td className="details-value">{dispatchDetails.order_no}</td>
                    </tr>
                    <tr>
                      <td className="details-label-bold">Your order date</td>
                      <td className="details-value">{dispatchDetails.order_date}</td>
                    </tr>
                    <tr>
                      <td className="details-label-bold">Vendor Code</td>
                      <td className="details-value">{dispatchDetails.vendor_code}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="table-header" width="5%">Sl.No</td>
              <td className="table-header" width="32%">Particulars</td>
              <td className="table-header" width="9%">Qty</td>
              <td className="table-header" width="8%">UOM</td>
              <td className="table-header" width="30%">Remarks</td>
            </tr>
            <tr>
              <td className="empty-cell"></td>
              <td className="mtf-work-label" colSpan={5}>MTF Work :</td>
            </tr>
            {materials.length > 0 ? materials.map((material, index) => (
              <tr key={material.id || index}>
                <td className="cell-center">{index + 1}</td>
                <td className="cell-left">
                  {material.item_name || 'N/A'}{formatComponentRatios(material.comp_ratio_a, material.comp_ratio_b, material.comp_ratio_c)}
                  {material.comp_a_qty !== null && <><br /><span className="component">Comp.A</span></>}
                  {material.comp_b_qty !== null && <><br /><span className="component">Comp.B</span></>}
                  {material.comp_c_qty !== null && <><br /><span className="component">Comp.C</span></>}
                </td>
                <td className="cell-left-bold">
                  <span className="highlighted-qty">{material.total_qty || material.dispatch_qty || material.assigned_quantity || '0'}</span>
                  {material.comp_a_qty !== null && <><br /><span className="component-qty">{material.comp_a_qty}</span></>}
                  {material.comp_b_qty !== null && <><br /><span className="component-qty">{material.comp_b_qty}</span></>}
                  {material.comp_c_qty !== null && <><br /><span className="component-qty">{material.comp_c_qty}</span></>}
                </td>
                <td className="cell-left">
                  {material.uom_name || 'N/A'}
                  {material.comp_a_qty !== null && <><br /><span className="component-uom">{material.uom_name || 'N/A'}</span></>}
                  {material.comp_b_qty !== null && <><br /><span className="component-uom">{material.uom_name || 'N/A'}</span></>}
                  {material.comp_c_qty !== null && <><br /><span className="component-uom">{material.uom_name || 'N/A'}</span></>}
                </td>
                <td className="cell-left">
                  {material.comp_a_remarks && <>{material.comp_a_remarks}<br /></>}
                  {material.comp_b_remarks && <>{material.comp_b_remarks}<br /></>}
                  {material.comp_c_remarks && <>{material.comp_c_remarks}<br /></>}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="cell-left">No materials available</td>
              </tr>
            )}
            <tr>
              {/* <td colSpan={6} className="approximate-value">
                Approximate Value Rs.{dispatchDetails.approximate_value}/-
              </td> */}
            </tr>
            <tr>
              <td colSpan={6} className="returnable-note">
                The above materials sent for our works contract purpose on returnable basis
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="footer-left">
                <div className="gst-label">GSTIN NO.</div>
                <div className="gst-number">33ACJFS1582J1ZW</div>
                {/* <div>JK Groups</div>
                <div className="jk-gst">GSTIN NO : 33BPIPJ0960C1ZC</div> */}
              </td>
              <td colSpan={3} className="footer-right">
                <div className="signature-label">for Sathya Hitec Solutions LLP</div>
                <div className="signature-img-container">
                  {/* <img src="./signature.png" alt="Authorised Signatory" className="signature-img" /> */}
                </div>
                <div className="signature-text">Authorised Signatory</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <style>{`
        .dispatch-report-container {
          background-color: #f1f5f9;
          min-height: 100vh;
          padding: 24px;
        }
        .download-btn-container {
          text-align: right;
          margin-bottom: 24px;
        }
        .download-btn {
          background-color: #2563eb;
          color: white;
          padding: 8px 24px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        .download-btn:hover {
          background-color: #1d4ed8;
        }
        .report-content {
          max-width: 56rem;
          margin-left: auto;
          margin-right: auto;
          background-color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #d1d5db;
        }
        .main-table {
          width: 100%;
          border: 1px solid black;
          font-size: 14px;
          border-collapse: collapse;
        }
        .header-logo {
          text-align: center;
          padding-bottom: 8px;
          border: none;
        }
        .logo-img {
          height: 50px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 12px;
        }
        .company-name {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.025em;
          color: #0369a1;
          vertical-align: middle;
        }
        .company-address {
          text-align: center;
          font-size: 12px;
          padding-top: 4px;
          padding-bottom: 4px;
          border: none;
          color: #0369a1;
        }
        .document-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
          border: 1px solid black;
          padding-top: 4px;
          padding-bottom: 4px;
          background-color: #e0f2fe;
        }
        .address-section {
          vertical-align: top;
          border: 1px solid black;
          padding: 8px;
          width: 60%;
        }
        .address-label {
          font-weight: 600;
        }
        .recipient-name {
          color: black;
          font-weight: bold;
          margin-left: 8px;
        }
        .recipient-phone {
          font-weight: bold;
          font-size: 12px;
          color: #ef4444;
          padding-left: 50px;
        }
        .details-section {
          vertical-align: top;
          border: 1px solid black;
          padding: 0;
          width: 40%;
        }
        .details-table {
          width: 100%;
          font-size: 12px;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .details-label {
          font-weight: 600;
          border: 1px solid black;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .details-label-bold {
          font-weight: bold;
          border: 1px solid black;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .details-value {
          border: 1px solid black;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .details-value-bold {
          font-weight: bold;
          border: 1px solid black;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .table-header {
          border: 1px solid black;
          text-align: center;
          font-weight: bold;
          padding: 8px;
          background-color: #7dd3fc;
        }
        .empty-cell {
          padding: 8px;
        }
        .mtf-work-label {
          border: 1px solid black;
          font-size: 14px;
          font-weight: 600;
          color: #dc2626;
        }
        .cell-center {
          border-left: 1px solid black;
          border-right: 1px solid black;
          text-align: center;
          padding: 8px;
        }
        .cell-left {
          border-left: 1px solid black;
          border-right: 1px solid black;
          text-align: left;
          padding: 8px;
          vertical-align: top;
        }
        .cell-left-bold {
          border-left: 1px solid black;
          border-right: 1px solid black;
          text-align: left;
          padding: 8px;
          font-weight: bold;
          vertical-align: top;
        }
        .component {
          padding-left: 10px;
        }
        .component-qty {
          padding-left: 10px;
          display: inline-block;
        }
        .component-uom {
          display: inline-block;
        }
        .highlighted-qty {
          background-color: #f8e71c;
          display: inline-block;
          min-width: 40px;
          text-align: center;
        }
        .approximate-value {
          border: 1px solid black;
          text-align: left;
          font-weight: 600;
          padding-left: 8px;
        }
        .returnable-note {
          border: 1px solid black;
          text-align: left;
          padding-left: 8px;
          color: #dc2626;
          font-weight: bold;
          text-decoration: underline;
        }
        .footer-left {
          vertical-align: top;
          width: 60%;
          padding: 8px;
        }
        .gst-label {
          background-color: #bae6fd;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 4px;
        }
        .gst-number {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.05em;
          color: #1e40af;
          margin-bottom: 4px;
        }
        .jk-gst {
          font-size: 12px;
        }
        .footer-right {
          vertical-align: top;
          width: 40%;
          padding: 8px;
          text-align: right;
        }
        .signature-label {
          margin-bottom: 24px;
          margin-top: 8px;
          padding-right: 8px;
        }
        .signature-text {
          font-size: 12px;
          padding-right: 32px;
        }
        .signature-img-container {
          margin-bottom: 4px;
        }
        .signature-img {
          height: 48px;
          display: inline-block;
        }
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DispatchReport;