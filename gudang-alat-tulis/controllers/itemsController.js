const fs = require("fs");
const dataPath = "./data/items.json";
const cartPath = "./data/cart.json";
const ordersPath = "./data/orders.json";

// Fungsi untuk membaca data
const readData = (path) => {
    if (!fs.existsSync(path)) return {};
    const data = fs.readFileSync(path);
    return JSON.parse(data);
};

// Fungsi untuk menulis data
const writeData = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// **ITEM CONTROLLER**
exports.getAllItems = (req, res) => {
    const items = readData(dataPath);
    res.json(items);
};

exports.getItemById = (req, res) => {
    const items = readData(dataPath);
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
    res.json(item);
};

exports.createItem = (req, res) => {
    const { name, quantity, price } = req.body;
    if (!name || quantity == null || price == null) {
        return res.status(400).json({ message: "Harap isi name, quantity, dan price" });
    }

    const items = readData(dataPath);
    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name,
        quantity,
        price
    };

    items.push(newItem);
    writeData(dataPath, items);
    res.status(201).json(newItem);
};

exports.updateItem = (req, res) => {
    const items = readData(dataPath);
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Item tidak ditemukan" });

    items[index] = { ...items[index], ...req.body };
    writeData(dataPath, items);
    res.json(items[index]);
};

exports.deleteItem = (req, res) => {
    let items = readData(dataPath);
    const filteredItems = items.filter(i => i.id !== parseInt(req.params.id));
    if (items.length === filteredItems.length) return res.status(404).json({ message: "Item tidak ditemukan" });

    writeData(dataPath, filteredItems);
    res.json({ message: "Item berhasil dihapus" });
};

// **CART CONTROLLER**
exports.getCart = (req, res) => {
    const cart = readData(cartPath);
    const userCart = cart[req.params.userId] || [];
    if (userCart.length === 0) {
        return res.status(404).json({ message: "Keranjang kosong" });
    }
    res.json(userCart);
};

exports.addToCart = (req, res) => {
    const cart = readData(cartPath);
    const { id, name, quantity, price } = req.body;

    if (!id || !name || !quantity || !price) {
        return res.status(400).json({ message: "Harap lengkapi id, name, quantity, dan price" });
    }

    if (!cart[req.params.userId]) cart[req.params.userId] = [];
    const existingItem = cart[req.params.userId].find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart[req.params.userId].push({ id, name, quantity, price });
    }

    writeData(cartPath, cart);
    res.status(201).json({ 
        message: "Item added to cart", 
        cart: cart[req.params.userId] 
    });
};


exports.removeFromCart = (req, res) => {
    const cart = readData(cartPath);
    if (!cart[req.params.userId]) {
        return res.status(404).json({ message: "Keranjang tidak ditemukan" });
    }

    const initialLength = cart[req.params.userId].length;
    cart[req.params.userId] = cart[req.params.userId].filter(item => item.id !== parseInt(req.params.itemId));

    if (cart[req.params.userId].length === initialLength) {
        return res.status(404).json({ message: "Item tidak ditemukan di keranjang" });
    }

    writeData(cartPath, cart);
    res.json({ 
        message: "Item dihapus dari keranjang", 
        cart: cart[req.params.userId] 
    });
};


// **ORDER CONTROLLER**
exports.createOrder = (req, res) => {
    const cart = readData(cartPath);
    const orders = readData(ordersPath);

    if (!cart[req.params.userId] || cart[req.params.userId].length === 0) {
        return res.status(400).json({ message: "Keranjang kosong" });
    }

    const totalAmount = cart[req.params.userId].reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = {
        orderId: orders.length ? orders[orders.length - 1].orderId + 1 : 1,
        userId: req.params.userId,
        items: cart[req.params.userId],
        totalAmount,
        status: "pending"
    };

    orders.push(newOrder);
    writeData(ordersPath, orders);
    delete cart[req.params.userId];
    writeData(cartPath, cart);

    res.status(201).json(newOrder);
};

exports.getOrders = (req, res) => {
    const orders = readData(ordersPath);
    const userOrders = orders.filter(order => order.userId === req.params.userId);
    res.json(userOrders);
};

exports.updateOrderStatus = (req, res) => {
    const orders = readData(ordersPath);
    const order = orders.find(order => order.orderId === parseInt(req.params.orderId));
    if (!order) return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    order.status = req.body.status;
    writeData(ordersPath, orders);
    res.json(order);
};