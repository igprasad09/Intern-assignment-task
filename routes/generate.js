const express = require("express");
const routes = express.Router();
const pool = require("../db");

const categories = {
  Electronics: [
    "iPhone 16", "Samsung Galaxy S25", "MacBook Air M4", "Dell Inspiron 15",
    "Sony WH-1000XM5", "Apple Watch Series 11", "OnePlus 14", "iPad Air",
    "Canon EOS R50", "LG OLED TV",
  ],
  Fashion: [
    "Nike Air Max", "Adidas Ultraboost", "Puma Sneakers", "Levi's Jeans",
    "Roadster T-Shirt", "Woodland Shoes", "Allen Solly Shirt", "RayBan Sunglasses",
    "Fastrack Watch", "Wildcraft Jacket",
  ],
  Books: [
    "Atomic Habits", "Deep Work", "Clean Code", "The Pragmatic Programmer",
    "Rich Dad Poor Dad", "The Alchemist", "Think Like a Monk", "Ikigai",
    "Zero to One", "Can't Hurt Me",
  ],
  Furniture: [
    "Wooden Dining Table", "Office Chair", "Queen Size Bed", "Study Table",
    "Bookshelf", "Sofa Set", "TV Unit", "Coffee Table", "Wardrobe", "Bean Bag",
  ],
  Sports: [
    "Cricket Bat", "Football", "Badminton Racket", "Yoga Mat", "Dumbbells",
    "Skipping Rope", "Tennis Ball", "Cycling Helmet", "Basketball", "Fitness Band",
  ],
};

const categoryNames = Object.keys(categories);

function randomPrice(category) {
  switch (category) {
    case "Electronics": return Math.floor(Math.random() * 90000) + 5000;
    case "Furniture": return Math.floor(Math.random() * 30000) + 3000;
    case "Fashion": return Math.floor(Math.random() * 7000) + 500;
    case "Books": return Math.floor(Math.random() * 1500) + 200;
    default: return Math.floor(Math.random() * 10000) + 500;
  }
}

function generateProducts(count, startIndex = 0) {
  const products = [];
  const baseTime = Date.now(); // FIX: Get absolute base time once

  for (let i = 0; i < count; i++) {
    const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const productList = categories[category];
    const productName = productList[Math.floor(Math.random() * productList.length)] + ` #${startIndex + i + 1}`;
    const price = randomPrice(category);

    // FIX: Add 'i' milliseconds to guarantee strictly unique sorting timestamps
    const created = new Date(baseTime + i);
    const updated = new Date(created);

    products.push({
      name: productName,
      category,
      price,
      created_at: created,
      updated_at: updated,
    });
  }
  return products;
}

routes.get("/generate", async (req, res) => {
  const TOTAL = parseInt(req.query.limit) || 50;
  
  // SAFE GUARD: Max parameters 65535 / 5 values per product = Max 13107 products per batch.
  // We keep it at a clean 50000 max parameters per query (~10,000 products per batch) for safety.
  const FIELDS_PER_PRODUCT = 5;
  const BATCH_SIZE = Math.floor(50000 / FIELDS_PER_PRODUCT); 

  try {
    let inserted = 0;

    while (inserted < TOTAL) {
      const currentBatch = Math.min(BATCH_SIZE, TOTAL - inserted);
      const products = generateProducts(currentBatch, inserted);

      const values = [];
      const placeholders = [];

      products.forEach((product, index) => {
        const base = index * FIELDS_PER_PRODUCT;

        placeholders.push(
          `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5})`
        );

        values.push(
          product.name,
          product.category,
          product.price,
          product.created_at,
          product.updated_at
        );
      });

      const query = `
        INSERT INTO products 
        (name, category, price, created_at, updated_at) 
        VALUES 
        ${placeholders.join(",")}
      `;

      await pool.query(query, values);
      inserted += currentBatch;
      console.log(`${inserted} / ${TOTAL} products inserted...`);
    }

    res.json({
      success: true,
      message: `${TOTAL} products inserted successfully`,
    });

  } catch (err) {
    console.error("Seeding Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = routes;