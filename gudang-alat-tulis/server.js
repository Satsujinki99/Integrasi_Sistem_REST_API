const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware untuk parsing JSON

app.get("/", (req, res) => {
    res.send("API Gudang Alat Tulis Berjalan!");
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
