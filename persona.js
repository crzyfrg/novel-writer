const fs = require('fs').promises;
    const path = require('path');

    const PERSONAS_FILE = path.join(__dirname, 'personas.json');

    async function getPersonas() {
      try {
        const data = await fs.readFile(PERSONAS_FILE, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        // If the file doesn't exist or is invalid, return an empty array
        return [];
      }
    }

    async function addPersona(name, description) {
        const personas = await getPersonas();
        personas.push({ name, description });
        await fs.writeFile(PERSONAS_FILE, JSON.stringify(personas, null, 2));
    }

    module.exports = {
      getPersonas,
      addPersona,
    };
