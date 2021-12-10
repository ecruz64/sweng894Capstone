const express = require('express');
const handlebars = require('express-handlebars');
const hbs = require('hbs');
const path = require('path');
const publicStaticDirPath = path.join(__dirname,'public')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const {response, request} = require("express");
const {createConnection} = require("mysql");
require('dotenv').config();
const app = express();
const port  = process.env.PORT || 8080;
const apiKey = process.env.API_KEY;
// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: false }));
//parse Application/JSON
app.use(bodyParser.json());
// Static Files
app.use(express.static(publicStaticDirPath));
// Templating Engine
app.engine('hbs', handlebars( {extname: '.hbs'}));
app.set('view engine','hbs');
// Connection Pool for DB
const pool = mysql.createPool({
  connectionLimit : 100,
  host            :process.env.DB_HOST,
  user            :process.env.DB_USER,
  password        :process.env.DB_PASS,
  database        :process.env.DB_NAME
});
// connect to DB
pool.getConnection((err, connection) => {
  if (err) throw err; // not connected
  console.log('Connected as ID ' + connection.threadId);
});
//holds the folder path for router
const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port,() => console.log(`Listening on port ${port}`));

// // weather api using openweather-apis
const weather = require('openweather-apis');
weather.setLang('en');
weather.setZipCode('06606');
weather.setUnits('imperial');
weather.setAPPID(apiKey);
weather.getTemperature(function (err,temp){
  console.log('The Current Temperature in Bridgeport is: ' + temp);
});
weather.getWeatherForecastForDays(3,function (err,obj){
  console.log(obj);
});
