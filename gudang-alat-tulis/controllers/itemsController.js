const mongoose = require("mongoose");
const Item = require("../models/Item").default;

// **ITEM CONTROLLER**
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        if (!name || quantity == null || price == null) {
            return res.status(400).json({ message: "Harap isi name, quantity, dan price" });
        }
        const newItem = new Item({ name, quantity, price });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
        res.json({ message: "Item berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **ORDER CONTROLLER**
exports.createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Keranjang kosong" });
        }
        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder = new Order({
            userId: req.params.userId,
            items: cart.items,
            totalAmount,
            status: "pending"
        });
        await newOrder.save();
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ message: "Pesanan tidak ditemukan" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};