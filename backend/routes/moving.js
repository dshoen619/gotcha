const express = require('express');
const router = express.Router();
const mysql = require('../mysql')

require('dotenv').config();

taskersTable = process.env.TASKERS_TABLE

router.get('/showMovers', async (req, res) => {
    try{

        const query = `SELECT * FROM ${taskersTable}`
        const moversData = await mysql.executeQuery(query)

        data_dict ={moversData:moversData}
        res.setHeader('Content-Type', 'text/javascript');
        res.send(JSON.stringify(moversData));
    }catch(error){
        console.log(error)
    }
});

module.exports = router;