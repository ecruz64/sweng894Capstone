const express = require('express');
const handlebars = require('express-handlebars');
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
app.use(express.static('public'));

// Templating Engine
app.engine('hbs', handlebars( {extname: '.hbs'}));
app.set('view engine','hbs');

// Connection Pool
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

const routes = require('./server/routes/user');
app.use('/', routes);
app.listen(port,() => console.log(`Listening on port ${port}`));




// weather api
const weather = require('openweather-apis');
weather.setLang('en');
weather.setZipCode('06606');
weather.setUnits('imperial');
weather.setAPPID(apiKey);

weather.getWeatherForecastForDays(1,function (err,obj){
  console.log(obj);
});


function showRepositories(event, data) {
  const repos = JSON.parse(this.responseText)
  const src = document.getElementById("repository-template").innerHTML
  const template = Handlebars.compile(src)
  const repoList = template(repos)
  document.getElementById("repositories").innerHTML = repoList
}



