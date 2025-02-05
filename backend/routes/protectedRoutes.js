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
    const centroDiurnoId = req.user.id; // ID estratto dal JWT
    console.log("📌 Centro ID dal JWT:", centroDiurnoId);
    const query = `
      SELECT
        id,
        nome,
        cognome,
        codiceFiscale,
        disabilita
      FROM profiles
      WHERE role = 'paziente' AND centroDiurnoId = ?
    `;

    db.all(query, [centroDiurnoId], (err, rows) => {
      if (err) {
        console.error("❌ Errore nell'ottenimento dei pazienti:", err.message);
        return res.status(500).json({ error: "Errore nell'ottenimento dei pazienti." });
      }
      res.json({ patients: rows });
    });
});

// Configurazione multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../uploads/'); // La cartella in cui salvare i file
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now() + ext);
    }
  });
  const upload = multer({ storage });
  
// 📌 Funzione per generare username univoco con Promise
const generateUniqueUsername = (nome, cognome) => {
    return new Promise((resolve, reject) => {
        if (!nome || !cognome) return reject(new Error("Nome o cognome mancanti"));

        const firstName = nome.split(" ")[0].toLowerCase(); // Prendiamo solo il primo nome
        const lastName = cognome.toLowerCase();
        const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5 cifre casuali
        const username = `${firstName}.${lastName}.${randomNumber}`;

        // Controlliamo se l'username esiste già
        db.get("SELECT id FROM profiles WHERE username = ?", [username], (err, row) => {
            if (err) return reject(err);

            if (row) {
                // Se l'username esiste, rigeneriamo
                return resolve(generateUniqueUsername(nome, cognome));
            }

            // Se è unico, lo restituiamo
            resolve(username);
        });
    });
};

