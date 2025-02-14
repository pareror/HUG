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
  
const SALT_ROUNDS = 10;

// Endpoint per il force-change-password
router.put("/force-change-password/:userId", authenticateJWT, (req, res) => {
  const centerId = req.user.id; // ID del centro diurno autenticato
  const { userId } = req.params; // ID del profilo (paziente o caregiver) a cui cambiare la password
  const { newPassword, confirmNewPassword } = req.body; // Nuova password e conferma

  // Controllo che entrambe le password siano fornite
  if (!newPassword || !confirmNewPassword) {
    return res.status(400).json({ error: "È richiesta la nuova password e la sua conferma." });
  }

  // Controllo che le due password coincidano
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "Le password non coincidono." });
  }

  // Verifica che il profilo appartenga al centro diurno autenticato
  // e che il ruolo sia "paziente" o "caregiver"
  const query = "SELECT id FROM profiles WHERE id = ? AND centroDiurnoId = ? AND role IN ('paziente', 'caregiver')";
  db.get(query, [userId, centerId], (err, row) => {
    if (err) {
      console.error("Errore nel recupero del profilo:", err);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    if (!row) {
      return res.status(403).json({ error: "Non autorizzato a modificare la password di questo utente." });
    }

    // Hash della nuova password
    bcrypt.hash(newPassword, SALT_ROUNDS, (err, hash) => {
      if (err) {
        console.error("Errore nell'hashing della password:", err);
        return res.status(500).json({ error: "Errore interno del server." });
      }

      // Aggiorna la password nel database (tabella "profiles")
      const updateQuery = "UPDATE profiles SET password = ? WHERE id = ?";
      db.run(updateQuery, [hash, userId], function (err) {
        if (err) {
          console.error("Errore nell'aggiornamento della password:", err);
          return res.status(500).json({ error: "Errore nell'aggiornamento della password." });
        }
        return res.json({ message: "Password aggiornata con successo." });
      });
    });
  });
});



module.exports = router;
