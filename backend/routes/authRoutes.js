const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

// 📌 Endpoint di registrazione (salva l'utente nel database con password hashata)
router.post('/register', async (req, res) => {
  console.log("📥 Dati ricevuti dal frontend:", req.body);
  const {
    username,
    comuneDiResidenza,
    role,         // Deve essere 'direttorecentro', 'touroperator' o 'enteesterno'
    ragioneSociale,
    pIva,
    telefono,
    codiceSdi,
    indirizzo,
    emailPec,
    password,
    confermaPassword
  } = req.body;

  // Controllo dei campi obbligatori per la registrazione
  if (!username || !role || !emailPec || !password || !confermaPassword) {
    console.error("⚠️ Campi mancanti:", { username, role, emailPec, password, confermaPassword });
    return res.status(400).json({
      error: "I campi username, role, email, password e conferma password sono obbligatori."
    });
  }
  console.log("✅ Tutti i campi obbligatori sono presenti. Procedo con la registrazione...");
  // Verifica che il ruolo sia uno di quelli che possono registrarsi autonomamente
  if (!["direttorecentro", "touroperator", "enteesterno"].includes(role)) {
    return res.status(400).json({
      error: "Solo direttorecentro, touroperator ed enteesterno possono registrarsi."
    });
  }

  // Controllo che le password coincidano
  if (password !== confermaPassword) {
    return res.status(400).json({ error: "Le password non corrispondono." });
  }

  // Validazione della lunghezza della password
  if (password.length < 8) {
    return res.status(400).json({ error: "La password deve avere almeno 8 caratteri." });
  }

  // Validazione della partita IVA se fornita (11 cifre numeriche)
  if (pIva && !/^\d{11}$/.test(pIva)) {
    return res.status(400).json({ error: "Partita IVA non valida (11 cifre richieste)." });
  }

  // Validazione del numero di telefono se fornito (9-15 cifre)
  if (telefono && !/^\d{9,15}$/.test(telefono)) {
    return res.status(400).json({ error: "Numero di telefono non valido (9-15 cifre)." });
  }

  // Validazione dell'email PEC
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailPec)) {
    return res.status(400).json({ error: "Email PEC non valida." });
  }

  try {
    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserimento nella tabella unificata "profiles"
    const query = `INSERT INTO profiles 
      (username, comuneDiResidenza, ragioneSociale, pIva, telefono, codiceSdi, indirizzo, emailPec, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      username,
      comuneDiResidenza || null,
      ragioneSociale || null,
      pIva || null,
      telefono || null,
      codiceSdi || null,
      indirizzo || null,
      emailPec,
      hashedPassword,
      role
    ];

    db.run(query, values, function (err) {
      if (err) {
        console.error("Errore nella registrazione:", err.message);
        return res.status(500).json({ error: "Errore nella registrazione.", details: err.message });
      }
      res.status(201).json({ message: "Registrazione completata", id: this.lastID });
    });
  } catch (error) {
    console.error("Errore durante la hash della password:", error);
    return res.status(500).json({ error: "Errore durante l'elaborazione della password." });
  }
});

// 📌 Endpoint di login (controlla username e password e genera un JWT)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password sono obbligatori." });
  }

  db.get('SELECT * FROM profiles WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    // Verifica la password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    // Genera il token JWT
    const token = generateToken(user);
    res.cookie("jwt", token, {
      httpOnly: false, 
      secure: false,   
      sameSite: "Lax",
      path: "/"
    });
    res.status(200).json({ message: "Login effettuato con successo!", jwt: token });
  });
});

//quando accedi a register o login se il token è valido ti reindirizza a dashboard nel frontend
router.get('/check-token', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'Token valido', user: req.user });
});

// 📌 Endpoint di logout (invalida il token rimuovendo il cookie)
router.post('/logout', (req, res) => {
    res.clearCookie("jwt", { path: "/" }); // Rimuove il cookie contenente il JWT
    res.status(200).json({ message: "Logout effettuato con successo" });
});
module.exports = router;
