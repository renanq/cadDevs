const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes.js');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app); //extrai o servidor do express para fazer a atualização real time

setupWebSocket(server);

mongoose.connect('mongodb+srv://renanq:101182@cluster0-dwntf.mongodb.net/week10?retryWrites=true&w=majority',  { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
