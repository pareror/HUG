const express = require('express');
const app = express();

// Middleware per parsing JSON
app.use(express.json());

// API di esempio
app.get('/api/tasks', (req, res) => {
    res.json([{ id: 1, title: 'Task 2123123123', completed: false }]);
});


// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
