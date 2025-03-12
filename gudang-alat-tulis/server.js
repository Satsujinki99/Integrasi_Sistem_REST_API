// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
const itemRoutes = require("./routes/items");
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use("/items", itemRoutes);
app.get("/", (req, res) => {
    res.send("API Gudang Alat Tulis Berjalan!");
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
