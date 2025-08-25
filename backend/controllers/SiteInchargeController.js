// const db = require('../config/db');

// exports.saveCompletionStatus = async (req, res) => {
//   try {
//     const { rec_id, area_completed, rate, value, created_by } = req.body;

//     // Validate inputs (unchanged)
//     if (!rec_id || typeof rec_id !== 'number') {
//       return res.status(400).json({
//         status: 'error',
//         message: 'rec_id is required and must be a number',
//       });
//     }
//     if (area_completed === undefined || typeof area_completed !== 'number' || area_completed < 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'area_completed is required and must be a non-negative number',
//       });
//     }
//     if (rate === undefined || typeof rate !== 'number' || rate < 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'rate is required and must be a non-negative number',
//       });
//     }
//     if (value === undefined || typeof value !== 'number' || value < 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'value is required and must be a non-negative number',
//       });
//     }
//     if (!created_by || typeof created_by !== 'number') {
//       return res.status(400).json({
//         status: 'error',
//         message: 'created_by is required and must be a number',
//       });
//     }

//     // Check that rec_id exists in po_reckoner
//     const [reckonerRecord] = await db.query(
//       'SELECT rec_id FROM po_reckoner WHERE rec_id = ?',
//       [rec_id]
//     );
//     if (reckonerRecord.length === 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: `Invalid rec_id (${rec_id}): record does not exist in po_reckoner`,
//       });
//     }

//     // Check that created_by exists in users
//     const [userRecord] = await db.query(
//       'SELECT user_id FROM users WHERE user_id = ?',
//       [created_by]
//     );
//     if (userRecord.length === 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: `Invalid created_by (${created_by}): user does not exist`,
//       });
//     }

//     // Check if completion_status record exists
//     const [completionRecord] = await db.query(
//       'SELECT rec_id FROM completion_status WHERE rec_id = ?',
//       [rec_id]
//     );

//     // Calculate server-side value (for consistency/security)
//     const calculatedValue = parseFloat(area_completed) * parseFloat(rate);
//     if (Math.abs(calculatedValue - value) > 0.01) {
//       return res.status(400).json({
//         status: 'error',
//         message: `Invalid value: expected ${calculatedValue.toFixed(2)}, received ${value}`,
//       });
//     }

//     // Prepare completion data
//     const completionData = {
//       rec_id,
//       area_completed: parseFloat(area_completed),
//       rate: parseFloat(rate),
//       value: parseFloat(calculatedValue.toFixed(2)),
//       created_by: parseInt(created_by),
//       work_status: 'In Progress',
//       billing_status: 'Not Billed',
//     };

//     let result;
//     if (completionRecord.length === 0) {
//       // If not exists: INSERT instead of returning 404
//       [result] = await db.query(
//         `
//           INSERT INTO completion_status
//           (rec_id, area_completed, rate, value, created_by, work_status, billing_status, created_at, updated_at)
//           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//         `,
//         [
//           completionData.rec_id,
//           completionData.area_completed,
//           completionData.rate,
//           completionData.value,
//           completionData.created_by,
//           completionData.work_status,
//           completionData.billing_status,
//         ]
//       );
//       if (result.affectedRows === 0) {
//         return res.status(500).json({
//           status: 'error',
//           message: `Failed to create completion status for rec_id (${rec_id})`,
//         });
//       }
//       res.status(201).json({
//         status: 'success',
//         message: 'Completion status created successfully',
//         data: completionData,
//       });
//     } else {
//       // If exists: UPDATE
//       [result] = await db.query(
//         `
//           UPDATE completion_status
//           SET
//             area_completed = ?,
//             rate = ?,
//             value = ?,
//             created_by = ?,
//             work_status = ?,
//             billing_status = ?,
//             updated_at = NOW()
//           WHERE rec_id = ?
//         `,
//         [
//           completionData.area_completed,
//           completionData.rate,
//           completionData.value,
//           completionData.created_by,
//           completionData.work_status,
//           completionData.billing_status,
//           completionData.rec_id,
//         ]
//       );
//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           status: 'error',
//           message: `Failed to update: no record found for rec_id (${rec_id})`,
//         });
//       }
//       res.status(200).json({
//         status: 'success',
//         message: 'Completion status updated successfully',
//         data: completionData,
//       });
//     }
//   } catch (error) {
//     console.error('Error in saveCompletionStatus:', error);
//     if (error.code === 'ER_NO_REFERENCED_ROW_2') {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Invalid rec_id or created_by: referenced record does not exist',
//       });
//     }
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// };



