const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/auth");

const router = express.Router();

// Rute Register
router.post(
    "/register",
    [
        check("username", "Nama harus diisi").not().isEmpty(),
        check("email", "Masukkan email yang valid").isEmail(),
        check("password", "Password minimal 6 karakter").isLength({ min: 6 }),
    ],
    register
);

// Rute Login
router.post(
    "/login",
    [
        check("email", "Masukkan email yang valid").isEmail(),
        check("password", "Password tidak boleh kosong").exists(),
    ],
    login
);

module.exports = router;
