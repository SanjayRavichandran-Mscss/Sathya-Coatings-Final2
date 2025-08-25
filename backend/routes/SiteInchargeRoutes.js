const express = require("express");
const router = express.Router();
const SiteInchargeController = require("../controllers/SiteInchargeController");

router.get("/completion-entries", SiteInchargeController.getCompletionEntries   );
router.post("/completion-status", SiteInchargeController.saveCompletionStatus);
router.get("/completion-entries-by-site/:site_id", SiteInchargeController.getCompletionEntriesBySiteID);

module.exports = router;