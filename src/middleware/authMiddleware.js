const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const authHeader = req.headers['x-auth-token'];
  console.log('Auth Header:', authHeader); // Debugging line

    if (!authHeader) {  
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Debugging line
        res.status(401).json({ error: 'Invalid or expired token.' });
    }   

}