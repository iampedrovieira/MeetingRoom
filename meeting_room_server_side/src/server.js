const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const cron = require("node-cron")
const Update = require("./cron/updateExternalInfo")
require('dotenv').config();

const db = require("./database");
const app = express();


app.use(cors());
app.use(express.json());
app.use(routes);

const server = app.listen(process.env.API_PORT);
console.log("Server listening on port: " + process.env.API_PORT);

//Cron
// cron.schedule(process.env.CRON_PATTERN_TIME,async ()=>{
//     console.log("Start update cache")
//     await Update.updateExternalInfo()
//     console.log("External Office cache updated")
// })
