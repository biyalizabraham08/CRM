const router = require('express').Router();
const { registerUser, loginUser, demoLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo', demoLogin);

module.exports = router;