const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

// Register User
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Cek apakah email sudah ada (username bisa duplikat)
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        // Buat user baru
        const user = new User({ username, email, password });
        await user.save();

        res.json({ message: "Registrasi berhasil, silakan login" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email tidak terdaftar" });
        }

        // Cek password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password salah" });
        }

        // Buat token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login berhasil", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
