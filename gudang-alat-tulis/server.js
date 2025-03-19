const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load variabel lingkungan
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", authRoutes);
app.use("/orders", orderRoutes);
app.use("/items", itemRoutes);


// Jalankan Server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
