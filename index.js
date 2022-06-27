const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser');
const { emailValidate, passwordValidade } = require('./middlewares/validations');
const tokenGenerate = require('./middlewares/tokenGenerate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILE_JSON = 'talker.json';

// REQUISITO 01
app.get('/talker', async (_req, res) => {
  const talkers = await fs.readFile('talker.json');
  if (!talkers) res.status(HTTP_OK_STATUS).json([]);

  res.status(HTTP_OK_STATUS).json(JSON.parse(talkers));
});

// REQUSITO 02
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const obj = await fs.readFile(FILE_JSON);
  const talkers = JSON.parse(obj);

  const talkerId = talkers.find((talker) => talker.id === Number(id));
  if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(talkerId);
});

// REQUISITO 03
app.post('/login', emailValidate, passwordValidade, (req, res) => {
  const token = tokenGenerate();
  res.status(200).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
