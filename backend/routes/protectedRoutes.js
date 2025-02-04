const express = require('express');
const {authenticateJWT, authorizeRole} = require('../middleware/authMiddleware');
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
/*
// 📌 Esempio di API protetta accessibile solo con un JWT valido
router.get('/protected-info', authenticateJWT, (req, res) => {
    res.json({ message: `Ciao ${req.user.username}, hai accesso a questa route protetta!`, role: req.user.role });
});

// Esempio: rotta accessibile solo con permessi >= 3
router.get('/admin', authenticateJWT, authorizeRole(3), (req, res) => {
    res.json({ msg: 'Benvenuto nella sezione admin' });
  });
  */
// 📌 API per ottenere tutti i pazienti
router.get("/patients", authenticateJWT, authorizeRole(5), (req, res) => {
    const query = `
      SELECT
        id,
        nome,
        cognome,
        codiceFiscale,
        CASE WHEN disabilitaId IS NOT NULL THEN 1 ELSE 0 END AS disabled
      FROM patients
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Errore nell'ottenimento dei pazienti:", err.message);
        return res.status(500).json({ error: "Errore nell'ottenimento dei pazienti." });
      }
      res.json({ patients: rows });
    });
  });
  

// Configurazione multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // La cartella in cui salvare i file
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now() + ext);
    }
  });
  const upload = multer({ storage });
  
  // Funzione per generare una password casuale
  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Genera una stringa di 8 caratteri
  };
  
  // API per aggiungere un paziente con possibilità di inserire una foto profilo
  router.post(
    "/aggiungi-paziente",
    authenticateJWT,
    authorizeRole(5),
    upload.single('fotoProfilo'),
    async (req, res) => {
      const {
        nome,
        cognome,
        email,
        dataNascita,
        comuneResidenza,
        indirizzoResidenza,
        codiceFiscale,
        username,
        genere,
        telefono,
        centroDiurnoId
      } = req.body;
      console.log("ok")
      // Controllo che tutti i campi obbligatori siano presenti
      if (
        !nome || !cognome || !email || !dataNascita || !comuneResidenza ||
        !indirizzoResidenza || !codiceFiscale || !username || !genere ||
        !telefono || !centroDiurnoId
      ) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
      }
  
      // Generazione password e hash
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Se viene inviato un file, il campo "fotoProfilo" conterrà il percorso
      const fotoProfilo = req.file ? req.file.path : null;
  
      db.run(
        `INSERT INTO patients 
        (nome, cognome, email, dataNascita, comuneResidenza, indirizzoResidenza, codiceFiscale, username, password, genere, telefono, centroDiurnoId, fotoProfilo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, cognome, email, dataNascita, comuneResidenza, indirizzoResidenza, codiceFiscale, username, hashedPassword, genere, telefono, centroDiurnoId, fotoProfilo],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Errore nell'aggiunta del paziente." });
          }
          res.json({ message: "Paziente aggiunto con successo!", username, password });
        }
      );
    }
  );

// 📌 API per aggiungere o modificare la disabilità di un paziente
router.put("/gestisci-disabilita/:pazienteId", authenticateJWT, authorizeRole(5), (req, res) => {
    const { pazienteId } = req.params;
    const { disabilitaFisiche, disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa } = req.body;

    // Controlla se il paziente ha già una disabilità assegnata
    db.get(`SELECT disabilitaId FROM patients WHERE id = ?`, [pazienteId], (err, patientRow) => {
        if (err) return res.status(500).json({ error: "Errore nel recupero del paziente." });

        const currentDisabilitaId = patientRow ? patientRow.disabilitaId : null;

        // Controlla se esiste già una riga con questi stessi valori nella tabella disabilita
        db.get(
            `SELECT id FROM disabilita WHERE disabilitaFisiche = ? AND disabilitaSensoriali = ? 
            AND disabilitaPsichiche = ? AND assistenzaContinuativa = ?`,
            [disabilitaFisiche, disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa],
            (err, disabilitaRow) => {
                if (err) return res.status(500).json({ error: "Errore nel controllo della disabilità." });

                if (disabilitaRow) {
                    // Se la disabilità esiste già, aggiorna solo il riferimento nel paziente
                    db.run(`UPDATE patients SET disabilitaId = ? WHERE id = ?`, [disabilitaRow.id, pazienteId], (err) => {
                        if (err) return res.status(500).json({ error: "Errore nell'aggiornamento della disabilità." });
                        res.json({ message: "Disabilità aggiornata con una esistente." });
                    });
                } else {
                    // Se la disabilità non esiste, creiamo una nuova entry
                    db.run(
                        `INSERT INTO disabilita (disabilitaFisiche, disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa) 
                        VALUES (?, ?, ?, ?)`,
                        [disabilitaFisiche, disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa],
                        function (err) {
                            if (err) return res.status(500).json({ error: "Errore nella creazione della nuova disabilità." });

                            // Associare la nuova disabilità al paziente
                            db.run(`UPDATE patients SET disabilitaId = ? WHERE id = ?`, [this.lastID, pazienteId], (err) => {
                                if (err) return res.status(500).json({ error: "Errore nel collegamento della disabilità." });
                                res.json({ message: "Nuova disabilità creata e associata al paziente." });
                            });
                        }
                    );
                }
            }
        );
    });
});

module.exports = router;
