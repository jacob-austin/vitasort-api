const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    port: process.env.LOCAL_DB_PORT,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME
});

async function getSupplementData() {
    let client;
    try {
        client = await pool.connect();

        const query = `
            SELECT 
                s.supplement_id,
                s.name AS supplement_name,
                s.cost,
                s.servings AS servings,
                si.amount_in_grams AS protein_per_serving
            FROM 
                vitasort.supplement AS s
            JOIN 
                vitasort.supplement_ingredient AS si ON s.supplement_id = si.supplement_id
            JOIN 
                vitasort.ingredient AS i ON si.ingredient_id = i.ingredient_id
            WHERE 
                i.ingredient_id = 1 AND i.name = 'Protein';
            `;
        const { rows } = await client.query(query);
        return rows;
    } catch(error) {
        console.error('Error fetching supplement data: ', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = {
    getSupplementData
};
