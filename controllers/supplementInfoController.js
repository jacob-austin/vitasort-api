const { getSupplementData } = require('../services/supplementInfoService');

async function getSupplementInfo(req, res) {
    try {
        const supplementType = req.body.supplementType;
         // Check if supplementType is missing or invalid
         if (!supplementType || typeof supplementType !== 'string') {
            return res.status(400).json({ error: 'supplementType is missing or invalid in the request body' });
        }
        const supplements = await getSupplementData(supplementType);
        res.json(supplements);
    } catch (error) {
        console.error('Error fetching supplement data:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
}

module.exports = {
    getSupplementInfo
};
