const API_BASE_URL = 'https://stackblitzstartersrrtgcq-iahb--3000--fc837ba8.local-corp.webcontainer.io';

// Fonction pour afficher une liste générale (activités ou rôles)
async function fetchAndDisplay(endpoint, title, containerId, clickCallback) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = `<h2>${title}</h2><ul></ul>`;
        const ul = container.querySelector('ul');

        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name || item.description;
            li.addEventListener('click', () => {
                if (clickCallback) clickCallback(item.id);
            });
            ul.appendChild(li);
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération des données depuis ${endpoint}:`, error);
    }
}

// Fonction pour afficher les tâches d'une activité spécifique
let lastClickedActivityId = null;

async function fetchTasks(activityId) {
    console.log(`Tentative de récupération des tâches pour l'activité ${activityId}`);
    
    if (lastClickedActivityId === activityId) {
        const container = document.getElementById('tasks');
        container.innerHTML = '';
        lastClickedActivityId = null;
        return;
    }

    lastClickedActivityId = activityId;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks?activity_id=${activityId}`);
        const tasks = await response.json();

        const container = document.getElementById('tasks');
        container.innerHTML = `<h3>Tâches pour l'activité ${activityId}</h3><ul></ul>`;
        const ul = container.querySelector('ul');

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.name || task.description;
            ul.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
    }
}

// Charger les activités et ajouter les clics pour afficher les tâches
fetchAndDisplay('/activities', 'Liste des Activités', 'activities', fetchTasks);

// Charger les rôles
fetchAndDisplay('/roles', 'Liste des Rôles', 'roles');
