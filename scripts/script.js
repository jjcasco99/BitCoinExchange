const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";
const mydb = 'Bitcoin';
const clientes = 'clientes';
const consultas = 'Consultas';

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
    
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