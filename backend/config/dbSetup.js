const db = require('./db'); // Importa la connessione al database

const createProfilesTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('paziente', 'direttorecentro', 'caregiver', 'touroperator', 'enteesterno')),
      
      -- Campi per il profilo "paziente"
      nome TEXT,
      cognome TEXT,
      email TEXT UNIQUE,
      dataNascita DATE,
      comuneDiResidenza TEXT,
      indirizzoResidenza TEXT,
      codiceFiscale TEXT UNIQUE,
      genere TEXT CHECK(genere IN ('M', 'F', 'Altro')),
      telefono TEXT,
      fotoProfilo TEXT,
      
      -- Se il profilo è di un paziente che opera in un centro (o per indicare il centro di riferimento)
      centroDiurnoId INTEGER,
      
      -- Campi per profili aziendali / enti (usati per direttore, touroperator, enteesterno)
      ragioneSociale TEXT,
      pIva TEXT,
      codiceSdi TEXT,
      indirizzo TEXT,
      emailPec TEXT,
      
      -- Campi per le disabilità (applicabili, per esempio, ai pazienti)
      disabilita INTEGER CHECK(disabilita IN (0, 1)) DEFAULT 0,
      disabilitaFisiche INTEGER CHECK(disabilitaFisiche BETWEEN 0 AND 5) DEFAULT 0,
      disabilitaSensoriali INTEGER CHECK(disabilitaSensoriali BETWEEN 0 AND 5) DEFAULT 0,
      disabilitaPsichiche INTEGER CHECK(disabilitaPsichiche BETWEEN 0 AND 5) DEFAULT 0,
      assistenzaContinuativa INTEGER CHECK(assistenzaContinuativa BETWEEN 0 AND 1) DEFAULT 0,
      
      FOREIGN KEY (centroDiurnoId) REFERENCES profiles(id) ON DELETE SET NULL
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'profiles':", err.message);
      } else {
        console.log("✅ Tabella 'profiles' creata con successo.");
      }
    }
  );
};

// 🔹 **Tabella per i contatti di emergenza**
const createEmergencyContactsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cognome TEXT NOT NULL,
      telefono TEXT NOT NULL,
      relazione TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'emergency_contacts':", err.message);
      } else {
        console.log("✅ Tabella 'emergency_contacts' creata con successo.");
      }
    }
  );
};

// 🔹 **Tabella di associazione tra pazienti e contatti di emergenza**
const createPatientEmergencyContactsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS patient_emergency_contacts (
      patientId INTEGER,
      contactId INTEGER,
      PRIMARY KEY (patientId, contactId),
      FOREIGN KEY (patientId) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (contactId) REFERENCES emergency_contacts(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'patient_emergency_contacts':", err.message);
      } else {
        console.log("✅ Tabella 'patient_emergency_contacts' creata con successo.");
      }
    }
  );
};
const createActivitiesTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL CHECK (tipo IN ('I', 'E')), -- I = Interna, E = Esterna
      titolo TEXT NOT NULL,
      descrizione TEXT,
      datainizio DATE NOT NULL,
      orainizio TEXT NOT NULL,
      durata INTEGER, -- Durata in minuti
      scadenzaIscrizioni DATE,
      numeroMinimoPartecipanti INTEGER,
      numeroMassimoPartecipanti INTEGER,
      luogo TEXT,
      istruttore TEXT,
      immagine TEXT,
      createdBy INTEGER,
      FOREIGN KEY (createdBy) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'activities':", err.message);
      } else {
        console.log("✅ Tabella 'activities' creata con successo.");
      }
    }
  );
};

const createActivityParticipantsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS activity_participants (
      activityId INTEGER NOT NULL,  -- ID dell'attività
      patientId INTEGER NOT NULL,   -- ID del paziente

      -- Chiave primaria composta per evitare duplicati
      PRIMARY KEY (activityId, patientId),

      -- Chiave esterna verso la tabella 'internal_activities'
      FOREIGN KEY (activityId) REFERENCES internal_activities(id) ON DELETE CASCADE,

      -- Chiave esterna verso la tabella 'profiles'
      FOREIGN KEY (patientId) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'activity_participants':", err.message);
      } else {
        console.log("✅ Tabella 'activity_participants' creata con successo.");
      }
    }
  );
};


const aggiungiAttivitaEsterneFittizie = () => {
  const attività = [
    {
      titolo: "Esplorazione Archeologica",
      descrizione: "Un viaggio nel tempo tra le meraviglie dell'antico Egitto.",
      datainizio: "2025-05-01",
      orainizio: "10:00",
      durata: 2,
      scadenzaIscrizioni: "2025-04-30",
      numeroMinimoPartecipanti: 8,
      numeroMassimoPartecipanti: 20,
      luogo: "Museo Egizio, Torino",
      istruttore: "Francesca De Luca",
      immagine: "http://localhost:5000/uploads/fotoProfilo-1738855609887.png",
      createdBy: null // ID del centro o utente che ha creato l'attività
    },
    {
      titolo: "Escursione al Parco Nazionale",
      descrizione: "Un'escursione tra i boschi del Gran Paradiso.",
      datainizio: "2025-06-15",
      orainizio: "09:00",
      durata: 4,
      scadenzaIscrizioni: "2025-06-10",
      numeroMinimoPartecipanti: 6,
      numeroMassimoPartecipanti: 15,
      luogo: "Parco Nazionale Gran Paradiso",
      istruttore: "Marco Bianco",
      immagine: "http://localhost:5000/uploads/fotoProfilo-1738925978859.png",
      createdBy: null
    },
    {
      titolo: "Weekend a Venezia",
      descrizione: "Un weekend immersi nella cultura veneziana.",
      datainizio: "2025-07-20",
      orainizio: "11:00",
      durata: 6,
      scadenzaIscrizioni: "2025-07-15",
      numeroMinimoPartecipanti: 10,
      numeroMassimoPartecipanti: 25,
      luogo: "Venezia",
      istruttore: "Giulia Moretti",
      immagine: "http://localhost:5000/uploads/fotoProfilo-1738946409935.png",
      createdBy: null
    }
  ];

  attività.forEach(attività => {
    const sql = `
      INSERT INTO external_activities 
      (titolo, descrizione, datainizio, orainizio, durata, scadenzaIscrizioni, numeroMinimoPartecipanti, numeroMassimoPartecipanti, luogo, istruttore, immagine, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      attività.titolo,
      attività.descrizione,
      attività.datainizio,
      attività.orainizio,
      attività.durata,
      attività.scadenzaIscrizioni,
      attività.numeroMinimoPartecipanti,
      attività.numeroMassimoPartecipanti,
      attività.luogo,
      attività.istruttore,
      attività.immagine,
      attività.createdBy
    ], (err) => {
      if (err) {
        console.error("❌ Errore durante l'inserimento dell'attività:", err.message);
      } else {
        console.log(`✅ Attività "${attività.titolo}" aggiunta con successo.`);
      }
    });
  });
};

// Funzione principale per inizializzare il database
const initializeDatabase = () => {
  console.log("🔄 Inizializzazione del database...");
  createProfilesTable();
  createEmergencyContactsTable();
  createPatientEmergencyContactsTable();
  createActivitiesTable();
  createActivityParticipantsTable();

};

initializeDatabase();
//aggiungiAttivitaEsterneFittizie();

module.exports = { initializeDatabase };
