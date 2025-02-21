const express = require('express');
const {authenticateJWT, authorizeRole} = require('../middleware/authMiddleware');
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const fs = require("fs");
const process = require("process");

// Configurazione multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "fotoProfilo-" + Date.now() + ext);
  },
});

const upload = multer({ storage });
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

// API GET unificata per il profilo
router.get("/profilo", authenticateJWT, async (req, res) => {
  // Estrae l'ID e il ruolo dall'oggetto req.user, ottenuto dal token JWT
  const userId = req.user.id;
  const role = req.user.role;
  console.log(`📌 Recupero profilo per utente ID: ${userId}, ruolo: ${role}`);

  let sql;
  let params = [userId];

  if (role === "paziente") {
    // Campi per i pazienti (inclusi quelli delle disabilità)
    sql = `
      SELECT id, username, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzoResidenza,
             codiceFiscale, genere, telefono, fotoProfilo, disabilita, disabilitaFisiche, 
             disabilitaSensoriali, disabilitaPsichiche, assistenzaContinuativa, role
      FROM profiles
      WHERE id = ? AND role = 'paziente'
    `;
  } else if (role === "direttorecentro") {
    // Campi per il centro/direttore (campi aziendali inclusi)
    sql = `
      SELECT id, username, comuneDiResidenza, indirizzoResidenza,
             telefono, fotoProfilo, ragioneSociale, pIva, codiceSdi, indirizzo, emailPec, role
      FROM profiles
      WHERE id = ? AND role = 'direttorecentro'
    `;
  } else if (role === "caregiver") {
    // Campi base per i caregiver (modifica se necessario)
    sql = `
      SELECT id, username, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzoResidenza,
             codiceFiscale, genere, telefono, fotoProfilo, role
      FROM profiles
      WHERE id = ? AND role = 'caregiver'
    `;
  } else {
    // Per altri ruoli, puoi scegliere di restituire tutti i campi
    sql = `SELECT * FROM profiles WHERE id = ? AND role = ?`;
    params.push(role);
  }

  db.get(sql, params, (err, profile) => {
    if (err) {
      console.error("❌ Errore SQL nel recupero del profilo:", err.message);
      return res.status(500).json({ error: "Errore nel recupero del profilo." });
    }

    if (!profile) {
      console.error("❌ Profilo non trovato per ID:", userId);
      return res.status(404).json({ error: "Profilo non trovato." });
    }

    // Se il campo fotoProfilo è relativo, lo prefissa con il BACKEND_URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    if (profile.fotoProfilo && profile.fotoProfilo.startsWith("/uploads")) {
      profile.fotoProfilo = backendUrl + profile.fotoProfilo;
    }

    // Se il profilo è di un paziente, recupera anche i contatti di emergenza
    if (role === "paziente") {
      db.all(
        `SELECT ec.id, ec.nome, ec.cognome, ec.telefono, ec.relazione
         FROM emergency_contacts ec
         INNER JOIN patient_emergency_contacts pec ON ec.id = pec.contactId
         WHERE pec.patientId = ?`,
        [userId],
        (err, emergencyContacts) => {
          if (err) {
            console.error("❌ Errore SQL nel recupero dei contatti di emergenza:", err.message);
            return res.status(500).json({ error: "Errore nel recupero dei contatti di emergenza." });
          }
          profile.emergencyContacts = emergencyContacts;
          return res.json({ profile });
        }
      );
    } else {
      console.log("✅ Profilo trovato:", profile);
      return res.json({ profile });
    }
  });
});
// PUT /api/profilo (aggiorna il profilo dell'utente)
router.put("/profilo", authenticateJWT, upload.single("fotoProfilo"), async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  console.log(`📌 Richiesta di aggiornamento profilo per utente ID: ${userId}, ruolo: ${role}`);

  // Esempio: estrai i campi dal body
  // (Se stai usando FormData, i campi sono in req.body, la foto in req.file)
  const {
    // Campi comuni
    username,
    nome,
    cognome,
    dataNascita,
    comuneDiResidenza,
    indirizzoResidenza,
    codiceFiscale,
    genere,
    telefono,
    email,
    // Campi paziente
    disabilita,
    disabilitaFisiche,
    disabilitaSensoriali,
    disabilitaPsichiche,
    assistenzaContinuativa,
    // Campi direttorecentro
    ragioneSociale,
    pIva,
    codiceSdi,
    indirizzo,
    emailPec,
    // Altri eventuali campi
    emergencyContacts, // stringa JSON per i contatti emergenza se paziente
  } = req.body;

  // Gestione foto (se caricata)
  let fotoProfiloPath = null;
  if (req.file) {
    // Se abbiamo caricato un file nuovo
    fotoProfiloPath = "/uploads/" + req.file.filename;
  }

  // Costruisci la query e i parametri in base al ruolo
  let updateQuery = "";
  let params = [];
  
  if (role === "paziente") {
    // Aggiorniamo i campi tipici del paziente
    // Se non vuoi fare un "partial update", puoi costruire dinamicamente la query
    // o usare un set fisso. Esempio di set fisso:
    updateQuery = `
      UPDATE profiles
      SET
        username = ?,
        nome = ?,
        cognome = ?,
        email = ?,
        dataNascita = ?,
        comuneDiResidenza = ?,
        indirizzoResidenza = ?,
        codiceFiscale = ?,
        genere = ?,
        telefono = ?,
        fotoProfilo = COALESCE(?, fotoProfilo),
        disabilita = ?,
        disabilitaFisiche = ?,
        disabilitaSensoriali = ?,
        disabilitaPsichiche = ?,
        assistenzaContinuativa = ?
      WHERE id = ? AND role = 'paziente'
    `;

    params = [
      username || "",
      nome || "",
      cognome || "",
      email || "",
      dataNascita || "",
      comuneDiResidenza || "",
      indirizzoResidenza || "",
      codiceFiscale || "",
      genere || "",
      telefono || "",
      fotoProfiloPath, // Se null, resta invariato (COALESCE)
      disabilita === "true" ? 1 : 0,
      disabilitaFisiche || "0",
      disabilitaSensoriali || "0",
      disabilitaPsichiche || "0",
      assistenzaContinuativa === "true" ? 1 : 0,
      userId,
    ];
  } else if (role === "direttorecentro") {
    // Aggiorniamo i campi tipici del direttore
    updateQuery = `
      UPDATE profiles
      SET
        username = ?,
        comuneDiResidenza = ?,
        indirizzoResidenza = ?,
        telefono = ?,
        fotoProfilo = COALESCE(?, fotoProfilo),
        ragioneSociale = ?,
        pIva = ?,
        codiceSdi = ?,
        indirizzo = ?,
        emailPec = ?
      WHERE id = ? AND role = 'direttorecentro'
    `;
    params = [
      username || "",
      comuneDiResidenza || "",
      indirizzoResidenza || "",
      telefono || "",
      fotoProfiloPath,
      ragioneSociale || "",
      pIva || "",
      codiceSdi || "",
      indirizzo || "",
      emailPec || "",
      userId,
    ];
  } else if (role === "caregiver") {
    // Campi base per i caregiver
    updateQuery = `
      UPDATE profiles
      SET
        username = ?,
        nome = ?,
        cognome = ?,
        email = ?,
        dataNascita = ?,
        comuneDiResidenza = ?,
        indirizzoResidenza = ?,
        codiceFiscale = ?,
        genere = ?,
        telefono = ?,
        fotoProfilo = COALESCE(?, fotoProfilo)
      WHERE id = ? AND role = 'caregiver'
    `;
    params = [
      username || "",
      nome || "",
      cognome || "",
      email || "",
      dataNascita || "",
      comuneDiResidenza || "",
      indirizzoResidenza || "",
      codiceFiscale || "",
      genere || "",
      telefono || "",
      fotoProfiloPath,
      userId,
    ];
  } else {
    // Altri ruoli => decidi tu come gestirli
    return res.status(403).json({ error: "Aggiornamento non previsto per questo ruolo." });
  }

  // Esegui la query di UPDATE
  db.run(updateQuery, params, function (err) {
    if (err) {
      console.error("❌ Errore SQL nell'aggiornamento del profilo:", err.message);
      return res.status(500).json({ error: "Errore durante l'aggiornamento del profilo." });
    }
    console.log("✅ Profilo aggiornato con successo (ruolo:", role, ", ID:", userId, ").");

    // Se l'utente è un paziente e ha inviato emergencyContacts, aggiorniamo la tabella
    if (role === "paziente" && emergencyContacts) {
      try {
        const contactsArray = JSON.parse(emergencyContacts); // stringa JSON
        // Cancella le relazioni precedenti
        db.run(
          `DELETE FROM patient_emergency_contacts WHERE patientId = ?`,
          [userId],
          (delErr) => {
            if (delErr) {
              console.error("❌ Errore eliminando contatti emergenza:", delErr.message);
              return res.status(500).json({ error: "Errore aggiornando i contatti di emergenza." });
            }
            // Per ogni contatto, inseriamo nella tabella emergency_contacts (se non esiste) e creiamo la relazione
            const insertEC = db.prepare(
              `INSERT INTO emergency_contacts (nome, cognome, telefono, relazione) VALUES (?, ?, ?, ?)`
            );
            const linkEC = db.prepare(
              `INSERT INTO patient_emergency_contacts (patientId, contactId) VALUES (?, ?)`
            );

            // Per semplicità, qui creiamo SEMPRE nuovi contatti (non facciamo match su esistenti)
            contactsArray.forEach((c) => {
              insertEC.run([c.nome, c.cognome, c.telefono, c.relazione], function (insErr) {
                if (insErr) {
                  console.error("❌ Errore inserendo contatto emergenza:", insErr.message);
                  // Non facciamo return qui per proseguire con i successivi
                } else {
                  const newContactId = this.lastID;
                  linkEC.run([userId, newContactId]);
                }
              });
            });

            insertEC.finalize();
            linkEC.finalize();

            console.log("✅ Contatti di emergenza aggiornati con successo per paziente ID:", userId);
            return res.json({ message: "Profilo e contatti di emergenza aggiornati con successo!" });
          }
        );
      } catch (parseError) {
        console.error("❌ Errore parsing contatti emergenza:", parseError);
        return res.status(400).json({ error: "Formato contatti di emergenza non valido." });
      }
    } else {
      // Se non è paziente o non abbiamo contatti di emergenza, fine
      return res.json({ message: "Profilo aggiornato con successo!" });
    }
  });
});

