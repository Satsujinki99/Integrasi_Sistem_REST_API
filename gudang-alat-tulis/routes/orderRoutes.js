const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

let orders = [];

// 🛍 Membuat pesanan (User harus login)
router.post('/', authMiddleware, (req, res) => {
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: 'Items tidak boleh kosong' });
  }

  const newOrder = {
    id: Date.now().toString(),
    userId: req.user.id, // Ambil userId dari token JWT
    items,
    status: 'Pending'
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Order berhasil dibuat', order: newOrder });
});

// 📜 Melihat semua pesanan user
router.get('/', authMiddleware, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.id);

  if (userOrders.length === 0) {
    return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
  }

  res.json(userOrders);
});

// 🔄 Mengupdate status pesanan
router.put('/:orderId', authMiddleware, (req, res) => {
  const order = orders.find(order => order.id === req.params.orderId);

  if (!order) {
    return res.status(404).json({ message: 'Order tidak ditemukan' });
  }

  if (req.body.status) {
    order.status = req.body.status;
  }

  res.json({ message: 'Order berhasil diperbarui', order });
});

// ❌ Menghapus pesanan
router.delete('/:orderId', authMiddleware, (req, res) => {
  const initialLength = orders.length;
  orders = orders.filter(order => order.id !== req.params.orderId);

  if (orders.length === initialLength) {
    return res.status(404).json({ message: 'Order tidak ditemukan' });
  }

  res.json({ message: 'Order berhasil dihapus' });
});

module.exports = router;
