// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/adminController"); // Adjust path to your controller

// // Routes for fetching companies, projects, sites, and po_reckoner totals
// router.get("/companies", adminController.getCompanies);
// router.get("/projects/:companyId", adminController.getProjectsByCompany);
// router.get("/sites/:projectId", adminController.getSitesByProject);
// router.get("/po-reckoner-totals/:siteId", adminController.getPoReckonerTotals);
// router.get("/completion-entries-by-site/:site_id", adminController.getCompletionEntriesBySite);
// router.get("/work-descriptions/:siteId/:categoryId", adminController.getWorkDescriptions);
// module.exports = router;







const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to get all companies
router.get('/companies', adminController.getCompanies);

// Route to get projects by company ID
router.get('/projects/:companyId', adminController.getProjectsByCompany);

// Route to get sites by project ID
router.get('/sites/:projectId', adminController.getSitesByProject);

// Route to get work descriptions by site ID and category ID
router.get('/work-descriptions/:siteId/:categoryId', adminController.getWorkDescriptions);

// Route to get completion entries by site ID
router.get('/completion-entries-by-site/:siteId', adminController.getCompletionEntriesBySite);

// Route to get PO reckoner totals by site ID
router.get('/po-reckoner-totals/:siteId', adminController.getPoReckonerTotals);

// Route to get expense details by site ID
router.get('/expense-details/:siteId', adminController.getExpenseDetailsBySite);

module.exports = router;