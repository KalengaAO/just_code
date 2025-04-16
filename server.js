// ========== SERVIDOR EM NODE.JS ==========
// Instalar dependências com: npm install express body-parser socket.io

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para interpretar texto puro enviado pelo C
app.use(bodyParser.text());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota POST que recebe código e transmite via WebSocket
app.post('/code', (req, res) => {
  const codigo = req.body;
  if (!codigo || typeof codigo !== 'string') {
    console.error('Corpo inválido:', codigo);
    return res.status(400).send('Corpo inválido');
  }

  console.log('Código recebido:', codigo);
  io.emit('update', codigo);
  res.sendStatus(200);
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