const db = require('../config/db');


exports.getCompletionEntries = async (req, res) => {
  try {
    const { rec_id, date } = req.query;

    if (!rec_id || isNaN(rec_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'rec_id is required and must be a number',
      });
    }

    // Fetch cumulative area up to the given date
    let cumulativeQuery = `
      SELECT COALESCE(SUM(area_added), 0) as cumulative_area
      FROM completion_entries_history
      WHERE rec_id = ? AND entry_date <= ?
    `;
    const [cumulativeResult] = await db.query(cumulativeQuery, [rec_id, date || new Date().toISOString().split('T')[0]]);

    // Fetch entries for the exact date
    let entriesQuery = `
      SELECT entry_id, area_added, rate, value_added, created_by, created_at
      FROM completion_entries_history
      WHERE rec_id = ? AND entry_date = ?
      ORDER BY created_at DESC
    `;
    const [entries] = await db.query(entriesQuery, [rec_id, date || new Date().toISOString().split('T')[0]]);

    res.status(200).json({
      status: 'success',
      data: {
        entries,
        cumulative_area: parseFloat(cumulativeResult[0].cumulative_area) || 0,
      },
    });
  } catch (error) {
    console.error('Error in getCompletionEntries:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.saveCompletionStatus = async (req, res) => {
  try {
    const { rec_id, area_added, rate, value, created_by, entry_date } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Validate inputs
    if (!rec_id || typeof rec_id !== 'number') {
      return res.status(400).json({ status: 'error', message: 'rec_id is required and must be a number' });
    }
    if (area_added === undefined || typeof area_added !== 'number' || area_added < 0) {
      return res.status(400).json({ status: 'error', message: 'area_added is required and must be a non-negative number' });
    }
    if (rate === undefined || typeof rate !== 'number' || rate < 0) {
      return res.status(400).json({ status: 'error', message: 'rate is required and must be a non-negative number' });
    }
    if (value === undefined || typeof value !== 'number' || value < 0) {
      return res.status(400).json({ status: 'error', message: 'value is required and must be a non-negative number' });
    }
    if (!created_by || typeof created_by !== 'number') {
      return res.status(400).json({ status: 'error', message: 'created_by is required and must be a number' });
    }
    if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date) || entry_date > today) {
      return res.status(400).json({ status: 'error', message: 'entry_date is required, must be in YYYY-MM-DD format, and cannot be in the future' });
    }

    // Check rec_id exists in po_reckoner and get po_quantity
    const [reckonerRecord] = await db.query(
      'SELECT rec_id, po_quantity FROM po_reckoner WHERE rec_id = ?',
      [rec_id]
    );
    if (reckonerRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid rec_id (${rec_id}): record does not exist in po_reckoner` });
    }
    const po_quantity = parseFloat(reckonerRecord[0].po_quantity);

    // Check created_by exists
    const [userRecord] = await db.query('SELECT user_id FROM users WHERE user_id = ?', [created_by]);
    if (userRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid created_by (${created_by}): user does not exist` });
    }

    // Calculate server-side value_added
    const calculatedValue = parseFloat(area_added) * parseFloat(rate);
    if (Math.abs(calculatedValue - value) > 0.01) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid value: expected ${calculatedValue.toFixed(2)}, received ${value}`,
      });
    }

    // Check current completion_status
    const [completionRecord] = await db.query(
      'SELECT area_completed, rate, value, created_by FROM completion_status WHERE rec_id = ?',
      [rec_id]
    );

    // Insert new entry into completion_entries_history
    await db.query(
      `
        INSERT INTO completion_entries_history
        (rec_id, entry_date, area_added, rate, value_added, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [rec_id, entry_date, parseFloat(area_added), parseFloat(rate), calculatedValue, created_by]
    );

    // Calculate new cumulative area
    const [currentCumulative] = await db.query(
      'SELECT COALESCE(SUM(area_added), 0) as current_area FROM completion_entries_history WHERE rec_id = ?',
      [rec_id]
    );
    const new_area = parseFloat(currentCumulative[0].current_area) || 0;
    if (new_area > po_quantity) {
      return res.status(400).json({ status: 'error', message: `Completed area cannot exceed PO quantity (${po_quantity})` });
    }

    // Prepare cumulative data
    const completionData = {
      rec_id,
      area_completed: new_area,
      rate: parseFloat(rate),
      value: parseFloat((new_area * rate).toFixed(2)),
      created_by,
      work_status: 'In Progress',
      billing_status: 'Not Billed',
    };

    // Update or insert into completion_status
    let result;
    if (completionRecord.length === 0) {
      // No existing completion_status record, insert new one
      [result] = await db.query(
        `
          INSERT INTO completion_status
          (rec_id, area_completed, rate, value, created_by, work_status, billing_status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `,
        [
          completionData.rec_id,
          completionData.area_completed,
          completionData.rate,
          completionData.value,
          completionData.created_by,
          completionData.work_status,
          completionData.billing_status,
        ]
      );
      res.status(201).json({
        status: 'success',
        message: 'Completion entry created successfully',
        data: completionData,
      });
    } else {
      // Update completion_status
      [result] = await db.query(
        `
          UPDATE completion_status
          SET
            area_completed = ?,
            rate = ?,
            value = ?,
            created_by = ?,
            work_status = ?,
            billing_status = ?,
            updated_at = NOW()
          WHERE rec_id = ?
        `,
        [
          completionData.area_completed,
          completionData.rate,
          completionData.value,
          completionData.created_by,
          completionData.work_status,
          completionData.billing_status,
          completionData.rec_id,
        ]
      );
      res.status(200).json({
        status: 'success',
        message: 'Completion entry updated successfully',
        data: completionData,
      });
    }
  } catch (error) {
    console.error('Error in saveCompletionStatus:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rec_id or created_by: referenced record does not exist',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getCompletionEntriesBySiteID = async (req, res) => {
  try {
    const { site_id } = req.params;
    const { start_date, end_date } = req.query;

  
    if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
      return res.status(400).json({
        status: 'error',
        message: 'start_date must be in YYYY-MM-DD format',
      });
    }
    if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
      return res.status(400).json({
        status: 'error',
        message: 'end_date must be in YYYY-MM-DD format',
      });
    }
    if (start_date && end_date && start_date > end_date) {
      return res.status(400).json({
        status: 'error',
        message: 'start_date cannot be later than end_date',
      });
    }

    // Build query with joins to fetch category_name and subcategory_name
    let query = `
      SELECT 
        ic.category_name,
        isc.subcategory_name,
        DATE_FORMAT(ceh.entry_date, '%Y-%m-%d') as entry_date,
        ceh.entry_id,
        ceh.area_added,
        ceh.rate,
        ceh.value_added,
        ceh.created_by,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%Y-%m-%d') as created_date,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%H:%i:%s') as created_time
      FROM completion_entries_history ceh
      JOIN po_reckoner pr ON ceh.rec_id = pr.rec_id
      JOIN item_category ic ON pr.category_id = ic.category_id
      JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
      WHERE pr.site_id = ?
    `;
    const queryParams = [site_id];

    if (start_date) {
      query += ' AND ceh.entry_date >= ?';
      queryParams.push(start_date);
    }
    if (end_date) {
      query += ' AND ceh.entry_date <= ?';
      queryParams.push(end_date);
    }

    query += ' ORDER BY ic.category_name, isc.subcategory_name, ceh.entry_date, ceh.created_at';

    const [rows] = await db.query(query, queryParams);

    // Structure the data
    const groupedData = [];
    const categoryMap = new Map();

    rows.forEach(row => {
      const { category_name, subcategory_name, entry_date, created_date, created_time, ...entry } = row;

      // Find or create category
      let category = categoryMap.get(category_name);
      if (!category) {
        category = { category_name, subcategories: [] };
        categoryMap.set(category_name, category);
        groupedData.push(category);
      }

      // Find or create subcategory
      let subcategory = category.subcategories.find(sc => sc.subcategory_name === subcategory_name);
      if (!subcategory) {
        subcategory = { subcategory_name, entries_by_date: [] };
        category.subcategories.push(subcategory);
      }

      // Find or create date entry
      let dateEntry = subcategory.entries_by_date.find(de => de.entry_date === entry_date);
      if (!dateEntry) {
        dateEntry = { entry_date, entries: [] };
        subcategory.entries_by_date.push(dateEntry);
      }

      // Add entry with separate date and time fields
      dateEntry.entries.push({
        entry_id: row.entry_id,
        area_added: parseFloat(row.area_added),
        rate: parseFloat(row.rate),
        value_added: parseFloat(row.value_added),
        created_by: row.created_by,
        created_date: row.created_date,
        created_time: row.created_time
      });
    });

    res.status(200).json({
      status: 'success',
      data: groupedData
    });
  } catch (error) {
    console.error('Error in getCompletionEntriesByCategory:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};