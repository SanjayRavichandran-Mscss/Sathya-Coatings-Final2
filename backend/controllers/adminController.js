// const db = require("../config/db");



// exports.getCompanies = async (req, res) => {
//   try {
//     const [companies] = await db.query("SELECT company_id, company_name FROM company");
//     res.status(200).json({ success: true, data: companies });
//   } catch (error) {
//     console.error("Error fetching companies:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch companies" });
//   }
// };

// // Fetch projects by company ID
// exports.getProjectsByCompany = async (req, res) => {
//   const { companyId } = req.params;
//   try {
//     const [projects] = await db.query(
//       "SELECT pd_id, project_name FROM project_details WHERE company_id = ?",
//       [companyId]
//     );
//     res.status(200).json({ success: true, data: projects });
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch projects" });
//   }
// };

// // Fetch sites by project ID
// // Updated backend module
// exports.getSitesByProject = async (req, res) => {
//   const { projectId } = req.params;
//   try {
//     const [sites] = await db.query(
//       "SELECT sd.site_id, sd.site_name, sd.po_number, sd.start_date, l.location_name " +
//       "FROM site_details sd " +
//       "LEFT JOIN location l ON sd.location_id = l.location_id " +
//       "WHERE sd.pd_id = ?",
//       [projectId]
//     );
//     res.status(200).json({ success: true, data: sites });
//   } catch (error) {
//     console.error("Error fetching sites:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch sites" });
//   }
// };
// // exports.getPoReckonerTotals = async (req, res) => {
// //   const { siteId } = req.params;
// //   try {
// //     const [totals] = await db.query(
// //       "SELECT SUM(po_quantity) AS total_po_quantity, SUM(rate) AS total_rate FROM po_reckoner WHERE site_id = ?",
// //       [siteId]
// //     );
// //     if (totals.length === 0 || totals[0].total_po_quantity === null) {
// //       return res.status(404).json({ success: false, message: "No data found for the site" });
// //     }
// //     const total_po_quantity = parseFloat(totals[0].total_po_quantity) || 0;
// //     const total_rate = parseFloat(totals[0].total_rate) || 0;
// //     const total_value = total_po_quantity * total_rate;
// //     res.status(200).json({ success: true, data: { total_po_quantity, total_rate, total_value } });
// //   } catch (error) {
// //     console.error("Error fetching po_reckoner totals:", error);
// //     res.status(500).json({ success: false, message: "Failed to fetch po_reckoner totals" });
// //   }
// // };

// // adminController.js


// exports.getPoReckonerTotals = async (req, res) => {
//   const { siteId } = req.params;
//   const { categoryId } = req.query; // Expecting category_id (e.g., CA102)
//   try {
//     // Fetch overall totals
//     const [totals] = await db.query(
//       "SELECT SUM(po_quantity) AS total_po_quantity, SUM(rate) AS total_rate FROM po_reckoner WHERE site_id = ?",
//       [siteId]
//     );
//     if (totals.length === 0 || totals[0].total_po_quantity === null) {
//       return res.status(200).json({ success: true, data: { total_po_quantity: 0, total_rate: 0, total_value: 0, subcategory_totals: [] } });
//     }
//     const total_po_quantity = parseFloat(totals[0].total_po_quantity) || 0;
//     const total_rate = parseFloat(totals[0].total_rate) || 0;
//     const total_value = total_po_quantity * total_rate;

//     // Fetch category, subcategory, and work description details
//     let categoryQuery = `
//       SELECT 
//         ic.category_name,
//         ic.category_id,
//         isc.subcategory_name,
//         pr.po_quantity,
//         pr.rate,
//         pr.value,
//         pr.desc_id,
//         wd.desc_name
//       FROM po_reckoner pr
//       JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
//       JOIN item_category ic ON pr.category_id = ic.category_id
//       LEFT JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
//       WHERE pr.site_id = ?
//     `;
//     const queryParams = [siteId];

//     if (categoryId) {
//       categoryQuery += " AND pr.category_id = ?";
//       queryParams.push(categoryId);
//     }

//     const [records] = await db.query(categoryQuery, queryParams);

