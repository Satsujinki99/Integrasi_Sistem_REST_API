const express = require("express");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
const itemRoutes = require("./routes/items");
app.use("/items", itemRoutes);

app.get("/", (req, res) => {
    res.send("API Gudang Alat Tulis Berjalan!");
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
