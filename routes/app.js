const express = require("express");
const pool = require("../db");
const routes = express.Router();

routes.get("/alldata", async(req, res) => {
      try {
        const { cursorDate, cursorId, categoryfilter } = req.query;
        let query;
        let values;

        if(!cursorDate || !cursorId){
            // first page
            query = `
                    SELECT *, updated_at::text AS exact_cursor_date
                    FROM products
                    ORDER BY updated_at DESC, id DESC
                    LIMIT 10;
                `;
            values = [];
        } else {
            // next page
            query = `
                    SELECT *, updated_at::text AS exact_cursor_date
                    FROM products
                    WHERE (updated_at, id) < ($1, $2)
                    ORDER BY updated_at DESC, id DESC
                    LIMIT 10;
            `;
            values = [cursorDate, cursorId];
        }
        
        const result = await pool.query(query, values);

        let nextCursor = null;

        if(result.rows.length > 0){
             const last = result.rows[result.rows.length - 1];

             nextCursor = {
                cursorDate: last.exact_cursor_date, // Use the raw DB string, not the JS Date
                cursorId: last.id,
             };
        }

        // Clean up: Remove the extra 'exact_cursor_date' property so it doesn't pollute your API response
        const data = result.rows.map(row => {
            const { exact_cursor_date, ...rest } = row;
            return rest;
        });

        return res.json({
            success: true,
            nextCursor,
            data
         });

      } catch(err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
      }
});


//

module.exports = routes;