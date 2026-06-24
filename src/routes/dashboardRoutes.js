const router = require('express').Router()
const  dashboard= require('../controllers/dashboardController')
const auth= require('../middleware/authMiddleware')

router.get('/',auth,dashboard.getDashBoardStats)

module.exports= router;





