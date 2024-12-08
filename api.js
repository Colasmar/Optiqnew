const express = require('express');
const router = express.Router();
const { Role, Activity, Task } = require('./database');

// Route pour obtenir la liste des rôles
router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.findAll(); // Utilisation de Sequelize pour récupérer les rôles
        res.json(roles); // Renvoie les données en JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des rôles :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
    }
});

// Route pour obtenir la liste des activités
router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.findAll({
            include: [{ model: Role, as: 'Guarantor' }],
        });
        res.json(activities);
    } catch (error) {
        console.error('Erreur lors de la récupération des activités :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des activités' });
    }
});
// Route pour récupérer les activités associées à un rôle
router.get('/roles/:id/activities', async (req, res) => {
    const roleId = req.params.id;

    try {
        const activities = await Activity.findAll({
            where: { GuarantorId: roleId },
        });
        res.json(activities);
    } catch (error) {
        console.error('Erreur lors de la récupération des activités associées :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des activités associées.' });
    }
});

// Route pour mettre à jour le garant d'une activité
router.post('/activities/:id/guarantor', async (req, res) => {
    const activityId = req.params.id; // ID de l'activité
    const { role_id } = req.body; // ID du rôle envoyé dans la requête

    try {
        // Trouver l'activité à mettre à jour
        const activity = await Activity.findByPk(activityId);

        if (!activity) {
            return res.status(404).json({ error: 'Activité non trouvée' });
        }

        // Mettre à jour le GuarantorId
        activity.GuarantorId = role_id;
        await activity.save();

        res.json({ message: 'Garant mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du garant :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du garant' });
    }
});

// Route pour obtenir les tâches associées à une activité
router.get('/tasks', async (req, res) => {
    const { activityId } = req.query;

    if (!activityId) {
        return res.status(400).json({ error: 'activityId est requis' });
    }

    try {
        const tasks = await Task.findAll({
            where: { ActivityId: activityId },
        });
        res.json(tasks);
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
});

// Route pour ajouter une nouvelle tâche à une activité
router.post('/tasks', async (req, res) => {
    const { activity_id, title } = req.body;

    // Vérifier les données envoyées
    if (!activity_id || !title) {
        return res.status(400).json({ error: 'activity_id et title sont requis.' });
    }

    try {
        // Création de la tâche
        const task = await Task.create({
            ActivityId: activity_id,
            title,
        });

        res.status(201).json({ message: 'Tâche ajoutée avec succès', task });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche.' });
    }
});

module.exports = router;
