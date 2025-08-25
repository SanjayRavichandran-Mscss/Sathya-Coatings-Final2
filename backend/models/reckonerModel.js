// const db = require("../config/db");

// const generateNextId = async (prefix, table, idColumn) => {
//   try {
//     const [result] = await db.query(
//       `SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`
//     );

//     if (result.length === 0) {
//       return `${prefix}101`; // First item
//     }

//     const lastId = result[0][idColumn];
//     const num = parseInt(lastId.replace(prefix, "")) + 1;
//     return `${prefix}${num}`;
//   } catch (error) {
//     console.error(`Error generating ${prefix} ID:`, error);
//     throw error;
//   }
// };

// // ==================== Category Operations ====================

// exports.fetchAllCategories = async () => {
//   try {
//     const [rows] = await db.query("SELECT * FROM item_category");
//     return Array.isArray(rows) ? rows : [];
//   } catch (error) {
//     console.error("Error in fetchAllCategories:", error);
//     throw error;
//   }
// };

// exports.fetchCategoryById = async (id) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM item_category WHERE category_id = ?",
//       [id]
//     );
//     return rows[0] || null;
//   } catch (error) {
//     console.error("Error in fetchCategoryById:", error);
//     throw error;
//   }
// };

// exports.createCategory = async (category_name) => {
//   try {
//     if (!category_name) throw new Error("Category name is required");
//     const newId = await generateNextId("CA", "item_category", "category_id");

//     await db.query(
//       "INSERT INTO item_category (category_id, category_name) VALUES (?, ?)",
//       [newId, category_name]
//     );

//     return { category_id: newId, category_name };
//   } catch (error) {
//     console.error("Error in createCategory:", error);
//     throw error;
//   }
// };

// exports.updateCategory = async (id, category_name) => {
//   try {
//     const [result] = await db.query(
//       "UPDATE item_category SET category_name = ? WHERE category_id = ?",
//       [category_name, id]
//     );
//     if (result.affectedRows === 0) return null;
//     return { category_id: id, category_name };
//   } catch (error) {
//     console.error("Error in updateCategory:", error);
//     throw error;
//   }
// };

// exports.deleteCategory = async (id) => {
//   try {
//     const [result] = await db.query(
//       "DELETE FROM item_category WHERE category_id = ?",
//       [id]
//     );
//     return result.affectedRows > 0;
//   } catch (error) {
//     console.error("Error in deleteCategory:", error);
//     throw error;
//   }
// };

// // ==================== Subcategory Operations ====================

// exports.fetchAllSubcategories = async () => {
//   try {
//     const [rows] = await db.query("SELECT * FROM item_subcategory");
//     return Array.isArray(rows) ? rows : [];
//   } catch (error) {
//     console.error("Error in fetchAllSubcategories:", error);
//     throw error;
//   }
// };
// exports.fetchSubcategoryById = async (id) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM item_subcategory WHERE subcategory_id = ?",
//       [id]
//     );
//     return rows[0] || null;
//   } catch (error) {
//     console.error("Error in fetchSubcategoryById:", error);
//     throw error;
//   }
// };

// exports.createSubcategory = async (subcategory_name) => {
//   try {
//     if (!subcategory_name) throw new Error("Subcategory name is required");
//     const newId = await generateNextId(
//       "SC",
//       "item_subcategory",
//       "subcategory_id"
//     );

//     await db.query(
//       "INSERT INTO item_subcategory (subcategory_id, subcategory_name) VALUES (?, ?)",
//       [newId, subcategory_name]
//     );

//     return { subcategory_id: newId, subcategory_name };
//   } catch (error) {
//     console.error("Error in createSubcategory:", error);
//     throw error;
//   }
// };

// exports.updateSubcategory = async (id, subcategory_name) => {
//   try {
//     const [result] = await db.query(
//       "UPDATE item_subcategory SET subcategory_name = ? WHERE subcategory_id = ?",
//       [subcategory_name, id]
//     );
//     if (result.affectedRows === 0) return null;
//     return { subcategory_id: id, subcategory_name };
//   } catch (error) {
//     console.error("Error in updateSubcategory:", error);
//     throw error;
//   }
// };

