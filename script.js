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

app.use(express.static(__dirname));
    
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
      dbo.collection(clientes).find(query).toArray().then(result => {
        if (err) throw err;
        if (result[0].Email == req.body.emailPersona && result[0].Contraseña == req.body.contraPersona){
          res.sendFile(__dirname + '/retirar.html');
        }
      }) 
      .catch(err => res.send(`<div>
                                <h3 class="generado">EMAIL Y/O CONTRASEÑA INCORRECTO</h3>
                              </div>
                              <button type="submit"><a href="/login">Volver</a></button>`));
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
      if (err) throw err;
      if (req.body.money <= result[0].BitCoins){
        restante = result[0].BitCoins - parseInt(req.body.money)
        return result
      }
    })
    .then(resultado => {
      if (restante != null){
        let newValue = {$set: {"BitCoins": restante}}
        dbo.collection(clientes).updateOne(query, newValue)
        return resultado
      }
    })
    .then(total => {
      res.send(`<div>
                <h3 class="generado">Tu saldo actual es de ${total[0].BitCoins - parseInt(req.body.money)} BitCoins</h3>
                </div>
                <button type="submit"><a href="/retirarBitcoin">Volver</a></button>`);
    })  
    .catch(err => {
      res.send(`<div>
                <h3 class="generado">Credenciales incorrectos o saldo insuficiente</h3>
                </div>
                <button type="submit"><a href="/retirarBitcoin">Volver</a></button>`);

    });
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
          if (err) throw err;
          restante = result[0].BitCoins + parseInt(req.body.money)
          return result
        })
        .then(resultado => {
          let newValue = {$set: {"BitCoins": restante}}
          dbo.collection(clientes).updateOne(query, newValue)
          return resultado}) 
          .then(total => {
            res.send(`<div>
                        <h3 class="generado">Tu saldo actual es de ${total[0].BitCoins + parseInt(req.body.money)} BitCoins</h3>
                      </div>
                      <button type="submit"><a href="/retirarBitcoin">Volver</a></button>
            `);
          }) 
        .catch(err => res.send(`<div>
                                  <h3>DNI Y/O PIN INCORRECTO</h3>
                                </div>
                                <button type="submit"><a href="/retirarBitcoin">Volver</a></button>`));
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
        res.send(`<div>
                    <h3 class="generado">Hola ${nuevaConsulta.Nombre}, tu consulta ha sido recibida, le atenderemos a la mayor brevedad posible. Gracias por su paciencia.</h3>
                  </div>
                  <button type="submit"><a href="/">Volver</a></button>
        `);
      });
});


app.listen(3000);

