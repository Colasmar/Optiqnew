const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./api'); // Importation des routes de l'API
const { sequelize } = require('./database'); // Importation de Sequelize

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Servir le fichier HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Intégrer les routes définies dans api.js
app.use('/api', apiRoutes);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync()
    .then(() => {
        console.log('✅ Base de données synchronisée avec succès.');
        console.log(app._router.stack.filter(r => r.route).map(r => r.route.path));
        app.listen(PORT, () => {
            console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('❌ Erreur lors de la synchronisation avec la base de données :', error);
        process.exit(1); // Arrêter le serveur en cas d'erreur critique
    });