//     // Group records by category, work description, and subcategory
//     const categoryMap = new Map();
//     records.forEach(record => {
//       const { category_name, category_id, subcategory_name, po_quantity, rate, value, desc_id, desc_name } = record;
//       if (!categoryMap.has(category_id)) {
//         categoryMap.set(category_id, {
//           category_id,
//           category_name,
//           descriptions: new Map()
//         });
//       }
//       const category = categoryMap.get(category_id);
//       if (!category.descriptions.has(desc_id)) {
//         category.descriptions.set(desc_id, {
//           desc_id,
//           desc_name,
//           subcategories: []
//         });
//       }
//       category.descriptions.get(desc_id).subcategories.push({
//         subcategory_name,
//         po_quantity: parseFloat(po_quantity) || 0,
//         rate: parseFloat(rate) || 0,
//         value: parseFloat(value) || 0
//       });
//     });

//     // Convert Map to array for response
//     const subcategoryTotals = Array.from(categoryMap.values()).map(category => ({
//       category_id: category.category_id,
//       category_name: category.category_name,
//       descriptions: Array.from(category.descriptions.values())
//     }));

//     // Prepare the response
//     const responseData = {
//       total_po_quantity,
//       total_rate,
//       total_value,
//       subcategory_totals: subcategoryTotals
//     };

//     res.status(200).json({ success: true, data: responseData });
//   } catch (error) {
//     console.error("Error fetching po_reckoner totals:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch po_reckoner totals" });
//   }
// };

// exports.getWorkDescriptions = async (req, res) => {
//   const { siteId, categoryId } = req.params; // Expecting category_id (e.g., CA101)
//   try {
//     const [descriptions] = await db.query(
//       `SELECT DISTINCT wd.desc_id, wd.desc_name
//        FROM po_reckoner pr
//        JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
//        WHERE pr.site_id = ? AND pr.category_id = ?`,
//       [siteId, categoryId]
//     );
//     res.status(200).json({ success: true, data: descriptions });
//   } catch (error) {
//     console.error("Error fetching work descriptions:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch work descriptions" });
//   }
// };
// exports.getCompletionEntriesBySite = async (req, res) => {
//   try {
//     const { site_id } = req.params;
//     const { start_date, end_date } = req.query;

//     if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
//       return res.status(400).json({
//         status: "error",
//         message: "start_date must be in YYYY-MM-DD format",
//       });
//     }
//     if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
//       return res.status(400).json({
//         status: "error",
//         message: "end_date must be in YYYY-MM-DD format",
//       });
//     }
//     if (start_date && end_date && start_date > end_date) {
//       return res.status(400).json({
//         status: "error",
//         message: "start_date cannot be later than end_date",
//       });
//     }

//     let query = `
//       SELECT 
//         ic.category_name,
//         isc.subcategory_name,
//         DATE_FORMAT(ceh.entry_date, '%Y-%m-%d') as entry_date,
//         ceh.entry_id,
//         ceh.area_added,
//         ceh.rate,
//         ceh.value_added,
//         ceh.created_by,
//         DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%Y-%m-%d') as created_date,
//         DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%H:%i:%s') as created_time
//       FROM completion_entries_history ceh
//       JOIN po_reckoner pr ON ceh.rec_id = pr.rec_id
//       JOIN item_category ic ON pr.category_id = ic.category_id
//       JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
//       WHERE pr.site_id = ?
//     `;
//     const queryParams = [site_id];

//     if (start_date) {
//       query += ' AND ceh.entry_date >= ?';
//       queryParams.push(start_date);
//     }
//     if (end_date) {
//       query += ' AND ceh.entry_date <= ?';
//       queryParams.push(end_date);
//     }

//     query += ' ORDER BY ic.category_name, isc.subcategory_name, ceh.entry_date, ceh.created_at';

//     const [rows] = await db.query(query, queryParams);

//     const groupedData = [];
//     const categoryMap = new Map();

//     rows.forEach(row => {
//       const { category_name, subcategory_name, entry_date, created_date, created_time, ...entry } = row;

//       let category = categoryMap.get(category_name);
//       if (!category) {
//         category = { category_name, subcategories: [] };
//         categoryMap.set(category_name, category);
//         groupedData.push(category);
//       }

//       let subcategory = category.subcategories.find(sc => sc.subcategory_name === subcategory_name);
//       if (!subcategory) {
//         subcategory = { subcategory_name, entries_by_date: [] };
//         category.subcategories.push(subcategory);
//       }

//       let dateEntry = subcategory.entries_by_date.find(de => de.entry_date === entry_date);
//       if (!dateEntry) {
//         dateEntry = { entry_date, entries: [] };
//         subcategory.entries_by_date.push(dateEntry);
//       }

