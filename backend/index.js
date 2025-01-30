const express = require('express');
require('dotenv').config();
const cors = require('cors');           // <--- import
const { initializeDatabase } = require('./config/dbSetup');

const publicRoutes = require('./routes/publicRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // o l'indirizzo del tuo frontend
  }));
app.use(express.json());

// ✅ Route pubbliche (accessibili a tutti)
app.use('/api', publicRoutes);
app.use('/api', authRoutes);

// ✅ Route protette (richiedono JWT)
app.use('/api', protectedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