// exports.deleteSubcategory = async (id) => {
//   try {
//     const [result] = await db.query(
//       "DELETE FROM item_subcategory WHERE subcategory_id = ?",
//       [id]
//     );
//     return result.affectedRows > 0;
//   } catch (error) {
//     console.error("Error in deleteSubcategory:", error);
//     throw error;
//   }
// };

// // ==================== Work Items Operations ====================
// exports.fetchAllWorkItems = async () => {
//   try {
//     const [rows] = await db.query("SELECT * FROM work_descriptions");
//     return Array.isArray(rows) ? rows : [];
//   } catch (error) {
//     console.error("Error in fetchAllWorkItems:", error);
//     throw error;
//   }
// };

// exports.fetchWorkItemById = async (id) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM work_descriptions WHERE desc_id = ?",
//       [id]
//     );
//     return rows[0] || null;
//   } catch (error) {
//     console.error("Error in fetchWorkItemById:", error);
//     throw error;
//   }
// };

// exports.createSingleWorkItem = async (desc_name) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();
//     const [result] = await connection.query(
//       "INSERT INTO work_descriptions (desc_name) VALUES (?)",
//       [desc_name]
//     );
//     const newId = result.insertId;
//     await connection.commit();
//     return { desc_id: newId, desc_name };
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// exports.createMultipleWorkItems = async (descriptions) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();
//     const items = [];

//     for (const desc_name of descriptions) {
//       const [result] = await connection.query(
//         "INSERT INTO work_descriptions (desc_name) VALUES (?)",
//         [desc_name]
//       );
//       items.push({ desc_id: result.insertId, desc_name });
//     }

//     await connection.commit();
//     return items;
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// exports.updateWorkItem = async (id, desc_name) => {
//   try {
//     const [result] = await db.query(
//       "UPDATE work_descriptions SET desc_name = ? WHERE desc_id = ?",
//       [desc_name, id]
//     );
//     if (result.affectedRows === 0) return null;
//     return { desc_id: id, desc_name };
//   } catch (error) {
//     console.error("Error in updateWorkItem:", error);
//     throw error;
//   }
// };

// exports.deleteWorkItem = async (id) => {
//   try {
//     const [result] = await db.query(
//       "DELETE FROM work_descriptions WHERE desc_id = ?",
//       [id]
//     );
//     return result.affectedRows > 0;
//   } catch (error) {
//     console.error("Error in deleteWorkItem:", error);
//     throw error;
//   }
// };

// // ==================== Reckoner Operations ====================

// exports.getSiteByPoNumber = async (poNumber) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT site_id, site_name FROM site_details WHERE po_number = ?",
//       [poNumber]
//     );
//     return rows[0] || null;
//   } catch (error) {
//     console.error("Error in getSiteByPoNumber:", error);
//     throw error;
//   }
// };

// exports.saveReckonerData = async (data) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     const siteId = data[0]?.site_id;
//     if (!siteId) throw new Error("Site ID is required");

//     // Delete existing records for this site to prevent duplicates
//     await connection.query("DELETE FROM po_reckoner WHERE site_id = ?", [
//       siteId,
//     ]);

//     // Insert new records and get their IDs
//     const insertedIds = [];
//     const query = `
//         INSERT INTO po_reckoner 
//         (site_id, category_id, subcategory_id, item_id, desc_id, po_quantity, uom, rate, value)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//     for (const item of data) {
//       const [result] = await connection.query(query, [
//         item.site_id,
//         item.category_id,
//         item.subcategory_id,
//         item.item_id,
//         item.desc_id,
//         item.po_quantity,
//         item.uom,
//         item.rate,
//         item.value,
//       ]);
//       insertedIds.push(result.insertId); // Store the auto-incremented rec_id
//     }

//     // Insert into completion_status table
//     const completionQuery = `
//         INSERT INTO completion_status 
//         (rec_id)
//         VALUES (?)
//       `;

//     for (const id of insertedIds) {
//       await connection.query(completionQuery, [id]);
//     }

