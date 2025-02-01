const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

// 📌 Endpoint di registrazione (salva l'utente nel database con password hashata)
router.post('/register', async (req, res) => {
    const {
      username,
      comuneDiResidenza,
      tipologia,
      ragioneSociale,
      pIva,
      telefono,
      codiceSdi,
      indirizzo,
      emailPec,
      password,
      confermaPassword
    } = req.body;
  
    // Controlli sui campi obbligatori
    if (
      !username ||
      !comuneDiResidenza ||
      !tipologia ||
      !emailPec ||
      !password ||
      !confermaPassword
    ) {
      return res.status(400).json({
        error:
          "I campi username, comune di residenza, tipologia, email, password e conferma password sono obbligatori."
      });
    }
  
    // Controlla che le password coincidano
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
  
    // Mappatura della tipologia al ruolo
    let role;
    if (tipologia === "centro") {
      role = "direttorecentro";
    } else if (tipologia === "tour") {
      role = "touroperator";
    } else if (tipologia === "enti") {
      role = "enteesterno";
    } else {
      return res.status(400).json({ error: "Tipologia non valida." });
    }
  
    try {
      // Hash della password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Query di inserimento con tutti i campi
      const query = `INSERT INTO users 
        (username, comuneDiResidenza, tipologia, ragioneSociale, pIva, telefono, codiceSdi, indirizzo, emailPec, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        username,
        comuneDiResidenza,
        tipologia,
        ragioneSociale,
        pIva,
        telefono,
        codiceSdi,
        indirizzo,
        emailPec,
        hashedPassword,
        role
      ];
  
      db.run(query, values, function (err) {
        if (err) {
          console.error("Errore nella registrazione:", err.message);
          return res.status(500).json({ error: "Errore nella registrazione." });
        }
        res.status(201).json({ message: "Registrazione completata" });
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

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
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
            httpOnly: false,  // 🔹 Il cookie non è accessibile da JavaScript per sicurezza
            secure: false,   // 🔹 Deve essere `false` in locale, `true` in produzione con HTTPS
            sameSite: "Lax", // 🔹 Necessario per evitare problemi di cross-site requests
            path: "/"        // 🔹 Permette l'accesso a tutto il sito
          });
        
          res.status(200).json({ message: "Login effettuato con successo!" , jwt: token});
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
