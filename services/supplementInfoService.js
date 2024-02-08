const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    port: process.env.LOCAL_DB_PORT,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME
});

async function getSupplementData(supplementType) {
    let client;
    try {
        client = await pool.connect();

        const query = `
        SELECT 
            s.supplement_id,
            s.name AS supplement_name,
            s.cost,
            s.servings AS servings,
            MAX(CASE WHEN i.name = 'Protein' THEN si.amount_in_grams ELSE NULL END) AS protein_per_serving,
            MAX(CASE WHEN i.name = 'Sugar' THEN si.amount_in_grams ELSE NULL END) AS sugar_per_serving,
            MAX(CASE WHEN i.name = 'Sodium' THEN si.amount_in_grams ELSE NULL END) AS sodium_per_serving,
            MAX(CASE WHEN i.name = 'Added Sugars' THEN si.amount_in_grams ELSE NULL END) AS added_sugars_per_serving,
            MAX(CASE WHEN i.name = 'Dietary Fiber' THEN si.amount_in_grams ELSE NULL END) AS dietary_fiber_per_serving,
            MAX(CASE WHEN i.name = 'Cholesterol' THEN si.amount_in_grams ELSE NULL END) AS cholesterol_per_serving,
            MAX(CASE WHEN i.name = 'Trans Fat' THEN si.amount_in_grams ELSE NULL END) AS trans_fat_per_serving,
            MAX(CASE WHEN i.name = 'Saturated Fat' THEN si.amount_in_grams ELSE NULL END) AS saturated_fat_per_serving
        FROM 
            vitasort.supplement AS s
        JOIN 
            vitasort.supplement_ingredient AS si ON s.supplement_id = si.supplement_id
        JOIN 
            vitasort.ingredient AS i ON si.ingredient_id = i.ingredient_id
        WHERE 
            i.name IN ('Protein', 'Sugar', 'Sodium', 'Added Sugars', 'Dietary Fiber', 'Cholesterol', 'Trans Fat', 'Saturated Fat') AND s.type = $1
        GROUP BY 
            s.supplement_id, s.name, s.cost, s.servings;
            `;
        const { rows } = await client.query(query, [supplementType]);
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