//     await connection.commit();
//     return insertedIds; // Return the inserted IDs for reference
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // Get all reckoner data with completion status and additional details
// exports.getAllReckonerWithStatus = async () => {
//   const connection = await db.getConnection();
//   try {
//     const [results] = await connection.query(`
//           SELECT 
//               pr.*,
//               sd.po_number,
//               ic.category_name,
//               isc.subcategory_name,
//               pr.item_id,
//               wd.desc_name AS work_descriptions,
//               cs.completion_id,
//               cs.area_completed,
//               cs.rate AS completion_rate,
//               cs.value AS completion_value,
//               cs.billed_area,
//               cs.billed_value,
//               cs.balance_area,
//               cs.balance_value,
//               cs.work_status,
//               cs.billing_status
//           FROM 
//               po_reckoner pr
//           LEFT JOIN 
//               site_details sd ON pr.site_id = sd.site_id
//           LEFT JOIN 
//               item_category ic ON pr.category_id = ic.category_id
//           LEFT JOIN 
//               item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
//           LEFT JOIN 
//               work_descriptions wd ON pr.desc_id = wd.desc_id
//           LEFT JOIN 
//               completion_status cs ON pr.rec_id = cs.rec_id
//           ORDER BY pr.rec_id DESC
//       `);
//     return results;
//   } catch (error) {
//     console.error("Error fetching reckoner data with status:", error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };
// // Get reckoner data by PO number with completion status and additional details
// exports.getReckonerByPoNumberWithStatus = async (poNumber) => {
//   const connection = await db.getConnection();
//   try {
//     const [results] = await connection.query(
//       `
//           SELECT 
//               pr.*,
//               sd.po_number,
//               ic.category_name,
//               isc.subcategory_name,
//               pr.item_id,
//               dow.item_description AS description_of_work,
//               cs.completion_id,
//               cs.area_completed,
//               cs.rate AS completion_rate,
//               cs.value AS completion_value,
//               cs.billed_area,
//               cs.billed_value,
//               cs.balance_area,
//               cs.balance_value,
//               cs.work_status,
//               cs.billing_status
//           FROM 
//               po_reckoner pr
//           LEFT JOIN 
//               site_details sd ON pr.site_id = sd.site_id
//           LEFT JOIN 
//               item_category ic ON pr.category_id = ic.category_id
//           LEFT JOIN 
//               item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
//           LEFT JOIN 
//               description_of_work dow ON pr.item_id = dow.item_id
//           LEFT JOIN 
//               completion_status cs ON pr.rec_id = cs.rec_id
//           WHERE 
//               sd.po_number = ?
//           ORDER BY pr.rec_id DESC
//       `,
//       [poNumber]
//     );

//     return results;
//   } catch (error) {
//     console.error("Error fetching reckoner by PO number with status:", error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };
// exports.updateCompletionStatus = async (rec_id, updateData) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     const query = `
//         UPDATE completion_status 
//         SET 
//           area_completed = ?,
//           rate = ?,
//           value = ?,
//           billed_area = ?,
//           billed_value = ?,
//           balance_area = ?,
//           balance_value = ?,
//           work_status = ?,
//           billing_status = ?
//         WHERE rec_id = ?
//       `;

//     await connection.query(query, [
//       updateData.area_completed,
//       updateData.rate,
//       updateData.value,
//       updateData.billed_area,
//       updateData.billed_value,
//       updateData.balance_area,
//       updateData.balance_value,
//       updateData.work_status,
//       updateData.billing_status,
//       rec_id,
//     ]);

//     await connection.commit();
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// exports.checkPoReckonerExists = async (site_id) => {
//   try {
//       // First check if site exists in site_details
//       const siteQuery = `SELECT site_id, site_name FROM site_details WHERE site_id = ?`;
//       const [siteResult] = await db.query(siteQuery, [site_id]);
      
//       if (siteResult.length === 0) {
//           throw new Error('Site not found');
//       }

//       const siteData = {
//           site_id: siteResult[0].site_id,
//           site_name: siteResult[0].site_name
//       };

//       // Check if po_reckoner exists for this site
//       const poReckonerQuery = `SELECT site_id FROM po_reckoner WHERE site_id = ?`;
//       const [poReckonerResult] = await db.query(poReckonerQuery, [site_id]);
      
//       return {
//           exists: poReckonerResult.length > 0,
//           ...siteData
//       };
//   } catch (error) {
//       console.error('Database error:', error);
//       throw error;
//   }
// };