router.post(
    "/aggiungi-paziente",
    authenticateJWT,
    authorizeRole(5), // Solo i direttori di centri possono aggiungere pazienti
    upload.single("fotoProfilo"),
    async (req, res) => {
        console.log("📥 Dati ricevuti dal frontend:", req.body);

        const {
            nome,
            cognome,
            email,
            dataNascita,
            comuneDiResidenza,
            indirizzo,
            codiceFiscale,
            genere,
            telefono,
            disabilita, 
            disabilitaFisiche,
            disabilitaSensoriali,
            disabilitaPsichiche,
            assistenzaContinuativa
        } = req.body;

        // 📌 Estrarre centroDiurnoId dal JWT
        const centroDiurnoId = req.user.id;
        console.log("📌 Centro ID dal JWT:", centroDiurnoId);

        try {
            // 📌 Generiamo PRIMA l'username univoco
            console.log("🔹 Generazione username...");
            const username = await generateUniqueUsername(nome, cognome);
            console.log("✅ Username generato:", username);

            // 📌 Controllo campi obbligatori
            const missingFields = [];
            if (!nome) missingFields.push("nome");
            if (!cognome) missingFields.push("cognome");
            if (!dataNascita) missingFields.push("dataNascita");
            if (!comuneDiResidenza) missingFields.push("comuneDiResidenza");
            if (!indirizzo) missingFields.push("indirizzo");
            if (!codiceFiscale) missingFields.push("codiceFiscale");
            if (!genere) missingFields.push("genere");
            if (!telefono) missingFields.push("telefono");
            if (!centroDiurnoId) missingFields.push("centroDiurnoId");

            if (missingFields.length > 0) {
                console.error("⛔ Campi mancanti:", missingFields);
                return res.status(400).json({
                    error: "Tutti i campi obbligatori devono essere compilati.",
                    missingFields
                });
            }

            // 📌 Imposta le disabilità in base alla checkbox
            const isDisabled = disabilita === "true"; // Converti la stringa in booleano
            const disabilitaFisicheValue = isDisabled ? parseInt(disabilitaFisiche, 10) : 0;
            const disabilitaSensorialiValue = isDisabled ? parseInt(disabilitaSensoriali, 10) : 0;
            const disabilitaPsichicheValue = isDisabled ? parseInt(disabilitaPsichiche, 10) : 0;
            const assistenzaContinuativaValue = isDisabled ? (assistenzaContinuativa === "true" ? 1 : 0) : 0;

            console.log("📌 Stato delle disabilità:", {
                disabilitaFisiche: disabilitaFisicheValue,
                disabilitaSensoriali: disabilitaSensorialiValue,
                disabilitaPsichiche: disabilitaPsichicheValue,
                assistenzaContinuativa: assistenzaContinuativaValue,
            });

            // 📌 Generazione password hashata
            console.log("🔑 Generazione password...");
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("✅ Password hashata");

            // 📌 Se viene caricata una foto, salva il percorso
            const fotoProfilo = req.file ? req.file.path : null;
            console.log("📷 Foto profilo:", fotoProfilo ? "Presente" : "Assente");

            // 📌 Controlliamo se esiste già un paziente con lo stesso codice fiscale o email
            console.log("🔍 Controllo duplicati...");
            db.get(
                "SELECT id FROM profiles WHERE codiceFiscale = ? OR email = ?",
                [codiceFiscale, email],
                (err, existingUser) => {
                    if (err) {
                        console.error("❌ Errore SQL durante il controllo duplicati:", err.message);
                        return res.status(500).json({ error: "Errore nel controllo del database." });
                    }

                    if (existingUser) {
                        console.error("❌ Errore: Codice fiscale o email già registrata.");
                        return res.status(400).json({
                            error: "Codice fiscale o email già registrata.",
                            duplicateField: existingUser.codiceFiscale === codiceFiscale ? "codiceFiscale" : "email"
                        });
                    }

                    // 📌 Inseriamo il paziente nella tabella utenti
                    console.log("📌 Inserimento del paziente nel database...");
                    db.run(
                        `INSERT INTO profiles 
                        (username, password, role, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzo, codiceFiscale, telefono, centroDiurnoId, fotoProfilo, disabilita,
                         disabilitaFisiche, disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                        [username, hashedPassword, "paziente", nome, cognome, email || null, dataNascita, comuneDiResidenza, indirizzo, codiceFiscale, telefono, centroDiurnoId, fotoProfilo, 
                        isDisabled, disabilitaFisicheValue, disabilitaSensorialiValue, disabilitaPsichicheValue, assistenzaContinuativaValue],

                        function (err) {
                            if (err) {
                                console.error("❌ Errore SQL nell'inserimento:", err.message);

                                // Controlliamo errori di UNIQUE (username, email, codice fiscale duplicati)
                                if (err.message.includes("UNIQUE constraint failed")) {
                                    return res.status(400).json({
                                        error: "Errore di duplicazione: username, email o codice fiscale già presenti.",
                                        details: err.message
                                    });
                                }

                                return res.status(500).json({ error: "Errore nell'aggiunta del paziente." });
                            }

                            console.log("✅ Paziente aggiunto con successo:", username);
                            res.json({
                                message: "Paziente aggiunto con successo!",
                                id: this.lastID,
                                username,
                                password
                            });
                        }
                    );
                }
            );
        } catch (error) {
            console.error("❌ Errore generale:", error);
            res.status(500).json({ error: "Errore durante la registrazione del paziente." });
        }
    }
);
router.post(
    "/aggiungi-contatto-emergenza",
    authenticateJWT,
    authorizeRole(5), // Solo i direttori di centri possono aggiungere contatti di emergenza
    async (req, res) => {
        console.log("📥 Dati ricevuti dal frontend:", req.body);

        const { patientId, nome, cognome, telefono, relazione } = req.body;

        // Controllo dei campi obbligatori
        if (!patientId || !nome || !cognome || !telefono || !relazione) {
            return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
        }

        try {
            // Inseriamo sempre un nuovo contatto senza verificare se esiste già
            db.run(
                `INSERT INTO emergency_contacts (nome, cognome, telefono, relazione) VALUES (?, ?, ?, ?)`,
                [nome, cognome, telefono, relazione],
                function (err) {
                    if (err) {
                        console.error("❌ Errore nella creazione del contatto di emergenza:", err.message);
                        return res.status(500).json({ error: "Errore nella creazione del contatto di emergenza." });
                    }

                    const newContactId = this.lastID; // ID del contatto appena creato

                    // Ora associamo il nuovo contatto al paziente
                    db.run(
                        `INSERT INTO patient_emergency_contacts (patientId, contactId) VALUES (?, ?)`,
                        [patientId, newContactId],
                        function (err) {
                            if (err) {
                                console.error("❌ Errore nell'associazione contatto-paziente:", err.message);
                                return res.status(500).json({ error: "Errore nell'associazione del contatto di emergenza." });
                            }

                            console.log("✅ Contatto di emergenza aggiunto e associato al paziente.");
                            res.json({ message: "Contatto di emergenza aggiunto con successo!", contactId: newContactId });
                        }
                    );
                }
            );
        } catch (error) {
            console.error("❌ Errore generale:", error);
            res.status(500).json({ error: "Errore nell'aggiunta del contatto di emergenza." });
        }
    }
);

router.get(
    "/paziente/:id",
    authenticateJWT,
    authorizeRole(5), // Solo i direttori possono vedere i dettagli del paziente
    async (req, res) => {
      const patientId = req.params.id;
      console.log("📌 Recupero dati per il paziente ID:", patientId);
  
      try {
        // 1️⃣ Recupera i dati del paziente
        db.get(
          `SELECT id, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzo, codiceFiscale, genere, telefono, 
                  fotoProfilo, disabilita, disabilitaFisiche, disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa 
           FROM profiles WHERE id = ? AND role = 'paziente'`,
          [patientId],
          (err, patient) => {
            if (err) {
              console.error("❌ Errore SQL nel recupero del paziente:", err.message);
              return res.status(500).json({ error: "Errore nel recupero del paziente." });
            }
  
            if (!patient) {
              console.error("❌ Paziente non trovato con ID:", patientId);
              return res.status(404).json({ error: "Paziente non trovato." });
            }
  
            console.log("✅ Paziente trovato:", patient);
  
            // 2️⃣ Recupera i contatti di emergenza associati
            db.all(
              `SELECT ec.id, ec.nome, ec.cognome, ec.telefono, ec.relazione
               FROM emergency_contacts ec
               INNER JOIN patient_emergency_contacts pec ON ec.id = pec.contactId
               WHERE pec.patientId = ?`,
              [patientId],
              (err, emergencyContacts) => {
                if (err) {
                  console.error("❌ Errore SQL nel recupero dei contatti di emergenza:", err.message);
                  return res.status(500).json({ error: "Errore nel recupero dei contatti di emergenza." });
                }
  
                console.log("✅ Contatti di emergenza trovati:", emergencyContacts);
  
                // 3️⃣ Ritorna i dati del paziente con i contatti di emergenza
                res.json({
                  patient,
                  emergencyContacts: emergencyContacts.length > 0 ? emergencyContacts : [],
                });
              }
            );
          }
        );
      } catch (error) {
        console.error("❌ Errore generale nel recupero del paziente:", error);
        res.status(500).json({ error: "Errore interno del server." });
      }
    }
  );  
  router.put(
    "/paziente/:id",
    authenticateJWT,
    authorizeRole(5),
    upload.none(),
    async (req, res) => {
      console.log("📥 Dati ricevuti dal frontend:", req.body);
  
      const patientId = req.params.id;
      console.log("📌 Aggiornamento paziente ID:", patientId);
  
      const {
        nome,
        cognome,
        email,
        dataNascita,
        comuneDiResidenza,
        indirizzo,
        codiceFiscale,
        genere,
        telefono,
        disabilita,
        disabilitaFisiche,
        disabilitaSensoriali,
        disabilitaPsichiche,
        assistenzaContinuativa,
        emergencyContacts
      } = req.body;
  
      console.log("📥 Contatti ricevuti:", emergencyContacts);
  
      if (!nome || !cognome) {
        return res.status(400).json({ error: "I campi nome e cognome sono obbligatori." });
      }
  
      const params = [
        nome,
        cognome,
        email,
        dataNascita,
        comuneDiResidenza,
        indirizzo,
        codiceFiscale,
        genere,
        telefono,
        disabilita === "1" ? 1 : 0,
        disabilitaFisiche || "0",
        disabilitaSensoriali || "0",
        disabilitaPsichiche || "0",
        assistenzaContinuativa === "1" ? 1 : 0,
        patientId
      ];
  
      db.serialize(() => {
        // **Aggiorna i dati del paziente**
        db.run(
          `UPDATE profiles
           SET nome = ?, cognome = ?, email = ?, dataNascita = ?, comuneDiResidenza = ?, 
               indirizzo = ?, codiceFiscale = ?, genere = ?, telefono = ?, 
               disabilita = ?, disabilitaFisiche = ?, disabilitaSensoriali = ?, 
               disabilitaPsichiche = ?, assistenzaContinuativa = ?
           WHERE id = ?`,
          params,
          function (err) {
            if (err) {
              console.error("❌ Errore SQL:", err.message);
              return res.status(500).json({ error: "Errore durante l'aggiornamento del paziente." });
            }
  
            console.log("✅ Paziente aggiornato con successo.");
  
            if (emergencyContacts) {
              try {
                const contactsArray = JSON.parse(emergencyContacts);
  
                // **Elimina solo le relazioni dalla tabella patient_emergency_contacts**
                db.run(`DELETE FROM patient_emergency_contacts WHERE patientId = ?`, [patientId], (deleteErr) => {
                  if (deleteErr) {
                    console.error("❌ Errore eliminando relazioni esistenti:", deleteErr.message);
                    return res.status(500).json({ error: "Errore durante l'aggiornamento dei contatti di emergenza." });
                  }
  
                  const insertStmt = db.prepare(
                    `INSERT INTO emergency_contacts (nome, cognome, telefono, relazione) 
                     VALUES (?, ?, ?, ?)`
                  );
  
                  const linkStmt = db.prepare(
                    `INSERT INTO patient_emergency_contacts (patientId, contactId) VALUES (?, ?)`
                  );
  
                  contactsArray.forEach(contact => {
                    db.get(
                      `SELECT id FROM emergency_contacts WHERE nome = ? AND cognome = ? AND telefono = ?`,
                      [contact.nome, contact.cognome, contact.telefono],
                      (err, row) => {
                        if (err) {
                          console.error("❌ Errore nel controllo esistenza contatto:", err);
                          return;
                        }
  
                        if (row) {
                          console.log(`🔁 Contatto già esistente: ${contact.nome} ${contact.cognome}`);
                          linkStmt.run([patientId, row.id]);
                        } else {
                          insertStmt.run([contact.nome, contact.cognome, contact.telefono, contact.relazione], function () {
                            console.log(`✅ Contatto creato: ${contact.nome} ${contact.cognome}`);
                            linkStmt.run([patientId, this.lastID]); // Collega il nuovo contatto al paziente
                          });
                        }
                      }
                    );
                  });
  
                
  
                  console.log("✅ Contatti di emergenza aggiornati con successo.");
                  res.json({ message: "Paziente e contatti di emergenza aggiornati con successo!" });
                });
              } catch (parseError) {
                console.error("❌ Errore nel parsing dei contatti:", parseError);
                return res.status(400).json({ error: "Formato contatti di emergenza non valido." });
              }
            } else {
              res.json({ message: "Paziente aggiornato con successo!" });
            }
          }
        );
      });
    }
  );
  
  
  
  module.exports = router;