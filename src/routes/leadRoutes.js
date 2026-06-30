const router = require('express').Router();
const lead = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')


router.post('/', authMiddleware, adminMiddleware, lead.createLead);
router.get('/search', authMiddleware, lead.searchLeads);
router.get('/status', authMiddleware, lead.filterByStatus);
router.get('/', authMiddleware, lead.getAllLeads);
router.get('/:id', authMiddleware, lead.getLeadById);
router.put('/:id', authMiddleware, adminMiddleware, lead.updateLead);
router.delete('/:id', authMiddleware, adminMiddleware, lead.deleteLead);

module.exports = router;
