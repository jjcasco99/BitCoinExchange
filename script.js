const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";
const mydb = 'Bitcoin';
const clientes = 'clientes';
const consultas = 'Consultas';

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

// const http = require('http');
// const fs = require('fs');
  
const urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/registro', (req, res) => {
  res.sendFile(__dirname + '/compra.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/retirarBitcoin', (req, res) => {
  res.sendFile(__dirname + '/retirar.html');
});



app.post('/comprar', urlencodedParser, (req, res) => {
    MongoClient.connect(url+mydb, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mydb);
        let nuevoUsuario = {"Nombre": req.body.nombrePersona,
                    "Direccion": req.body.direccionPersona, 
                    "Telefono": req.body.telefonoPersona,
                    "Email": req.body.emailPersona,
                    "DNI": req.body.dniPersona,
                    "Contraseña": req.body.contraPersona,
                    "BitCoins": parseInt(req.body.cantidadCompra)};
        dbo.collection(clientes).insertOne(nuevoUsuario, function(err, res) {
          if (err) throw err;
          db.close();
        });
      });
      res.sendFile(__dirname + '/');
});



app.post('/inicioSesion', urlencodedParser, (req, res) => {
  MongoClient.connect(url+mydb, function(err, db) {
      if (err) throw err;
      var dbo = db.db(mydb);
      var query = { "Email":req.body.emailPersona, "Contraseña": req.body.contraPersona};
      dbo.collection(clientes).find(query).toArray(function(err, result) {
        if (err) throw err;
        if (req.body.emailPersona == result[0].Email && req.body.contraPersona == result[0].Contraseña){
          console.log("cuenta iniciada");
          res.sendFile(__dirname + '/retirar.html');
        } else {
          console.log('credenciales erroneas');
          res.sendFile(__dirname + '/login.html');
        }
        db.close();
      });
    });  
});



app.post('/transaccion', urlencodedParser, (req, res) => {
  let restante;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(mydb);
    var query = { "DNI":req.body.dniPersona, "Contraseña": req.body.contraPersona};
    return dbo.collection(clientes).find(query)
    .toArray()  
    .then(result => {
        console.log("avance", result)
        if (err) throw err;
        if (req.body.money < result[0].BitCoins){
        restante = result[0].BitCoins - parseInt(req.body.money)
        return result
        }
      })
      .then(resultado => {
        let newValue = {$set: {"BitCoins": restante}}
        dbo.collection(clientes).updateOne(query, newValue)
        // console.log(resultado)r4er4
        return resultado
      })
      // .then(res => {
        //   db.close();
        // })  
        .catch(err => console.error(`No funciono: ${err}`))
      });
  });
  app.post('/adquisicion', urlencodedParser, (req, res) => {
    let restante;
    MongoClient.connect(url, function(err, db) {
  
      if (err) throw err;
      var dbo = db.db(mydb);
      var query = { "DNI":req.body.dniPersona, "Contraseña": req.body.contraPersona};
      return dbo.collection(clientes).find(query)
      .toArray()  
      .then(result => {
          console.log("avance", result)
          if (err) throw err;
          restante = result[0].BitCoins + parseInt(req.body.money)
          return result
        })
        .then(resultado => {
          let newValue = {$set: {"BitCoins": restante}}
          dbo.collection(clientes).updateOne(query, newValue)
          // console.log(resultado)
          return resultado})
        // .then(db.close())  
        .catch(err => console.error(`No funciono: ${err}`))
      });
    });


 app.post('/Consulta', urlencodedParser, (req, res) => {
    MongoClient.connect(url+mydb, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mydb);
        let nuevaConsulta = {"Nombre": req.body.nombrePersona,           
                              "Email": req.body.emailPersona,
                                "DNI": req.body.dniPersona,
                           "ConsultaBitcoins": req.body.consultaPersona};
        dbo.collection(consultas).insertOne(nuevaConsulta,function(err, res) {
          if (err) throw err;
          db.close();
        });
      });
      res.sendFile(__dirname + '/');
});


app.listen(3000);

