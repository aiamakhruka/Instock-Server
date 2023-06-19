require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const warehouseRoutes = require("./routes/warehouse-routes");
const inventoryRoutes = require("./routes/inventory-routes");

const { PORT, CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/warehouses", warehouseRoutes);
app.use("/inventories", inventoryRoutes);

app.get("/", (_req, res) => {
  res.send("Welcome to my API");
});


app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
