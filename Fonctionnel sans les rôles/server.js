const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

// Charger les données depuis le fichier JSON
const loadData = () => {
    const data = fs.readFileSync('./database.json', 'utf-8');
    return JSON.parse(data);
};

// Route racine pour servir le fichier HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint pour obtenir toutes les activités
app.get('/activities', (req, res) => {
    const data = loadData();
    res.json(data.activities);
});

// Endpoint pour obtenir les tâches d'une activité spécifique
app.get('/tasks', (req, res) => {
    const activityId = parseInt(req.query.activity_id, 10);
    const data = loadData();
    const tasks = data.tasks.filter(task => task.activity_id === activityId);
    res.json(tasks);
});

// Endpoint pour obtenir tous les rôles
app.get('/roles', (req, res) => {
    const data = loadData();
    res.json(data.roles);
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
