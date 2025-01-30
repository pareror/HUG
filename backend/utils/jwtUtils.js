const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mappa ruoli -> livelli di permesso
const ROLE_PERMISSIONS = {
    paziente: 1,
    caregiver: 2,
    touroperator: 3,
    enteesterno: 4,
    direttorecentro: 5
};

// 📌 Funzione per generare un JWT con ruolo e livello di permesso
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            role: user.role,
            permissionLevel: ROLE_PERMISSIONS[user.role] || 0 // Default a 0 se il ruolo è errato
        },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

// 📌 Funzione per verificare un JWT
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
};

module.exports = { generateToken, verifyToken, ROLE_PERMISSIONS };
