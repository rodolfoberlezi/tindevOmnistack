const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");
//interessante notar que, apesar do Node usar o mesmo motor do Chrome
//ele não tem acesso a recursos do navegador, como o window
//mas tem acesso a recursos de HD, como banco de dados
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);

//recebera id:socket chave:valor //não é ideial para produção, poderia ser um Redis
const connectedUsers = {}

//permite comunicação entre front e back em tempo real
io.on('connection', socket => {
    console.log("Nova conexão em tempo real: " + socket.id);
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
    console.log(connectedUsers);
});

mongoose.connect("mongodb://localhost");

//middleware
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    
    return next();
});

app.use(cors());
app.use(express.json()); //express.json() no lugar de bodyparser....
app.use(routes);

server.listen(3333);