const { getSupplementData } = require('../services/supplementInfoService');

async function getSupplementInfo(req, res) {
    try {
        const supplements = await getSupplementData();
        res.json(supplements);
    } catch (error) {
        console.error('Error fetching supplement data:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

module.exports = {
    getSupplementInfo
};
