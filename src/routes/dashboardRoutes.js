const router = require('express').Router()
const  dashboard= require('../controllers/dashboardController')
const auth= require('../middleware/authMiddleware')

router.get('/',auth,dashboard.getDashboardStats)

module.exports= router;





