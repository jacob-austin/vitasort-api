const express = require('express');
require('dotenv').config();
const supplementInfoController = require('./controllers/supplementInfoController');

const app = express();
app.use(express.json());

const baseRoute = process.env.BASE_ROUTE;

app.post(`${baseRoute}/supplement-nutrition`, supplementInfoController.getSupplementInfo);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node server listening on port ${PORT}`);
})