// exports.getSiteById = async (site_id) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT site_id, site_name, po_number FROM site_details WHERE site_id = ?",
//       [site_id]
//     );
//     return rows[0] || null;
//   } catch (error) {
//     console.error("Error in getSiteById:", error);
//     throw error;
//   }
// };

// **********************************


const db = require("../config/db");

// ==================== Company Operations ====================

exports.fetchAllCompanies = async () => {
  try {
    const [rows] = await db.query("SELECT company_id, company_name FROM company");
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchAllCompanies:", error);
    throw error;
  }
};

// ==================== Project Operations ====================

exports.fetchProjectsByCompanyId = async (company_id) => {
  try {
    const [rows] = await db.query(
      "SELECT pd_id, project_name FROM project_details WHERE company_id = ?",
      [company_id]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchProjectsByCompanyId:", error);
    throw error;
  }
};

// ==================== Site Operations ====================

exports.fetchSitesByProjectId = async (pd_id) => {
  try {
    const [rows] = await db.query(
      "SELECT site_id, site_name, po_number FROM site_details WHERE pd_id = ?",
      [pd_id]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchSitesByProjectId:", error);
    throw error;
  }
};

// ==================== Category Operations ====================

exports.fetchAllCategories = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM item_category");
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchAllCategories:", error);
    throw error;
  }
};

exports.fetchCategoryById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM item_category WHERE category_id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in fetchCategoryById:", error);
    throw error;
  }
};

exports.createCategory = async (category_name) => {
  try {
    if (!category_name) throw new Error("Category name is required");
    const [result] = await db.query(
      `SELECT category_id FROM item_category ORDER BY category_id DESC LIMIT 1`
    );
    let newId = "CA101";
    if (result.length > 0) {
      const lastId = result[0].category_id;
      const num = parseInt(lastId.replace("CA", "")) + 1;
      newId = `CA${num}`;
    }
    await db.query(
      "INSERT INTO item_category (category_id, category_name) VALUES (?, ?)",
      [newId, category_name]
    );
    return { category_id: newId, category_name };
  } catch (error) {
    console.error("Error in createCategory:", error);
    throw error;
  }
};

exports.updateCategory = async (id, category_name) => {
  try {
    const [result] = await db.query(
      "UPDATE item_category SET category_name = ? WHERE category_id = ?",
      [category_name, id]
    );
    if (result.affectedRows === 0) return null;
    return { category_id: id, category_name };
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error;
  }
};

exports.deleteCategory = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM item_category WHERE category_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
};

// ==================== Subcategory Operations ====================

exports.fetchAllSubcategories = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM item_subcategory");
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchAllSubcategories:", error);
    throw error;
  }
};

exports.fetchSubcategoryById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM item_subcategory WHERE subcategory_id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in fetchSubcategoryById:", error);
    throw error;
  }
};

exports.createSubcategory = async (subcategory_name) => {
  try {
    if (!subcategory_name) throw new Error("Subcategory name is required");
    const [result] = await db.query(
      `SELECT subcategory_id FROM item_subcategory ORDER BY subcategory_id DESC LIMIT 1`
    );
    let newId = "SC101";
    if (result.length > 0) {
      const lastId = result[0].subcategory_id;
      const num = parseInt(lastId.replace("SC", "")) + 1;
      newId = `SC${num}`;
    }
    await db.query(
      "INSERT INTO item_subcategory (subcategory_id, subcategory_name) VALUES (?, ?)",
      [newId, subcategory_name]
    );
    return { subcategory_id: newId, subcategory_name };
  } catch (error) {
    console.error("Error in createSubcategory:", error);
    throw error;
  }
};

exports.updateSubcategory = async (id, subcategory_name) => {
  try {
    const [result] = await db.query(
      "UPDATE item_subcategory SET subcategory_name = ? WHERE subcategory_id = ?",
      [subcategory_name, id]
    );
    if (result.affectedRows === 0) return null;
    return { subcategory_id: id, subcategory_name };
  } catch (error) {
    console.error("Error in updateSubcategory:", error);
    throw error;
  }
};

exports.deleteSubcategory = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM item_subcategory WHERE subcategory_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteSubcategory:", error);
    throw error;
  }
};

// ==================== Work Items Operations ====================

