// src/server.js
require('dotenv').config();              // carrega variáveis do .env
const express = require('express');
const cors = require('cors');

const tanquesRouter      = require('./routes/tanques');
const lotesRouter        = require('./routes/lotes');
const peixesRouter       = require('./routes/peixes');
const alimentacoesRouter = require('./routes/alimentacoes');
const mortalidadesRouter = require('./routes/mortalidades');
const abatesRouter       = require('./routes/abates');
const vendasRouter       = require('./routes/vendas');
const relatoriosRouter   = require('./routes/relatorios');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// monta cada módulo de rota
app.use('/tanques',      tanquesRouter);
app.use('/lotes',        lotesRouter);
app.use('/peixes',       peixesRouter);
app.use('/alimentacoes', alimentacoesRouter);
app.use('/mortalidades', mortalidadesRouter);
app.use('/abates',       abatesRouter);
app.use('/vendas',       vendasRouter);
app.use('/relatorios',   relatoriosRouter);

// rota raiz
app.get('/', (req, res) => {
  res.send('API Sorriso & Família – Piscicultura funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
