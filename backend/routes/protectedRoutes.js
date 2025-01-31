const express = require('express');
const {authenticateJWT, authorizeRole} = require('../middleware/authMiddleware');
const router = express.Router();

// 📌 Esempio di API protetta accessibile solo con un JWT valido
router.get('/protected-info', authenticateJWT, (req, res) => {
    res.json({ message: `Ciao ${req.user.username}, hai accesso a questa route protetta!`, role: req.user.role });
});

// 📌 Route accessibile solo a utenti con permesso = 3
router.get('/high-level-info', authenticateJWT, (req, res) => {
    if (req.user.permissionLevel === 3) {
        return res.status(403).json({ error: "Accesso negato. Permessi insufficienti." });
    }
    res.json({ message: `Benvenuto, ${req.user.username}! Hai accesso alle informazioni di livello alto.` });
});

// Esempio: rotta accessibile solo con permessi >= 3
router.get('/admin', authenticateJWT, authorizeRole(3), (req, res) => {
    res.json({ msg: 'Benvenuto nella sezione admin' });
  });
module.exports = router;
