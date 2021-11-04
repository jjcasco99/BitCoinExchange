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