//       dateEntry.entries.push({
//         entry_id: row.entry_id,
//         area_added: parseFloat(row.area_added),
//         rate: parseFloat(row.rate),
//         value_added: parseFloat(row.value_added),
//         created_by: row.created_by,
//         created_date: row.created_date,
//         created_time: row.created_time
//       });
//     });

//     res.status(200).json({
//       status: "success",
//       data: groupedData
//     });
//   } catch (error) {
//     console.error("Error fetching completion entries:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch completion entries",
//       error: error.message,
//     });
//   }
// };


// exports.getWorkDescriptions = async (req, res) => {
//   const { siteId, categoryId } = req.params;
//   try {
//     const [descriptions] = await db.query(
//       `SELECT DISTINCT wd.desc_id, wd.desc_name
//        FROM po_reckoner pr
//        JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
//        WHERE pr.site_id = ? AND pr.category_id = ?`,
//       [siteId, categoryId]
//     );
//     res.status(200).json({ success: true, data: descriptions });
//   } catch (error) {
//     console.error("Error fetching work descriptions:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch work descriptions" });
//   }
// };










const db = require("../config/db");

// Fetch companies
exports.getCompanies = async (req, res) => {
  try {
    const [companies] = await db.query("SELECT company_id, company_name FROM company");
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ success: false, message: "Failed to fetch companies" });
  }
};

// Fetch projects by company ID
exports.getProjectsByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const [projects] = await db.query(
      "SELECT pd_id, project_name FROM project_details WHERE company_id = ?",
      [companyId]
    );
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

// Fetch sites by project ID
exports.getSitesByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const [sites] = await db.query(
      "SELECT sd.site_id, sd.site_name, sd.po_number, sd.start_date, l.location_name " +
      "FROM site_details sd " +
      "LEFT JOIN location l ON sd.location_id = l.location_id " +
      "WHERE sd.pd_id = ?",
      [projectId]
    );
    res.status(200).json({ success: true, data: sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sites" });
  }
};

// Fetch work descriptions by site and category
exports.getWorkDescriptions = async (req, res) => {
  const { siteId, categoryId } = req.params;
  try {
    const [descriptions] = await db.query(
      `SELECT DISTINCT wd.desc_id, wd.desc_name
       FROM po_reckoner pr
       JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
       WHERE pr.site_id = ? AND pr.category_id = ?`,
      [siteId, categoryId]
    );
    res.status(200).json({ success: true, data: descriptions });
  } catch (error) {
    console.error("Error fetching work descriptions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch work descriptions" });
  }
};

// Fetch completion entries by site
exports.getCompletionEntriesBySite = async (req, res) => {
  const { siteId } = req.params;
  const { start_date, end_date } = req.query;

  try {
    if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
      return res.status(400).json({
        status: "error",
        message: "start_date must be in YYYY-MM-DD format",
      });
    }
    if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
      return res.status(400).json({
        status: "error",
        message: "end_date must be in YYYY-MM-DD format",
      });
    }
    if (start_date && end_date && start_date > end_date) {
      return res.status(400).json({
        status: "error",
        message: "start_date cannot be later than end_date",
      });
    }

    let query = `
      SELECT 
        ic.category_id,
        ic.category_name,
        isc.subcategory_name,
        DATE_FORMAT(ceh.entry_date, '%Y-%m-%d') as entry_date,
        ceh.entry_id,
        ceh.area_added,
        ceh.rate,
        ceh.value_added,
        ceh.created_by,
        pr.desc_id,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%Y-%m-%d') as created_date,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%H:%i:%s') as created_time
      FROM completion_entries_history ceh
      JOIN po_reckoner pr ON ceh.rec_id = pr.rec_id
      JOIN item_category ic ON pr.category_id = ic.category_id
      JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
      WHERE pr.site_id = ?
    `;
    const queryParams = [siteId];

    if (start_date) {
      query += ' AND ceh.entry_date >= ?';
      queryParams.push(start_date);
    }
    if (end_date) {
      query += ' AND ceh.entry_date <= ?';
      queryParams.push(end_date);
    }

    query += ' ORDER BY ic.category_id, isc.subcategory_name, ceh.entry_date, ceh.created_at';

    const [rows] = await db.query(query, queryParams);

    const categoryMap = new Map();
    rows.forEach(row => {
      const { category_id, category_name, subcategory_name, entry_date, desc_id, created_date, created_time, ...entry } = row;

      let category = categoryMap.get(category_id);
      if (!category) {
        category = { category_id, category_name, subcategories: new Map() };
        categoryMap.set(category_id, category);
      }

      let subcategory = category.subcategories.get(subcategory_name);
      if (!subcategory) {
        subcategory = { subcategory_name, entries_by_date: new Map() };
        category.subcategories.set(subcategory_name, subcategory);
      }

      let dateEntry = subcategory.entries_by_date.get(entry_date);
      if (!dateEntry) {
        dateEntry = { entry_date, entries: [] };
        subcategory.entries_by_date.set(entry_date, dateEntry);
      }

      dateEntry.entries.push({
        entry_id: row.entry_id,
        area_added: parseFloat(row.area_added) || 0,
        rate: parseFloat(row.rate) || 0,
        value_added: parseFloat(row.value_added) || 0,
        created_by: row.created_by,
        desc_id,
        created_date,
        created_time
      });
    });

    const groupedData = Array.from(categoryMap.values()).map(category => ({
      category_id: category.category_id,
      category_name: category.category_name,
      subcategories: Array.from(category.subcategories.values()).map(subcategory => ({
        subcategory_name: subcategory.subcategory_name,
        entries_by_date: Array.from(subcategory.entries_by_date.values())
      }))
    }));

    res.status(200).json({
      status: "success",
      data: groupedData
    });
  } catch (error) {
    console.error("Error fetching completion entries:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch completion entries",
      error: error.message,
    });
  }
};

