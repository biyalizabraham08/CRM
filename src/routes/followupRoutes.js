const Router = require ('express').Router();
const followupController = require ('../controllers/followupController');
const authMiddleware = require('../middleware/authMiddleware')

Router.post('/', authMiddleware, followupController.createFollowup);
Router.get('/', authMiddleware, followupController.getAllFollowups);
Router.get('/lead/:id', authMiddleware, followupController.getFollowupsByLead);
Router.get('/:id', authMiddleware, followupController.getAllFollowupsById);
Router.put('/:id', authMiddleware, followupController.updateFollowup);
Router.delete('/:id', authMiddleware, followupController.deleteFollowup);

module.exports = Router;
