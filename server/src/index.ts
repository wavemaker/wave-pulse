import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { resolve } from 'path';
import { homedir } from 'os';
import { existsSync, mkdirpSync, readdirSync, unlinkSync, writeFileSync } from 'fs-extra';
import moment from 'moment';

const bodyParser = require('body-parser');


const APP = express();
const SERVER = http.createServer(APP);
const SESSION_DATA_DIRECTORY = `${homedir}/.wavepulse/session/data`;

mkdirpSync(SESSION_DATA_DIRECTORY);

// parse application/x-www-form-urlencoded
APP.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
APP.use(bodyParser.json())


const IO = new Server(SERVER, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});
const STATIC_DIR =  resolve(`${__dirname}/../ui`);
APP.use(cors());
APP.use(express.static(STATIC_DIR));

APP.get('/', (req, res) => {
  res.sendFile(STATIC_DIR + '/index.html');
});

APP.get('/session/data/list', (req, res) => {
  const filenames = readdirSync(SESSION_DATA_DIRECTORY);
  res.setHeader('Content-Type', 'application/json');
  res.send(filenames.filter(f => {
    return f.endsWith('.data');
  }));
});

APP.get('/session/data/:filename', (req: express.Request<{filename: string}>, res) => {
  res.sendFile(`${SESSION_DATA_DIRECTORY}/${req.params.filename}`);
});

APP.delete('/session/data/:filename', (req: express.Request<{filename: string}>, res) => {
  const path = `${SESSION_DATA_DIRECTORY}/${req.params.filename}`;
  if (existsSync(path)) {
    unlinkSync(path);
  }
  res.send({
    "success": true
  });
});

APP.post('/session/data', (req, res) => {
  const content = (req.body as any)['content'];
  let startWith = (req.body as any)['name'] || moment().format('DD-MMM-YYYY-HH-mm');
  let fileName = `${SESSION_DATA_DIRECTORY}/${startWith}.data`;
  for(var i = 0; existsSync(fileName); i++) {
    fileName = `${SESSION_DATA_DIRECTORY}/${startWith}(${i+1}).data`;
  }
  writeFileSync(fileName, content, 'utf-8');
  res.send({
    'success': true
  });
});

IO.on('connection', (socket) => {
  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  });
});

SERVER.listen(3333, () => {
  console.log('listening on *:3333');
});