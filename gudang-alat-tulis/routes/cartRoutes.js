// routes/cartRoutes.js
const express = require('express');
const router = express.Router();

let carts = {};

// Get cart by userId
router.get('/:userId', (req, res) => {
  const userCart = carts[req.params.userId] || [];
  res.json(userCart);
});

// Add item to cart
router.post('/:userId', (req, res) => {
  const { id, name, quantity, price } = req.body;

  if (!id || !name || !quantity || !price) {
    return res.status(400).json({ message: 'Harap lengkapi id, name, quantity, dan price' });
  }

  carts[req.params.userId] = carts[req.params.userId] || [];

  const existingItem = carts[req.params.userId].find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[req.params.userId].push({ id, name, quantity, price });
  }

  res.status(201).json({ 
    message: 'Item added to cart', 
    cart: carts[req.params.userId] 
  });
});

// Update item quantity in cart
router.put('/:userId/:id', (req, res) => {
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: 'Quantity harus diisi dan minimal 0' });
  }

  const userCart = carts[req.params.userId];

  if (!userCart) return res.status(404).json({ message: 'Keranjang tidak ditemukan' });

  const item = userCart.find(item => item.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item tidak ditemukan di keranjang' });

  item.quantity = quantity;

  res.json({ message: 'Item updated in cart', cart: userCart });
});

// Remove item from cart
router.delete('/:userId/:id', (req, res) => {
  const userCart = carts[req.params.userId];

  if (!userCart) return res.status(404).json({ message: 'Keranjang tidak ditemukan' });

  const filteredCart = userCart.filter(item => item.id !== parseInt(req.params.id));

  carts[req.params.userId] = filteredCart;

  res.json({ message: 'Item removed from cart', cart: filteredCart });
});

// Clear entire cart
router.delete('/:userId', (req, res) => {
  if (!carts[req.params.userId]) return res.status(404).json({ message: 'Keranjang tidak ditemukan' });

  delete carts[req.params.userId];

  res.json({ message: 'Keranjang dikosongkan' });
});

module.exports = router;
