const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak tersedia' });
  }

  try {
    const decoded = jwt.verify(token, process.env.rahasia); // Verifikasi token
    req.user = decoded; // Simpan user ke req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = authMiddleware;
