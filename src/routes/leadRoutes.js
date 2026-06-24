const router = require('express').Router();
const lead = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, lead.createLead);
router.get('/search', authMiddleware, lead.searchLeads);
router.get('/status', authMiddleware, lead.filterByStatus);
router.get('/', authMiddleware, lead.getAllLeads);
router.get('/:id', authMiddleware, lead.getLeadById);
router.put('/:id', authMiddleware, lead.updateLead);
router.delete('/:id', authMiddleware, lead.deleteLead);

module.exports = router;
