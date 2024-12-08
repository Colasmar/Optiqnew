const { sequelize, Role, Activity, Task } = require('./database');

async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });

        // Ajouter des rôles
        const chefDeProjet = await Role.create({ name: 'Chef de Projet', description: 'Responsable de projet' });
        const operateur = await Role.create({ name: 'Opérateur', description: 'Réalise les activités sur le terrain' });
        const relationClient = await Role.create({ name: 'Relation Client', description: 'Interface avec les clients' });

        // Ajouter des activités avec des rôles comme garants
        const activity1 = await Activity.create({
            name: 'Planification',
            description: 'Planification des ressources',
            GuarantorId: chefDeProjet.id, // Associer Chef de Projet comme garant
        });

        const activity2 = await Activity.create({
            name: 'Production',
            description: 'Exécution des travaux',
            GuarantorId: operateur.id, // Associer Opérateur comme garant
        });

        // Ajouter des tâches associées aux activités
        await Task.create({ title: 'Analyse des besoins', ActivityId: activity1.id });
        await Task.create({ title: 'Préparation des matériaux', ActivityId: activity2.id });

        console.log('✅ Base de données synchronisée avec succès et données ajoutées.');
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation de la base de données :', error);
    }
}

syncDatabase();

