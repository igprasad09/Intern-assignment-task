const express = require("express");
const pool = require("../db");

const routes = express.Router();

routes.get("/alldata", async (req, res) => {
  try {
    const { cursorDate, cursorId, categoryfilter } = req.query;

    let query;
    let values = [];

    // FIRST PAGE
    if (!cursorDate || !cursorId) {

      if (categoryfilter) {
        query = `
          SELECT *, updated_at::text AS exact_cursor_date
          FROM products
          WHERE category = $1
          ORDER BY updated_at DESC, id DESC
          LIMIT 10;
        `;

        values = [categoryfilter];

      } else {
        query = `
          SELECT *, updated_at::text AS exact_cursor_date
          FROM products
          ORDER BY updated_at DESC, id DESC
          LIMIT 10;
        `;
      }

    } else {

      // NEXT PAGE
      if (categoryfilter) {
        query = `
          SELECT *, updated_at::text AS exact_cursor_date
          FROM products
          WHERE category = $1
          AND (updated_at, id) < ($2, $3)
          ORDER BY updated_at DESC, id DESC
          LIMIT 10;
        `;

        values = [
          categoryfilter,
          cursorDate,
          cursorId
        ];

      } else {
        query = `
          SELECT *, updated_at::text AS exact_cursor_date
          FROM products
          WHERE (updated_at, id) < ($1, $2)
          ORDER BY updated_at DESC, id DESC
          LIMIT 10;
        `;

        values = [
          cursorDate,
          cursorId
        ];
      }
    }

    const result = await pool.query(query, values);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const last = result.rows[result.rows.length - 1];

      nextCursor = {
        cursorDate: last.exact_cursor_date,
        cursorId: last.id,
      };
    }

    const data = result.rows.map((row) => {
      const { exact_cursor_date, ...rest } = row;
      return rest;
    });

    return res.json({
      success: true,
      nextCursor,
      data,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = routes;