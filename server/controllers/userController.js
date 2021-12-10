const mysql = require('mysql');
const {response} = require("express");
require('dotenv').config();
const apiKey = process.env.API_KEY
// Connection Pool
const pool = mysql.createPool({
  connectionLimit : 100,
  host            :process.env.DB_HOST,
  user            :process.env.DB_USER,
  password        :process.env.DB_PASS,
  database        :process.env.DB_NAME
});

//View Equipment
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    // User the connection
    connection.query('SELECT * FROM gear WHERE status = "active"', (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        let removedUser = req.query.removed;
        res.render('home',{ rows, removedUser });
      } else {
        console.log(err);
      }
      console.log('The data from gear table: \n', rows);
    });
  });
}
// weather controller
exports.weather = ('',(req,res) => { });

//Find Equipment by Search;
exports.find = (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    let searchTerm = req.body.search;
    // User the connection
    connection.query('SELECT * FROM gear WHERE equip_name LIKE ? OR mfr LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        res.render('home', {rows});
      } else {
        console.log(err);
      }
      console.log('The data from gear table: \n', rows);
    });
  });
}
exports.form = (req,res) => {
  res.render('add-equip');
}

// Add New User
exports.create = (req, res) => {
  const {equip_name, mfr, serial_num, vendor, descr} = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    let searchTerm = req.body.search;

    // Equipment connection
    connection.query('INSERT INTO gear SET equip_name = ?, mfr = ?, serial_num = ?, vendor = ?, descr= ?', [equip_name,mfr,serial_num,vendor,descr], (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        res.render('add-equip', {alert: 'Equipment Added Successfully!'});
      } else {
        console.log(err);
      }
      console.log('The data from gear table: \n', rows);
    });
  });
}

// Edit Equipment
exports.edit = (req,res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    // Equip connection
    connection.query('SELECT * FROM gear WHERE id = ?',[req.params.id], (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        res.render('edit-equip',{ rows });
      } else {
        console.log(err);
      }
      console.log('The data from gear table: \n', rows);
    });
  });
}

// Update Equip
exports.update = (req,res) => {
  const { equip_name, mfr, serial_num, vendor, descr} = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    // Equip  connection
    connection.query('UPDATE gear SET equip_name=?, mfr=?, serial_num=?, vendor=?, descr= ? WHERE id= ?', [equip_name,mfr, serial_num, vendor, descr, req.params.id], (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected as ID ' + connection.threadId);
          // User the connection
          connection.query('SELECT * FROM gear WHERE id = ?',[req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release();
            if (!err) {
              res.render('edit-equip',{ rows, alert: `${equip_name} has been updated!` });
            } else {
              console.log(err);
            }
            console.log('The data from gear table: \n', rows);
          });
        });
      } else {
        console.log(err);
      }
      console.log('The data from gear table: \n', rows);
    });
  });
}

// Delete Equip
exports.delete = (req,res) => {
  // ******  Here the status value changes to removed so it isn't visible on the web app table *****
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    // Equip connection
    connection.query('UPDATE gear SET status = ? WHERE id = ?',['removed',req.params.id], (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        let removedUser = encodeURIComponent('Equipment Successfully Removed!');
        res.redirect('/?removed=' + removedUser);
      } else {
        console.log(err);
      }
      console.log('The data from gear table: \n', rows);
    });
  });
}

// View All Equipment
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected as ID ' + connection.threadId);
    // Equip connection
    connection.query('SELECT * FROM gear WHERE id = ?', [req.params.id], (err, rows) => {
      // when done with the connection, release it
      connection.release();
      if (!err) {
        res.render('view-equip',{ rows });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  });
}
