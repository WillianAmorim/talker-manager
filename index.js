const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILE_JSON = 'talker.json';

app.get('/talker', async (_req, res) => {
  const talkers = await fs.readFile('talker.json');
  if (!talkers) res.status(HTTP_OK_STATUS).json([]);

  res.status(HTTP_OK_STATUS).json(JSON.parse(talkers));
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const obj = await fs.readFile(FILE_JSON);
  const talkers = JSON.parse(obj);

  const talkerId = talkers.find((talker) => talker.id === Number(id));
  if (!talkerId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(HTTP_OK_STATUS).json(talkerId);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
