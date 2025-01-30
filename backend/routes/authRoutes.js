const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');

const router = express.Router();

// 📌 Endpoint di registrazione (salva l'utente nel database con password hashata)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: "Username, password e ruolo sono obbligatori." });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Errore nella registrazione.' });
            }
            res.json({ message: 'Registrazione completata' });
        }
    );
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
        res.status(200).json({ token });
    });
});

module.exports = router;
