const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";
const mydb = 'Bitcoin';
const clientes = 'clientes';
const consultas = 'Consultas';

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
  
const urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/insertar', urlencodedParser, (req, res) => {
    MongoClient.connect(url+mydb, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mydb);
        let nuevoUsuario = {"Nombre": req.body.nombrePersona,
                    "Direccion": req.body.direccionPersona, 
                    "Telefono": req.body.telefonoPersona,
                    "Email": req.body.emailPersona,
                    "DNI": req.body.dniPersona,
                    "Contraseña": req.body.contraPerosna,
                    "BitCoins": req.body.cantidadCompra};
        dbo.collection(clientes).insertOne(nuevoUsuario, function(err, res) {
          if (err) throw err;
          console.log("Documento insertado");
          db.close();
        });
      });
    res.send(req.body);
});

app.post('/retirar', urlencodedParser, (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(mydb);
    var myquery = {"dni": req.body.dniPersona, "contraseña": req.body.contraPerosna};
    // var newvalues = { $set: {"nombre": "Pedro SL", "direccion": "C/Serrano" } };
    dbo.collection(clientes).aggregate(myquery, {$substract:[$saldo, req.body.money],}, function(err, res) {
    if (err) throw err;
    console.log("Documento actualizado");
    db.close();
    });
  });
});

app.listen(3000);