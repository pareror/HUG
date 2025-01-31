const jwt = require('jsonwebtoken');


function authenticateJWT(req, res, next) {
  // Se usi il token nel header Authorization: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  // Se non c’è il token
  if (!token) {
    return res.status(401).json({ error: 'Nessun token presente' });
  }

  // Verifica il token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token non valido' });
    }
    // Salviamo l’utente decodificato (ruolo, permissionLevel, ecc.)
    req.user = decoded; 
    next();
  });
}

function authorizeRole(minPermission) {
  return (req, res, next) => {
    // Verifichiamo se l’utente ha un livello di permesso sufficiente
    if (req.user && req.user.permissionLevel === minPermission) {
      return next();
    } 
    return res.status(403).json({ error: 'Non hai i permessi per accedere a questa risorsa' });
  };
}

module.exports = { authenticateJWT, authorizeRole };
