const express = require('express');
require('dotenv').config();
const cors = require('cors');           // <--- import
const { initializeDatabase } = require('./config/dbSetup');
const publicRoutes = require('./routes/publicRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = ["http://localhost:3000"]; // Lista degli origin consentiti

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Permette di inviare e ricevere cookie
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔹 Per supportare form-urlencoded
// ✅ Route pubbliche (accessibili a tutti)
app.use('/api', publicRoutes);
app.use('/api', authRoutes);

// ✅ Route protette (richiedono JWT)
app.use('/api', protectedRoutes);

// esponi la cartella uploads
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
