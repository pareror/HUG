const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require('../config/db');
const { authenticateJWT } = require("../middleware/authMiddleware");


// 📌 Esempio di API pubblica accessibile a tutti
router.get('/public-info', (req, res) => {
    res.json({ message: "Questa è una route pubblica accessibile a tutti." });
});


router.post("/change-password", authenticateJWT, async (req, res) => {
    try {
      // Estrarre l'ID dell'utente dal JWT (req.user.id) e i campi dal body
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Campi mancanti." });
      }
  
      // 1. Recupera l'utente dal DB
      db.get(
        "SELECT id, password FROM profiles WHERE id = ?",
        [userId],
        async (err, user) => {
          if (err) {
            console.error("Errore DB:", err);
            return res.status(500).json({ error: "Errore del server." });
          }
          if (!user) {
            return res.status(404).json({ error: "Utente non trovato." });
          }
  
          // 2. Confronta oldPassword con la password salvata
          const passwordMatch = await bcrypt.compare(oldPassword, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: "La password attuale non è corretta." });
          }
  
          // 3. Hasha la nuova password
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
          // 4. Aggiorna la password nel DB
          db.run(
            "UPDATE profiles SET password = ? WHERE id = ?",
            [hashedNewPassword, userId],
            (updateErr) => {
              if (updateErr) {
                console.error("Errore DB nell'aggiornamento:", updateErr);
                return res.status(500).json({ error: "Errore durante l'aggiornamento della password." });
              }
  
              console.log(`Password aggiornata con successo per l'utente ID ${userId}.`);
              return res.json({ message: "Password aggiornata con successo!" });
            }
          );
        }
      );
    } catch (err) {
      console.error("Errore generale:", err);
      return res.status(500).json({ error: "Errore interno del server." });
    }
  });
  
module.exports = router;
