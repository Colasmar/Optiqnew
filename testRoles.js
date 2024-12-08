const fetch = require('node-fetch');

async function testRolesAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/roles');
        const roles = await response.json();
        console.log('Rôles récupérés via API :', roles);
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API /roles :', error);
    }
}

testRolesAPI();
