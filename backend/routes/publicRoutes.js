const express = require('express');
const router = express.Router();

// 📌 Esempio di API pubblica accessibile a tutti
router.get('/public-info', (req, res) => {
    res.json({ message: "Questa è una route pubblica accessibile a tutti." });
});

module.exports = router;
