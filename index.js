const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser');
const {
  emailValidate,
  passwordValidade,
  tokenValidate,
  nameValidate,
  ageValidate,
  talkValidation,
  watchedAtValidade,
  rateValidate,
} = require('./middlewares/validations');
const tokenGenerate = require('./middlewares/tokenGenerate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const FILE_NAME = 'talker.json';

// REQUISITO 01
app.get('/talker', async (_req, res) => {
  const talkers = await fs.readFile(FILE_NAME);
  if (!talkers) res.status(HTTP_OK_STATUS).json([]);

  res.status(HTTP_OK_STATUS).json(JSON.parse(talkers));
});

// REQUSITO 02
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const obj = await fs.readFile(FILE_NAME);
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

// REQUISITO 05
app.post('/talker',
tokenValidate,
nameValidate,
ageValidate,
talkValidation,
watchedAtValidade,
rateValidate,
async (req, res) => {
  try {
    const { name, age, talk } = req.body;

    const obj = await fs.readFile(FILE_NAME);
    const talkers = JSON.parse(obj);
    const newTalker = {
      id: talkers.length + 1,
      name,
      age,
      talk,
    };

    const newVariavel = [...talkers, newTalker];
    await fs.writeFile(FILE_NAME, JSON.stringify(newVariavel));
    return res.status(201).json(newTalker);
  } catch (error) {
    console.error(error.message);
  }
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
