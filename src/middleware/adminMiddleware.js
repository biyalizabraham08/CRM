module.exports = (req, res, next) => {
    // This middleware expects authMiddleware to have run first and set req.user
    if (!req.user) {
        return res.status(401).json({ error: 'Access denied. No user information found.' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Requires admin privileges.' });
    }
    
    next();
};
