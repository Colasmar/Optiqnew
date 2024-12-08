const { Activity } = require('./database'); // Importer le modèle Activity

async function checkActivities() {
    try {
        const activities = await Activity.findAll();
        console.log('📋 Liste des Activités :', activities.map(a => ({
            id: a.id,
            name: a.name,
            GuarantorId: a.GuarantorId,
        })));
    } catch (error) {
        console.error('Erreur lors de la récupération des activités :', error);
    }
}

checkActivities();