// Fetch PO reckoner totals by site
exports.getPoReckonerTotals = async (req, res) => {
  const { siteId } = req.params;
  try {
    // Fetch overall totals
    const [totals] = await db.query(
      // `SELECT 
      //   SUM(po_quantity) AS total_po_quantity, 
      //   AVG(rate) AS total_rate,
      //   SUM(value) AS total_value
      //  FROM po_reckoner 
      //  WHERE site_id = ?`,
      `SELECT 
        MAX(po_quantity) AS total_po_quantity, 
        AVG(rate) AS total_rate,
        SUM(value) AS total_value
       FROM po_reckoner 
       WHERE site_id = ?`,
      [siteId]
    );

    if (totals.length === 0 || totals[0].total_po_quantity === null) {
      return res.status(200).json({
        success: true,
        data: { total_po_quantity: 0, total_rate: 0, total_value: 0, subcategory_totals: [] }
      });
    }

    const total_po_quantity = parseFloat(totals[0].total_po_quantity) || 0;
    const total_rate = parseFloat(totals[0].total_rate) || 0;
    const total_value = parseFloat(totals[0].total_value) || 0;

    // Fetch category, subcategory, and work description details
    const [records] = await db.query(
      `SELECT 
        ic.category_id,
        ic.category_name,
        isc.subcategory_name,
        pr.po_quantity,
        pr.rate,
        pr.value,
        pr.desc_id,
        wd.desc_name
       FROM po_reckoner pr
       JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
       JOIN item_category ic ON pr.category_id = ic.category_id
       LEFT JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
       WHERE pr.site_id = ?`,
      [siteId]
    );

    // Group records by category, work description, and subcategory
    const categoryMap = new Map();
    records.forEach(record => {
      const { category_id, category_name, subcategory_name, po_quantity, rate, value, desc_id, desc_name } = record;
      if (!categoryMap.has(category_id)) {
        categoryMap.set(category_id, {
          category_id,
          category_name,
          descriptions: new Map()
        });
      }
      const category = categoryMap.get(category_id);
      if (!category.descriptions.has(desc_id)) {
        category.descriptions.set(desc_id, {
          desc_id,
          desc_name,
          subcategories: []
        });
      }
      category.descriptions.get(desc_id).subcategories.push({
        subcategory_name,
        po_quantity: parseFloat(po_quantity) || 0,
        rate: parseFloat(rate) || 0,
        value: parseFloat(value) || 0
      });
    });

    // Convert Map to array for response
    const subcategoryTotals = Array.from(categoryMap.values()).map(category => ({
      category_id: category.category_id,
      category_name: category.category_name,
      descriptions: Array.from(category.descriptions.values())
    }));

    // Prepare the response
    const responseData = {
      total_po_quantity,
      total_rate,
      total_value,
      subcategory_totals: subcategoryTotals
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching po_reckoner totals:", error);
    res.status(500).json({ success: false, message: "Failed to fetch po_reckoner totals" });
  }
};

// Fetch expense details by site
exports.getExpenseDetailsBySite = async (req, res) => {
  const { siteId } = req.params;
  const { descId } = req.query;

  try {
    // Fetch total allocated amount from petty_cash
    let pettyCashQuery = `
      SELECT 
        SUM(amount) AS total_allocated
      FROM petty_cash
      WHERE site_id = ?
    `;
    const pettyCashParams = [siteId];

    if (descId) {
      pettyCashQuery += ' AND desc_id = ?';
      pettyCashParams.push(descId);
    }

    const [pettyCashTotals] = await db.query(pettyCashQuery, pettyCashParams);
    const total_allocated = parseFloat(pettyCashTotals[0].total_allocated) || 0;

    // Fetch total spent amount from siteincharge_exp_entry
    let totalSpentQuery = `
      SELECT 
        SUM(siee.amount) AS total_spent
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      WHERE pc.site_id = ?
    `;
    const totalSpentParams = [siteId];

    if (descId) {
      totalSpentQuery += ' AND pc.desc_id = ?';
      totalSpentParams.push(descId);
    }

    const [totalSpentResult] = await db.query(totalSpentQuery, totalSpentParams);
    const total_spent = parseFloat(totalSpentResult[0].total_spent) || 0;

    // Fetch expenses grouped by work description
    let expensesByDescQuery = `
      SELECT 
        d.desc_name,
        SUM(siee.amount) AS total_expense,
        pc.desc_id
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      JOIN work_descriptions d ON pc.desc_id = d.desc_id
      WHERE pc.site_id = ?
    `;
    const expensesByDescParams = [siteId];

    if (descId) {
      expensesByDescQuery += ' AND pc.desc_id = ?';
      expensesByDescParams.push(descId);
    }

    expensesByDescQuery += `
      GROUP BY d.desc_name, pc.desc_id
      ORDER BY d.desc_name
    `;

    const [expensesByDesc] = await db.query(expensesByDescQuery, expensesByDescParams);

    // Fetch expenses grouped by expense category
    let expensesByCategoryQuery = `
      SELECT 
        ec.exp_category AS expense_category_name,
        SUM(siee.amount) AS total_expense
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      JOIN expense_category ec ON siee.expense_category_id = ec.id
      WHERE pc.site_id = ?
    `;
    const expensesByCategoryParams = [siteId];

    if (descId) {
      expensesByCategoryQuery += ' AND pc.desc_id = ?';
      expensesByCategoryParams.push(descId);
    }

    expensesByCategoryQuery += `
      GROUP BY ec.exp_category
      ORDER BY ec.exp_category
    `;

    const [expensesByCategory] = await db.query(expensesByCategoryQuery, expensesByCategoryParams);

    // Fetch date-wise expenses for line chart
    let expensesByDateQuery = `
      SELECT 
        DATE_FORMAT(siee.amount_created_at, '%Y-%m-%d') AS expense_date,
        SUM(siee.amount) AS total_expense
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      WHERE pc.site_id = ?
    `;
    const expensesByDateParams = [siteId];

    if (descId) {
      expensesByDateQuery += ' AND pc.desc_id = ?';
      expensesByDateParams.push(descId);
    }

    expensesByDateQuery += `
      GROUP BY DATE_FORMAT(siee.amount_created_at, '%Y-%m-%d')
      ORDER BY expense_date
    `;

    const [expensesByDate] = await db.query(expensesByDateQuery, expensesByDateParams);

    res.status(200).json({
      success: true,
      data: {
        total_allocated,
        total_spent,
        expenses_by_work_description: expensesByDesc.map(record => ({
          desc_id: record.desc_id,
          desc_name: record.desc_name || "Unknown Description",
          total_expense: parseFloat(record.total_expense) || 0
        })),
        expenses_by_category: expensesByCategory.map(record => ({
          expense_category_name: record.expense_category_name || "Unknown Category",
          total_expense: parseFloat(record.total_expense) || 0
        })),
        expenses_by_date: expensesByDate.map(record => ({
          expense_date: record.expense_date,
          total_expense: parseFloat(record.total_expense) || 0
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching expense details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch expense details" });
  }
};
module.exports = exports;