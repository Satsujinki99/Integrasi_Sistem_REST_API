const express = require("express");
const fs = require("fs");
const router = express.Router();
const dataPath = "./data/items.json";

// Fungsi untuk membaca data dari file JSON
const readData = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// **1. GET - Ambil semua alat tulis**
router.get("/", (req, res) => {
    const items = readData();
    res.json(items);
});

// **2. GET - Ambil satu item berdasarkan ID**
router.get("/:id", (req, res) => {
    const items = readData();
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
    res.json(item);
});

// **3. POST - Tambah alat tulis baru**
router.post("/", (req, res) => {
    const items = readData();
    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price
    };
    items.push(newItem);
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
    res.status(201).json(newItem);
});

// **4. PUT - Edit alat tulis berdasarkan ID**
router.put("/:id", (req, res) => {
    const items = readData();
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Item tidak ditemukan" });

    items[index] = { ...items[index], ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
    res.json(items[index]);
});

// **5. DELETE - Hapus alat tulis berdasarkan ID**
router.delete("/:id", (req, res) => {
    let items = readData();
    const filteredItems = items.filter(i => i.id !== parseInt(req.params.id));
    if (items.length === filteredItems.length) return res.status(404).json({ message: "Item tidak ditemukan" });

    fs.writeFileSync(dataPath, JSON.stringify(filteredItems, null, 2));
    res.json({ message: "Item berhasil dihapus" });
});

module.exports = router;
