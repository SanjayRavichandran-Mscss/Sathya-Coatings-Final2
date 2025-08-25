const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.post("/add-petty-cash", expenseController.addPettyCash);
router.get("/fetch-petty-cash", expenseController.fetchPettyCash);
router.post("/fetch-petty-cash-by-site", expenseController.fetchPettyCashBySite);
router.post("/add-siteincharge-expense", expenseController.addSiteInchargeExpense);
router.get("/categories", expenseController.getExpenseCategories);
router.post("/fetch-details", expenseController.fetchExpenseDetails);
router.post("/fetch-expenses-by-petty-cash", expenseController.fetchExpensesByPettyCash);
router.put("/update-petty-cash/:id", expenseController.updatePettyCash);
router.get("/work-descriptions/:site_id", expenseController.fetchWorkDescriptionsBySite);

module.exports = router;