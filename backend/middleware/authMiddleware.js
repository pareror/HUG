const { verifyToken } = require('../utils/jwtUtils');

const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Accesso negato. Nessun token fornito.' });
    }

    try {
        const decoded = await verifyToken(token.split(' ')[1]); // Rimuove "Bearer "
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token non valido' });
    }
};

module.exports = authenticateJWT;