exports.fetchAllWorkItems = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM work_descriptions");
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchAllWorkItems:", error);
    throw error;
  }
};

exports.fetchWorkItemById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM work_descriptions WHERE desc_id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in fetchWorkItemById:", error);
    throw error;
  }
};

exports.createSingleWorkItem = async (desc_name) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      "INSERT INTO work_descriptions (desc_name) VALUES (?)",
      [desc_name]
    );
    const newId = result.insertId;
    await connection.commit();
    return { desc_id: newId, desc_name };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.createMultipleWorkItems = async (descriptions) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const items = [];
    for (const desc_name of descriptions) {
      const [result] = await connection.query(
        "INSERT INTO work_descriptions (desc_name) VALUES (?)",
        [desc_name]
      );
      items.push({ desc_id: result.insertId, desc_name });
    }
    await connection.commit();
    return items;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateWorkItem = async (id, desc_name) => {
  try {
    const [result] = await db.query(
      "UPDATE work_descriptions SET desc_name = ? WHERE desc_id = ?",
      [desc_name, id]
    );
    if (result.affectedRows === 0) return null;
    return { desc_id: id, desc_name };
  } catch (error) {
    console.error("Error in updateWorkItem:", error);
    throw error;
  }
};

exports.deleteWorkItem = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM work_descriptions WHERE desc_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteWorkItem:", error);
    throw error;
  }
};

// ==================== Reckoner Operations ====================

