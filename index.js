const API_BASE_URL = '/api'; // Mise à jour pour correspondre au chemin défini dans server.js

async function fetchActivitiesForRole(roleId, container) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${roleId}/activities`);
        const activities = await response.json();

        container.innerHTML = `<h3>Activités pour ce rôle :</h3>`;
        const ul = document.createElement('ul');
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity.name + ': ' + activity.description;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (error) {
        console.error('Erreur lors de la récupération des activités associées :', error);
        container.innerHTML = `<p>Erreur de chargement des activités</p>`;
    }
}

// Fonction pour afficher une liste générale (activités ou rôles)
async function fetchAndDisplay(endpoint, title, containerId) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = `<h2>${title}</h2><ul></ul>`;
        const ul = container.querySelector('ul');

        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name || item.description;

            // Conteneur pour les tâches (affichage/repliable)
            const taskContainer = document.createElement("div");
            taskContainer.id = `activity-${item.id}-tasks`; // ID unique pour chaque conteneur
            taskContainer.style.display = 'none';
            taskContainer.style.marginTop = '10px';

            li.addEventListener('click', () => {
                const isVisible = taskContainer.style.display === 'block';
                taskContainer.style.display = isVisible ? 'none' : 'block';

                if (!isVisible && containerId === 'activities') {
                    fetchTasks(item.id, taskContainer); // Charger les tâches lorsque le conteneur devient visible
                }
            });

            // Ajouter un bouton "Ajouter une tâche" et une liste déroulante pour le garant
            if (containerId === 'activities') {
                const button = document.createElement('button');
                button.textContent = 'Ajouter une tâche';
                button.className = 'add-task-btn';
                button.setAttribute('data-id', item.id);

                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    openTaskForm(item.id);
                });

                const guarantorContainer = document.createElement('div');
                guarantorContainer.innerHTML = `
                    <label for="guarantor-select-${item.id}">Garant :</label>
                    <select id="guarantor-select-${item.id}" class="guarantor-select">
                        <option value="">-- Sélectionner un rôle --</option>
                    </select>
                `;
                guarantorContainer.style.marginTop = '10px';

                loadRolesForActivity(item.id);

                li.appendChild(button);
                li.appendChild(guarantorContainer);
            }

            li.appendChild(taskContainer); // Ajouter le conteneur des tâches dans l'activité
            ul.appendChild(li);
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération des données depuis ${endpoint}:`, error);
    }
}

// Charger les tâches dans le conteneur de l'activité
async function fetchTasks(activityId, container) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks?activity_id=${activityId}`);
        const tasks = await response.json();

        container.innerHTML = `<h3>Tâches pour l'activité :</h3>`;
        const ul = document.createElement('ul');
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.title || "Tâche sans intitulé";
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
    }
}

// Charger les rôles dans la liste déroulante pour une activité
async function loadRolesForActivity(activityId) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`);
        const roles = await response.json();

        const select = document.getElementById(`guarantor-select-${activityId}`);
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            select.appendChild(option);
        });

        select.addEventListener('change', async () => {
            const selectedRoleId = select.value;

            try {
                const response = await fetch(`${API_BASE_URL}/activities/${activityId}/guarantor`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role_id: parseInt(selectedRoleId) })
                });

                if (response.ok) {
                    console.log(`Garant défini pour l'activité ${activityId}`);
                } else {
                    console.error(`Erreur lors de la définition du garant pour l'activité ${activityId}`);
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour du garant :', error);
            }
        });
    } catch (error) {
        console.error('Erreur lors du chargement des rôles :', error);
    }
}

// Charger les activités associées à un rôle
async function fetchRoleActivities(roleId, container) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${roleId}/activities`);
        const activities = await response.json();

        container.innerHTML = `<h3>Activités pour ce rôle :</h3>`;
        const ul = document.createElement('ul');
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity.name;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (error) {
        console.error('Erreur lors du chargement des activités du rôle :', error);
    }
}

// Charger les rôles
async function fetchRoles() {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`);
        const roles = await response.json();

        const container = document.getElementById("roles");
        container.innerHTML = `<h2>Liste des Rôles</h2><ul></ul>`;
        const ul = container.querySelector("ul");

        roles.forEach(role => {
            const li = document.createElement("li");
            li.textContent = role.name;
            li.style.cursor = 'pointer';

            const descriptionContainer = document.createElement("div");
            descriptionContainer.style.display = 'none';
            descriptionContainer.innerHTML = `<p>${role.description}</p>`;

            const activityContainer = document.createElement("div");
            activityContainer.style.display = 'none';

            li.addEventListener('click', () => {
                const isVisible = descriptionContainer.style.display === 'block';
                descriptionContainer.style.display = isVisible ? 'none' : 'block';
                activityContainer.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    fetchRoleActivities(role.id, activityContainer);
                }
            });

            li.appendChild(descriptionContainer);
            li.appendChild(activityContainer);
            ul.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des rôles :', error);
        document.getElementById("roles").innerHTML = "<h2>Erreur de chargement des rôles</h2>";
    }
}

// Gestion de l'ouverture et de la fermeture du formulaire
function openTaskForm(activityId) {
    const formContainer = document.getElementById("task-form-container");
    formContainer.style.display = "block";
    formContainer.setAttribute("data-activity-id", activityId);
    document.getElementById("task-title").value = ""; // Réinitialiser le champ de saisie
}

function closeTaskForm() {
    const formContainer = document.getElementById("task-form-container");
    formContainer.style.display = "none";
    formContainer.removeAttribute("data-activity-id");
    document.getElementById("task-title").value = ""; // Réinitialiser le champ de saisie
}

// Gestion de la soumission du formulaire
document.getElementById("task-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formContainer = document.getElementById("task-form-container");
    const activityId = formContainer.getAttribute("data-activity-id");
    const taskTitle = document.getElementById("task-title").value;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                activity_id: parseInt(activityId),
                title: taskTitle
            })
        });

        if (response.ok) {
            closeTaskForm();
            const taskContainer = document.querySelector(`#activity-${activityId}-tasks`);
            fetchTasks(activityId, taskContainer); // Rafraîchir les tâches après ajout
        } else {
            const errorText = await response.text();
            console.error("Erreur de l'API :", errorText);
            alert("Erreur lors de l'ajout de la tâche.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
});

// Bouton "Annuler" pour fermer le formulaire
document.getElementById("cancel-task-form").addEventListener("click", closeTaskForm);

// Charger les activités et les rôles
fetchAndDisplay('/activities', 'Liste des Activités', 'activities');
fetchRoles();
