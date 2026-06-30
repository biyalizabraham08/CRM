const express = require("express");
const router = express.Router();

const { createEmployee, getAllEmployees } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/employees", authMiddleware, adminMiddleware, createEmployee);
router.get("/employees", authMiddleware, adminMiddleware, getAllEmployees);

module.exports = router;