router.delete(
    "/profilo/:id",
    authenticateJWT,
    authorizeRole(5), // oppure il ruolo appropriato per autorizzare l'operazione
    async (req, res) => {
      // Prendi l'ID del profilo da eliminare dalla rotta, non da req.user
      const profileId = req.params.id;
      console.log(`📌 Richiesta di eliminazione del profilo per ID: ${profileId}`);
  
      // Esegui la query per eliminare il profilo
      db.run(
        "DELETE FROM profiles WHERE id = ?",
        [profileId],
        function (err) {
          if (err) {
            console.error("❌ Errore durante l'eliminazione del profilo:", err.message);
            return res.status(500).json({ error: "Errore durante l'eliminazione del profilo." });
          }
          // Verifica se qualche record è stato eliminato
          if (this.changes === 0) {
            console.warn("⚠️ Nessun profilo trovato per eliminare con ID:", profileId);
            return res.status(404).json({ error: "Profilo non trovato." });
          }
          console.log("✅ Profilo eliminato con successo.");
          res.json({ message: "Profilo eliminato con successo." });
        }
      );
    }
  );
  
router.get("/patients", authenticateJWT, authorizeRole(5), (req, res) => {
    const centroDiurnoId = req.user.id; // ID estratto dal JWT
    console.log("📌 Centro ID dal JWT:", centroDiurnoId);
    const query = `
      SELECT
        id,
        username,
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

router.post("/aggiungi-paziente",
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
            const fotoProfilo = req.file ? `/uploads/${req.file.filename}` : null;
            console.log("📷 Foto profilo:", fotoProfilo ? fotoProfilo : "Assente");

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
router.post("/aggiungi-contatto-emergenza",
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

router.get("/paziente/:id",
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
  router.put("/paziente/:id",
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
  
  router.get("/caregivers",
    authenticateJWT,
    authorizeRole(5), // Solo i direttori (o chi ha il ruolo corretto) possono accedere
    async (req, res) => {
      console.log("📌 Recupero lista caregiver");
      try {
        db.all(
          `SELECT id, username, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzo, codiceFiscale, genere, telefono, fotoProfilo 
           FROM profiles 
           WHERE role = 'caregiver'`,
          (err, rows) => {
            if (err) {
              console.error("❌ Errore SQL nel recupero dei caregiver:", err.message);
              return res.status(500).json({ error: "Errore nel recupero dei caregiver." });
            }
            console.log("✅ Caregiver recuperati:", rows);
            res.json({ caregivers: rows });
          }
        );
      } catch (error) {
        console.error("❌ Errore generale nel recupero dei caregiver:", error);
        res.status(500).json({ error: "Errore interno del server." });
      }
    }
  );
  
  router.post("/aggiungi-caregiver",
    authenticateJWT,
    authorizeRole(5), // Solo i direttori di centri possono aggiungere caregiver
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
      } = req.body;
  
      // Estrarre centroId dal JWT (ad esempio, il direttore che crea il caregiver)
      const centroId = req.user.id;
      console.log("📌 Centro ID dal JWT:", centroId);
  
      try {
        // Genera un username univoco per il caregiver (implementa la funzione generateUniqueUsername come preferisci)
        console.log("🔹 Generazione username...");
        const username = await generateUniqueUsername(nome, cognome);
        console.log("✅ Username generato:", username);
  
        // Controllo dei campi obbligatori
        const missingFields = [];
        if (!nome) missingFields.push("nome");
        if (!cognome) missingFields.push("cognome");
        if (!dataNascita) missingFields.push("dataNascita");
        if (!comuneDiResidenza) missingFields.push("comuneDiResidenza");
        if (!indirizzo) missingFields.push("indirizzo");
        if (!codiceFiscale) missingFields.push("codiceFiscale");
        if (!genere) missingFields.push("genere");
        if (!telefono) missingFields.push("telefono");
        if (!centroId) missingFields.push("centroId");
  
        if (missingFields.length > 0) {
          console.error("⛔ Campi mancanti:", missingFields);
          return res.status(400).json({
            error: "Tutti i campi obbligatori devono essere compilati.",
            missingFields,
          });
        }
  
        // Genera una password casuale e hashala
        console.log("🔑 Generazione password...");
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Password hashata");
  
        // Se viene caricata una foto, salva il percorso
        const fotoProfilo = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("📷 Foto profilo:", fotoProfilo ? fotoProfilo : "Assente");
  
        // Controlla duplicati (email o codice fiscale già presenti)
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
                duplicateField: existingUser.codiceFiscale === codiceFiscale ? "codiceFiscale" : "email",
              });
            }
  
            // Inseriamo il caregiver nella tabella profiles con ruolo "caregiver"
            console.log("📌 Inserimento del caregiver nel database...");
            db.run(
              `INSERT INTO profiles 
                (username, password, role, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzo, codiceFiscale, telefono, centroDiurnoId, fotoProfilo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                username,
                hashedPassword,
                "caregiver",
                nome,
                cognome,
                email || null,
                dataNascita,
                comuneDiResidenza,
                indirizzo,
                codiceFiscale,
                telefono,
                centroId,
                fotoProfilo,
              ],
              function (err) {
                if (err) {
                  console.error("❌ Errore SQL nell'inserimento:", err.message);
                  if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({
                      error: "Errore di duplicazione: username, email o codice fiscale già presenti.",
                      details: err.message,
                    });
                  }
                  return res.status(500).json({ error: "Errore nell'aggiunta del caregiver." });
                }
                console.log("✅ Caregiver aggiunto con successo:", username);
                res.json({
                  message: "Caregiver aggiunto con successo!",
                  id: this.lastID,
                  username,
                  password,
                });
              }
            );
          }
        );
      } catch (error) {
        console.error("❌ Errore generale:", error);
        res.status(500).json({ error: "Errore durante la registrazione del caregiver." });
      }
    }
  );
  router.get("/caregiver/:id",
    authenticateJWT,
    authorizeRole(5), // Solo gli utenti autorizzati (ad es. direttori) possono vedere i dettagli del caregiver
    async (req, res) => {
      const caregiverId = req.params.id;
      console.log("📌 Recupero dati per il caregiver ID:", caregiverId);
  
      try {
        // Recupera i dati del caregiver dal database
        db.get(
          `SELECT id, nome, cognome, email, dataNascita, comuneDiResidenza, indirizzo, codiceFiscale, genere, telefono, fotoProfilo
           FROM profiles
           WHERE id = ? AND role = 'caregiver'`,
          [caregiverId],
          (err, caregiver) => {
            if (err) {
              console.error("❌ Errore SQL nel recupero del caregiver:", err.message);
              return res.status(500).json({ error: "Errore nel recupero del caregiver." });
            }
  
            if (!caregiver) {
              console.error("❌ Caregiver non trovato con ID:", caregiverId);
              return res.status(404).json({ error: "Caregiver non trovato." });
            }
  
            console.log("✅ Caregiver trovato:", caregiver);
  
            // Se il campo fotoProfilo è presente ed è un percorso relativo, lo prefissa con il dominio del backend.
            const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
            if (caregiver.fotoProfilo && caregiver.fotoProfilo.startsWith("/uploads")) {
              caregiver.fotoProfilo = backendUrl + caregiver.fotoProfilo;
            }
  
            // Restituisci i dati del caregiver
            res.json({ caregiver });
          }
        );
      } catch (error) {
        console.error("❌ Errore generale nel recupero del caregiver:", error);
        res.status(500).json({ error: "Errore interno del server." });
      }
    }
  );
  

  router.put("/caregiver/:id",
    authenticateJWT,
    authorizeRole(5), // Solo utenti autorizzati possono modificare i caregiver
    upload.single("fotoProfilo"), // Gestisce l'upload del file se presente
    async (req, res) => {
      console.log("📥 Dati ricevuti dal frontend:", req.body);
      const caregiverId = req.params.id;
      console.log("📌 Aggiornamento caregiver ID:", caregiverId);
  
      // Estrai i campi inviati dal frontend
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
        removeFotoProfilo, // Flag per indicare la rimozione della foto (es. "true")
      } = req.body;
  
      // Controlla i campi obbligatori
      if (!nome || !cognome) {
        return res.status(400).json({ error: "I campi nome e cognome sono obbligatori." });
      }
  
      // Variabile che conterrà il nuovo valore per fotoProfilo, se aggiornato
      let nuovoPercorsoFoto;
  
      // Se viene caricato un nuovo file, usalo
      if (req.file) {
        nuovoPercorsoFoto = `/uploads/${req.file.filename}`;
      }
      // Altrimenti, se il flag removeFotoProfilo è "true", rimuovi la foto esistente
      else if (removeFotoProfilo === "true") {
        nuovoPercorsoFoto = null;
        // Recupera l'attuale percorso della foto dal database e prova a cancellare il file dal disco
        db.get("SELECT fotoProfilo FROM profiles WHERE id = ?", [caregiverId], (err, row) => {
          if (err) {
            console.error("❌ Errore nel recupero della foto attuale:", err.message);
          }
          if (row && row.fotoProfilo) {
            const filePath = path.join(__dirname, "../", row.fotoProfilo);
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("❌ Errore nella rimozione della foto:", unlinkErr.message);
              } else {
                console.log("✅ Foto rimossa dal disco");
              }
            });
          }
        });
      }
      // Se non viene caricato un nuovo file e non viene inviato il flag, il campo fotoProfilo non verrà aggiornato
  
      // Costruisci la query UPDATE: se è presente nuovoPercorsoFoto (anche se null per rimozione), aggiorna quel campo,
      // altrimenti, esegui una query che non tocca il campo fotoProfilo.
      let sql, params;
      if (req.file || removeFotoProfilo === "true") {
        params = [
          nome,
          cognome,
          email,
          dataNascita,
          comuneDiResidenza,
          indirizzo,
          codiceFiscale,
          genere,
          telefono,
          // Altri eventuali campi, se presenti…
          nuovoPercorsoFoto, // Questo sarà un nuovo percorso oppure null se si rimuove la foto
          caregiverId,
        ];
        sql = `UPDATE profiles
               SET nome = ?,
                   cognome = ?,
                   email = ?,
                   dataNascita = ?,
                   comuneDiResidenza = ?,
                   indirizzo = ?,
                   codiceFiscale = ?,
                   genere = ?,
                   telefono = ?,
                   fotoProfilo = ?
               WHERE id = ? AND role = 'caregiver'`;
      } else {
        // Nessuna modifica alla foto: aggiorna solo gli altri campi
        params = [
          nome,
          cognome,
          email,
          dataNascita,
          comuneDiResidenza,
          indirizzo,
          codiceFiscale,
          genere,
          telefono,
          caregiverId,
        ];
        sql = `UPDATE profiles
               SET nome = ?,
                   cognome = ?,
                   email = ?,
                   dataNascita = ?,
                   comuneDiResidenza = ?,
                   indirizzo = ?,
                   codiceFiscale = ?,
                   genere = ?,
                   telefono = ?
               WHERE id = ? AND role = 'caregiver'`;
      }
  
      db.run(sql, params, function (err) {
        if (err) {
          console.error("❌ Errore SQL durante l'aggiornamento del caregiver:", err.message);
          return res.status(500).json({ error: "Errore durante l'aggiornamento del caregiver." });
        }
        console.log("✅ Caregiver aggiornato con successo.");
        res.json({ message: "Caregiver aggiornato con successo!" });
      });
    }
  );

  router.post("/attivita", authenticateJWT, upload.single("image"), (req, res) => {
    const {
      tipo,
      title: titolo,  // ✅ Ora il backend accetta "title" e lo mappa su "titolo"
      description: descrizione,  
      date: datainizio,  
      time: orainizio,  
      duration: durata,  
      deadline: scadenzaIscrizioni,  
      minParticipants: numeroMinimoPartecipanti,  
      maxParticipants: numeroMassimoPartecipanti,  
      location: luogo,  
      instructor: istruttore  
    } = req.body;
    console.log("dati ricevuti", req.body);
    const BACKEND_URL = process.env.BACKEND_URL;
    const immagine = req.file ? `${BACKEND_URL}/uploads/${req.file.filename}` : null;
    const createdBy = req.user.id;
    const userRole = req.user.role;
  
    // ✅ Verifica il tipo di attività
    if (tipo !== "I" && tipo !== "E") {
      return res.status(400).json({ error: "Tipo di attività non valido. Usa 'I' per interne o 'E' per esterne." });
    }
  
    // ✅ Solo i direttori di centro possono creare attività interne
    if (tipo === "I" && userRole !== "direttorecentro") {
      return res.status(403).json({ error: "Non sei autorizzato a creare attività interne." });
    }
  
    const sql = `
    INSERT INTO activities (
      tipo, titolo, descrizione, datainizio, orainizio, durata, scadenzaIscrizioni,
      numeroMinimoPartecipanti, numeroMassimoPartecipanti, luogo, istruttore, immagine, createdBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    tipo,
    titolo,
    descrizione,
    datainizio,
    orainizio,
    durata,
    scadenzaIscrizioni,
    numeroMinimoPartecipanti,
    numeroMassimoPartecipanti,
    luogo,
    istruttore,
    immagine,
    createdBy,
  ];

  
    db.run(sql, params, function (err) {
      if (err) {
        console.error("❌ Errore durante la creazione dell'attività:", err.message);
        return res.status(500).json({ error: "Errore interno del server." });
      }
      res.status(201).json({ message: "Attività creata con successo!", activityId: this.lastID });
    });
  });
  
  router.get("/attivita", authenticateJWT, (req, res) => {
    const centerId = req.user.id; 
    const tipo = req.query.tipo; // 'I' per interne, 'E' per esterne

    let sql = `
      SELECT 
        a.*, 
        COALESCE(COUNT(ap.patientId), 0) AS numeroIscritti 
      FROM activities a
      LEFT JOIN activity_participants ap ON a.id = ap.activityId
    `;

    const params = [];

    if (tipo === "I") {
        // 🔹 Attività interne → Visibili solo al centro che le ha create
        sql += ` WHERE a.tipo = ? AND a.createdBy = ? `;
        params.push(tipo, centerId);
    } else if (tipo === "E") {
        // 🔹 Attività esterne → Visibili solo se il centro le ha approvate
        sql += `
          LEFT JOIN activity_visibility av 
            ON a.id = av.activityId 
            AND av.centerId = ?
        WHERE a.tipo = ? AND av.visibile = 1
        `;
        params.push(centerId, tipo);
    }

    sql += ` GROUP BY a.id ORDER BY a.datainizio DESC, a.orainizio DESC `;

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("❌ Errore recupero attività:", err.message);
        return res.status(500).json({ error: "Errore interno del server." });
      }
      return res.json({ activities: rows });
    });
});

router.get("/attivita-esterne/gestione", authenticateJWT, authorizeRole(5), (req, res) => {
  const centerId = req.user.id;

  const sql = `
    SELECT a.*, 
           COALESCE(av.visibile, 0) AS visibile
    FROM activities a
    LEFT JOIN activity_visibility av 
      ON a.id = av.activityId 
      AND av.centerId = ?
    WHERE a.tipo = 'E' 
      AND (av.visibile IS NULL OR av.visibile = 0) -- ✅ Mostra solo le attività non visibili
    ORDER BY a.datainizio DESC, a.orainizio DESC
  `;

  db.all(sql, [centerId], (err, rows) => {
    if (err) {
      console.error("❌ Errore nel recupero delle attività da gestire:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    return res.json({ activities: rows });
  });
});

router.put("/attivita-esterna/:id/visibilita", authenticateJWT, (req, res) => {
  const { id } = req.params;  // ID dell'attività
  const { visibile } = req.body;  // Nuovo stato di visibilità (0 o 1)
  const centerId = req.user.id;  // ID del centro che sta effettuando la modifica

  // Controllo input valido
  if (visibile !== 0 && visibile !== 1) {
    return res.status(400).json({ error: "Valore non valido per la visibilità. Deve essere 0 o 1." });
  }

  // Aggiorna solo se la riga esiste già
  const updateSql = `
    UPDATE activity_visibility
    SET visibile = ?
    WHERE activityId = ? AND centerId = ?
  `;

  db.run(updateSql, [visibile, id, centerId], function (err) {
    if (err) {
      console.error("❌ Errore nell'aggiornamento della visibilità:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    // Se non è stata aggiornata nessuna riga, significa che la riga non esiste
    if (this.changes === 0) {
      // Inserisco la nuova riga con visibile impostato a 1 di default
      const insertSql = `
        INSERT INTO activity_visibility (activityId, centerId, visibile)
        VALUES (?, ?, 1)
      `;
      db.run(insertSql, [id, centerId], function (insertErr) {
        if (insertErr) {
          console.error("❌ Errore nell'inserimento della visibilità:", insertErr.message);
          return res.status(500).json({ error: "Errore interno del server durante l'inserimento della visibilità." });
        }
        return res.json({ message: "Visibilità inserita con successo!", visibile: 1 });
      });
    } else {
      return res.json({ message: "Visibilità aggiornata con successo!", visibile });
    }
  });
});


  

router.get("/attivita/:id", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  const { tipo } = req.query; // Tipo passato nella query (es. ?tipo=E o ?tipo=I)
  const userId = req.user.id; // ID dell'utente loggato

  // Assicuriamoci che il tipo sia maiuscolo (I o E)
  const tipoAttivita = tipo ? tipo.toUpperCase() : null;

  // Validazione del tipo di attività
  if (tipoAttivita !== 'I' && tipoAttivita !== 'E') {
    return res.status(400).json({ error: "Tipo di attività non valido. Usa 'I' per interne o 'E' per esterne." });
  }

  // Costruisco la query base
  let sql = `
    SELECT a.*, 
           COALESCE((SELECT COUNT(*) FROM activity_participants WHERE activityId = a.id), 0) AS numeroIscritti
  `;

  // Se l'attività è esterna, aggiungo anche la visibilità (default 0 se non presente)
  if (tipoAttivita === 'E') {
    sql += `,
            COALESCE((SELECT visibile FROM activity_visibility WHERE activityId = a.id AND centerId = ?), 0) AS visibile
    `;
  }

  sql += `
    FROM activities a
    WHERE a.id = ?
    AND a.tipo = ?
    AND (a.tipo = 'E' OR a.createdBy = ?)
  `;

  // Costruisco i parametri in base al tipo di attività
  const params = tipoAttivita === 'E'
    ? [userId, activityId, tipoAttivita, userId]
    : [activityId, tipoAttivita, userId];

  db.get(sql, params, (err, activity) => {
    if (err) {
      console.error("❌ Errore nel recupero dell'attività:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    if (!activity) {
      return res.status(404).json({ error: "Attività non trovata o accesso non autorizzato." });
    }

    res.json({ activity });
  });
});

  
  router.put("/attivita/interna/:id", authenticateJWT, upload.single("image"), (req, res) => {
    const activityId = req.params.id;
    const centerId = req.user.id; // ID del centro dal JWT
  
    const {
      title,
      description,
      date,
      time,
      duration,
      deadline,
      minParticipants,
      maxParticipants,
      location,
      instructor,
    } = req.body;
  
    const BACKEND_URL = process.env.BACKEND_URL;
    const image = req.file ? `${BACKEND_URL}/uploads/${req.file.filename}` : null;
  
    // ✅ Verifica se l'attività esiste e appartiene al centro
    const checkOwnershipQuery = `
      SELECT * FROM activities 
      WHERE id = ? 
      AND tipo = 'I' 
      AND createdBy = ?
    `;
  
    db.get(checkOwnershipQuery, [activityId, centerId], (err, activity) => {
      if (err) {
        console.error("❌ Errore durante la verifica dell'attività:", err.message);
        return res.status(500).json({ error: "Errore interno del server." });
      }
  
      if (!activity) {
        return res.status(404).json({ error: "Attività non trovata o non autorizzato." });
      }
  
      // 🔄 Aggiorna l'attività interna
      const updateQuery = `
        UPDATE activities
        SET 
          titolo = ?, 
          descrizione = ?, 
          datainizio = ?, 
          orainizio = ?, 
          durata = ?, 
          scadenzaIscrizioni = ?, 
          numeroMinimoPartecipanti = ?, 
          numeroMassimoPartecipanti = ?, 
          luogo = ?, 
          istruttore = ?, 
          immagine = COALESCE(?, immagine)
        WHERE id = ? 
        AND tipo = 'I' 
        AND createdBy = ?
      `;
  
      const params = [
        title,
        description,
        date,
        time,
        duration,
        deadline,
        minParticipants,
        maxParticipants,
        location,
        instructor,
        image, // Aggiorna l'immagine solo se è stata caricata una nuova
        activityId,
        centerId,
      ];
  
      db.run(updateQuery, params, function (err) {
        if (err) {
          console.error("❌ Errore durante l'aggiornamento dell'attività interna:", err.message);
          return res.status(500).json({ error: "Errore durante l'aggiornamento dell'attività." });
        }
  
        return res.status(200).json({ message: "Attività interna aggiornata con successo!" });
      });
    });
  });
  

// API per eliminare un'attività interna
router.delete("/attivita/interna/:id", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  const centerId = req.user.id; // ID del centro dal JWT

  // ✅ Verifica se l'attività esiste e appartiene al centro
  const checkOwnershipSQL = `
    SELECT createdBy 
    FROM activities 
    WHERE id = ? AND tipo = 'I'
  `;

  db.get(checkOwnershipSQL, [activityId], (err, row) => {
    if (err) {
      console.error("❌ Errore durante la verifica dell'attività:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    if (!row) {
      return res.status(404).json({ error: "Attività non trovata." });
    }

    if (row.createdBy !== centerId) {
      return res.status(403).json({ error: "Non sei autorizzato a eliminare questa attività." });
    }

    // 🔴 Annullamento delle iscrizioni per pazienti e caregiver prima dell'eliminazione dell'attività
    const deleteParticipantsSQL = `
      DELETE FROM activity_participants
      WHERE activityId = ?
    `;

    db.run(deleteParticipantsSQL, [activityId], function (err) {
      if (err) {
        console.error("❌ Errore durante l'annullamento delle iscrizioni:", err.message);
        return res.status(500).json({ error: "Errore durante l'annullamento delle iscrizioni." });
      }

      // ✅ Dopo aver rimosso le iscrizioni, elimina l'attività
      const deleteActivitySQL = `
        DELETE FROM activities 
        WHERE id = ? AND tipo = 'I'
      `;

      db.run(deleteActivitySQL, [activityId], function (err) {
        if (err) {
          console.error("❌ Errore durante l'eliminazione dell'attività:", err.message);
          return res.status(500).json({ error: "Errore durante l'eliminazione dell'attività." });
        }

        res.status(200).json({ message: "Attività interna e iscrizioni correlate eliminate con successo." });
      });
    });
  });
});


router.get("/attivita/:id/pazienti", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  const centerId = req.user.id; // ✅ ID del centro diurno dal JWT

  const sql = `
    SELECT 
      p.id, 
      p.nome, 
      p.cognome, 
      p.codiceFiscale, 
      p.disabilita,
      CASE WHEN ap.patientId IS NOT NULL THEN 1 ELSE 0 END AS iscritto
    FROM profiles p
    LEFT JOIN activity_participants ap 
      ON p.id = ap.patientId AND ap.activityId = ?
    WHERE p.role = 'paziente' 
      AND p.centroDiurnoId = ? -- ✅ Mostra solo i pazienti registrati dal centro loggato
      AND EXISTS (SELECT 1 FROM activities WHERE id = ?) -- ✅ Verifica che l'attività esista
    ORDER BY iscritto DESC, p.nome ASC
  `;

  db.all(sql, [activityId, centerId, activityId], (err, rows) => {
    if (err) {
      console.error("❌ Errore durante il recupero dei pazienti:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    console.log("✅ Pazienti trovati:", rows);
    res.json(rows);
  });
});



router.get("/attivita/:id/caregiver", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  const centerId = req.user.id; // ✅ ID del centro diurno dal JWT

  const sql = `
    SELECT 
      p.id, 
      p.nome, 
      p.cognome, 
      p.codiceFiscale,
      CASE WHEN ap.patientId IS NOT NULL THEN 1 ELSE 0 END AS iscritto
    FROM profiles p
    LEFT JOIN activity_participants ap 
      ON p.id = ap.patientId AND ap.activityId = ?
    WHERE p.role = 'caregiver' 
      AND p.centroDiurnoId = ? -- ✅ Mostra solo i caregiver registrati dal centro loggato
      AND EXISTS (SELECT 1 FROM activities WHERE id = ?) -- ✅ Verifica che l'attività esista
    ORDER BY iscritto DESC, p.nome ASC
  `;

  db.all(sql, [activityId, centerId, activityId], (err, rows) => {
    if (err) {
      console.error("❌ Errore durante il recupero dei caregiver:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    console.log("✅ Caregiver trovati:", rows);
    res.json(rows);
  });
});

router.post("/attivita/:id/iscrivi", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  const { userId } = req.body;

  const insertQuery = `
    INSERT INTO activity_participants (activityId, patientId)
    VALUES (?, ?)
  `;

  db.run(insertQuery, [activityId, userId], function (err) {
    if (err) {
      console.error("❌ Errore durante l'iscrizione:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    res.status(201).json({ message: "Utente iscritto con successo." });
  });
});


router.delete("/attivita/:id/disiscrivi", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  const { userId } = req.body;

  const deleteQuery = `
    DELETE FROM activity_participants
    WHERE activityId = ? AND patientId = ?
  `;

  db.run(deleteQuery, [activityId, userId], function (err) {
    if (err) {
      console.error("❌ Errore durante la disiscrizione:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }

    res.status(200).json({ message: "Utente disiscritto con successo." });
  });
});


// Endpoint per ottenere il numero di preventivi per una specifica attività esterna
router.get("/attivita/:id/preventivi/count", authenticateJWT, (req, res) => {
  const activityId = req.params.id;

  const sql = "SELECT COUNT(*) AS numeroPreventivi FROM preventivi WHERE idAttivita = ?";
  db.get(sql, [activityId], (err, row) => {
    if (err) {
      console.error("Errore nel recupero dei preventivi per l'attività:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    // row potrebbe essere undefined se non ci sono record, in questo caso restituiamo 0
    const numeroPreventivi = row ? row.numeroPreventivi : 0;
    return res.json({ numeroPreventivi });
  });
});


// Endpoint per ottenere tutti preventivi  per un attività
router.get("/attivita/:id/preventivi", authenticateJWT, (req, res) => {
  const activityId = req.params.id;
  
  const sql = `
    SELECT 
      p.id,
      p.idAttivita,
      p.idTouroperator,
      p.dataPreventivo,
      p.durataViaggio,
      p.partecipantiMinimi,
      p.serviziInclusi,
      p.prezzoPerPersona,
      p.prezzoTotale,
      p.dettagliTrasporto,
      p.itinerario,
      p.note,
      p.luogoPartenza,
      p.luogoArrivo,
      p.accettato,
      pr.ragioneSociale AS nomeTouroperator
    FROM preventivi p
    LEFT JOIN profiles pr ON p.idTouroperator = pr.id
    WHERE p.idAttivita = ?
  `;
  
  db.all(sql, [activityId], (err, rows) => {
    if (err) {
      console.error("Errore nel recupero dei preventivi per l'attività:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    return res.json({ preventivi: rows });
  });
});

// Endpoint per ottenere i dettagli di un preventivo per un'attività specifica
router.get("/preventivi/:idPreventivo", authenticateJWT, (req, res) => {
  const idPreventivo = req.params.idPreventivo;
  
  const sql = `
    SELECT 
      p.id,
      a.titolo AS titoloAttivita,
      pr.ragioneSociale,
      p.dataPreventivo,
      p.durataViaggio,
      p.partecipantiMinimi AS numPartecipanti,
      p.serviziInclusi,
      p.prezzoPerPersona,
      p.prezzoTotale,
      p.dettagliTrasporto,
      p.itinerario,
      p.note,
      p.luogoPartenza,
      p.luogoArrivo,
      p.accettato
    FROM preventivi p
    LEFT JOIN profiles pr ON p.idTouroperator = pr.id
    LEFT JOIN activities a ON p.idAttivita = a.id
    WHERE p.id = ?
  `;
  
  db.get(sql, [idPreventivo], (err, row) => {
    if (err) {
      console.error("Errore nel recupero del preventivo:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    if (!row) {
      return res.status(404).json({ error: "Preventivo non trovato." });
    }
    
    // Prova a convertire i campi 'serviziInclusi' e 'itinerario' in array.
    // Se sono salvati come JSON, li parse; altrimenti, li split su newline.
    try {
      row.servizi = JSON.parse(row.serviziInclusi);
    } catch (e) {
      row.servizi = row.serviziInclusi ? row.serviziInclusi.split("\n") : [];
    }
    
    try {
      row.itinerario = JSON.parse(row.itinerario);
    } catch (e) {
      row.itinerario = row.itinerario ? row.itinerario.split("\n") : [];
    }
    
    // Rimuovi il campo originale se non necessario
    delete row.serviziInclusi;
    
    return res.json({ preventivo: row });
  });
});

// Endpoint per accettare un preventivo (imposta accettato = 1)
router.put("/preventivi/:id/accetta", authenticateJWT, (req, res) => {
  const idPreventivo = req.params.id;
  const sql = "UPDATE preventivi SET accettato = 1 WHERE id = ?";
  
  db.run(sql, [idPreventivo], function(err) {
    if (err) {
      console.error("Errore durante l'accettazione del preventivo:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    return res.json({ message: "Preventivo accettato con successo." });
  });
});

// Endpoint per annullare l'accettazione del preventivo (imposta accettato = 0)
router.put("/preventivi/:id/annulla", authenticateJWT, (req, res) => {
  const idPreventivo = req.params.id;
  const sql = "UPDATE preventivi SET accettato = 0 WHERE id = ?";
  
  db.run(sql, [idPreventivo], function(err) {
    if (err) {
      console.error("Errore durante l'annullamento dell'accettazione del preventivo:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    return res.json({ message: "Accettazione del preventivo annullata con successo." });
  });
});

// Endpoint per ottenere lo stato di accettazione di un preventivo
router.get("/preventivi/:id/accettazione", authenticateJWT, (req, res) => {
  const idPreventivo = req.params.id;
  const sql = "SELECT accettato FROM preventivi WHERE id = ?";
  
  db.get(sql, [idPreventivo], (err, row) => {
    if (err) {
      console.error("Errore nel recupero dello stato di accettazione:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    if (!row) {
      return res.status(404).json({ error: "Preventivo non trovato." });
    }
    return res.json({ accettato: row.accettato });
  });
});

//lista pazienti pagina pagamento per paziente
router.get("/pazienti/stats", authenticateJWT, (req, res) => {
  const centerId = req.user.id;
  const sql = `
    SELECT 
      p.id, 
      p.nome, 
      p.cognome,
      COALESCE(ap_stats.numeroAttivita, 0) AS numeroAttivita,
      COALESCE(ap_stats.listaAttivita, '') AS listaAttivita,
      COALESCE(ap_stats.totaleSpesa, 0) AS totaleSpesa,
      COALESCE(ap_stats.totaleDaPagare, 0) AS totaleDaPagare
    FROM profiles p
    LEFT JOIN (
      SELECT 
        ap.patientId,
        COUNT(DISTINCT ap.activityId) AS numeroAttivita,
        GROUP_CONCAT(DISTINCT ap.activityId) AS listaAttivita,
        SUM(
          CASE 
            WHEN a.tipo = 'E' THEN IFNULL(a.costo, 0) + IFNULL(pr.prezzoPerPersona, 0)
            ELSE 0
          END
        ) AS totaleSpesa,
        SUM(
          CASE 
            WHEN a.tipo = 'E' AND ap.saldato = 0 THEN IFNULL(a.costo, 0) + IFNULL(pr.prezzoPerPersona, 0)
            ELSE 0
          END
        ) AS totaleDaPagare
      FROM activity_participants ap
      JOIN activities a ON a.id = ap.activityId
      LEFT JOIN preventivi pr ON a.id = pr.idAttivita AND pr.accettato = 1
      GROUP BY ap.patientId
    ) AS ap_stats ON p.id = ap_stats.patientId
    WHERE p.role = 'paziente'
      AND p.centroDiurnoId = ?
  `;

  db.all(sql, [centerId], (err, rows) => {
    if (err) {
      console.error("❌ Errore durante il recupero dei dati dei pazienti:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    // Debug: stampa la lista delle attività per ciascun paziente
    rows.forEach(row => {
      console.log(`Paziente ID ${row.id} - Attività: ${row.listaAttivita}`);
    });
    res.json({ patients: rows });
  });
});



router.get("/pazienti/:id/payments", authenticateJWT, (req, res) => {
  const patientId = req.params.id;
  const sql = `
    SELECT 
      p.nome || ' ' || p.cognome AS patientName,
      a.titolo AS activity,
      a.datainizio AS date,
      CASE 
        WHEN a.tipo = 'E' THEN IFNULL(a.costo, 0) + IFNULL(pr.prezzoPerPersona, 0)
        ELSE 0
      END AS amount,
      CASE 
        WHEN ap.saldato = 1 THEN 'paid'
        ELSE 'pending'
      END AS status,
      ap.paymentDate,
      a.id AS activityId
    FROM activity_participants ap
    JOIN activities a ON a.id = ap.activityId
    JOIN profiles p ON p.id = ap.patientId
    LEFT JOIN preventivi pr ON a.id = pr.idAttivita AND pr.accettato = 1
    WHERE ap.patientId = ?
    ORDER BY CASE WHEN ap.saldato = 1 THEN 1 ELSE 0 END, a.datainizio DESC
  `;

  db.all(sql, [patientId], (err, rows) => {
    if (err) {
      console.error("Errore nel recupero dei pagamenti per il paziente:", err.message);
      return res.status(500).json({ error: "Errore interno del server." });
    }
    res.json({ payments: rows });
  });
});


//api per segnare se il paziente ha pagato
router.put("/pazienti/:patientId/payments/:activityId", authenticateJWT, (req, res) => {
  const { patientId, activityId } = req.params;
  // Se il frontend invia una data di pagamento, la usa; altrimenti, usa la data corrente in formato YYYY-MM-DD
  const paymentDate = req.body.paymentDate || new Date().toISOString().slice(0, 10);

  const sql = `
    UPDATE activity_participants
    SET saldato = 1, paymentDate = ?
    WHERE patientId = ? AND activityId = ?
  `;

  db.run(sql, [paymentDate, patientId, activityId], function(err) {
    if (err) {
      console.error("Errore nel registrare il pagamento:", err.message);
      return res.status(500).json({ error: "Errore interno del server" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Pagamento non registrato. Record non trovato." });
    }
    res.json({ message: "Pagamento registrato correttamente" });
  });
});

  module.exports = router;