exports.getSiteByPoNumber = async (poNumber) => {
  try {
    const [rows] = await db.query(
      "SELECT site_id, site_name FROM site_details WHERE po_number = ?",
      [poNumber]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getSiteByPoNumber:", error);
    throw error;
  }
};

exports.getSiteById = async (site_id) => {
  try {
    const [rows] = await db.query(
      "SELECT site_id, site_name, po_number FROM site_details WHERE site_id = ?",
      [site_id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getSiteById:", error);
    throw error;
  }
};

exports.saveReckonerData = async (data) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const siteId = data[0]?.site_id;
    if (!siteId) throw new Error("Site ID is required");

    // Delete existing records for this site to prevent duplicates
    await connection.query("DELETE FROM po_reckoner WHERE site_id = ?", [
      siteId,
    ]);

    // Insert new records and get their IDs
    const insertedIds = [];
    const query = `
        INSERT INTO po_reckoner 
        (site_id, category_id, subcategory_id, item_id, desc_id, po_quantity, uom, rate, value)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    for (const item of data) {
      const [result] = await connection.query(query, [
        item.site_id,
        item.category_id,
        item.subcategory_id,
        item.item_id,
        item.desc_id,
        item.po_quantity,
        item.uom,
        item.rate,
        item.value,
      ]);
      insertedIds.push(result.insertId); // Store the auto-incremented rec_id
    }

    // Insert into completion_status table
    const completionQuery = `
        INSERT INTO completion_status 
        (rec_id)
        VALUES (?)
      `;

    for (const id of insertedIds) {
      await connection.query(completionQuery, [id]);
    }

    await connection.commit();
    return insertedIds; // Return the inserted IDs for reference
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.getAllReckonerWithStatus = async () => {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query(`
          SELECT 
              pr.*,
              sd.po_number,
              ic.category_name,
              isc.subcategory_name,
              pr.item_id,
              wd.desc_name AS work_descriptions,
              wc.completion_id,
              wc.area_completed,
              wc.rate AS completion_rate,
              wc.value AS completion_value,
              wc.billed_area,
              wc.billed_value,
              wc.balance_area,
              wc.balance_value,
              wc.work_status,
              wc.billing_status,
              wc.created_by,
              wc.updated_at,
              u.user_name AS created_by_name
          FROM 
              po_reckoner pr
          LEFT JOIN 
              site_details sd ON pr.site_id = sd.site_id
          LEFT JOIN 
              item_category ic ON pr.category_id = ic.category_id
          LEFT JOIN 
              item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
          LEFT JOIN 
              work_descriptions wd ON pr.desc_id = wd.desc_id
          LEFT JOIN 
              completion_status wc ON pr.rec_id = wc.rec_id
          LEFT JOIN 
              users u ON wc.created_by = u.user_id
          ORDER BY pr.rec_id DESC
      `);
    return results;
  } catch (error) {
    console.error("Error fetching reckoner data with status:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.getReckonerByPoNumberWithStatus = async (poNumber) => {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query(
      `
          SELECT 
              pr.*,
              sd.po_number,
              ic.category_name,
              isc.subcategory_name,
              pr.item_id,
              wd.desc_name AS description_of_work,
              cs.completion_id,
              cs.area_completed,
              cs.rate AS completion_rate,
              cs.value AS completion_value,
              cs.billed_area,
              cs.billed_value,
              cs.balance_area,
              cs.balance_value,
              cs.work_status,
              cs.billing_status
          FROM 
              po_reckoner pr
          LEFT JOIN 
              site_details sd ON pr.site_id = sd.site_id
          LEFT JOIN 
              item_category ic ON pr.category_id = ic.category_id
          LEFT JOIN 
              item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
          LEFT JOIN 
              work_descriptions wd ON pr.desc_id = wd.desc_id
          LEFT JOIN 
              completion_status cs ON pr.rec_id = cs.rec_id
          WHERE 
              sd.po_number = ?
          ORDER BY pr.rec_id DESC
      `,
      [poNumber]
    );
    return results;
  } catch (error) {
    console.error("Error fetching reckoner by PO number with status:", error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.checkRecIdExistsInPO = async (rec_id) => {
  const [rows] = await db.query(
    "SELECT rec_id FROM po_reckoner WHERE rec_id = ?",
    [rec_id]
  );
  return rows.length > 0; // Returns true if found, false if not
};

// Existing updateCompletionStatus function...
exports.updateCompletionStatus = async (rec_id, updateData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT rec_id FROM completion_status WHERE rec_id = ?",
      [rec_id]
    );

    if (existing.length === 0) {
      // Insert
      const insertQuery = `
        INSERT INTO completion_status 
        (rec_id, area_completed, rate, value, billed_area, billed_value, balance_area, balance_value, work_status, billing_status, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await connection.query(insertQuery, [
        rec_id,
        updateData.area_completed || 0,
        updateData.rate || 0,
        updateData.value || 0,
        updateData.billed_area || 0,
        updateData.billed_value || 0,
        updateData.balance_area || 0,
        updateData.balance_value || 0,
        updateData.work_status || "In Progress",
        updateData.billing_status || "Not Billed",
        updateData.created_by, // Store created_by
      ]);
    } else {
      // Update
      const updateQuery = `
        UPDATE completion_status 
        SET 
          area_completed = ?,
          rate = ?,
          value = ?,
          billed_area = ?,
          billed_value = ?,
          balance_area = ?,
          balance_value = ?,
          work_status = ?,
          billing_status = ?,
          created_by = ?,
          updated_at = NOW()
        WHERE rec_id = ?
      `;
      await connection.query(updateQuery, [
        updateData.area_completed,
        updateData.rate,
        updateData.value,
        updateData.billed_area,
        updateData.billed_value,
        updateData.balance_area,
        updateData.balance_value,
        updateData.work_status,
        updateData.billing_status,
        updateData.created_by, // Update created_by
        rec_id,
      ]);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


exports.checkPoReckonerExists = async (site_id) => {
  try {
    // First check if site exists in site_details
    const siteQuery = `SELECT site_id, site_name FROM site_details WHERE site_id = ?`;
    const [siteResult] = await db.query(siteQuery, [site_id]);
    
    if (siteResult.length === 0) {
      throw new Error('Site not found');
    }

    const siteData = {
      site_id: siteResult[0].site_id,
      site_name: siteResult[0].site_name
    };

    // Check if po_reckoner exists for this site
    const poReckonerQuery = `SELECT site_id FROM po_reckoner WHERE site_id = ?`;
    const [poReckonerResult] = await db.query(poReckonerQuery, [site_id]);
    
    return {
      exists: poReckonerResult.length > 0,
      ...siteData
    };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};


// ==================== Site Operations ====================

exports.fetchAllSites = async () => {
  try {
    const [rows] = await db.query(
      "SELECT site_id, site_name, po_number FROM site_details ORDER BY site_name ASC"
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error in fetchAllSites:", error);
    throw error;
  }
};