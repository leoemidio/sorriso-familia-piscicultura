// src/routes/lotes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /lotes — lista todos os lotes (incluindo o tanque)
router.get('/', async (req, res) => {
  try {
    const lotes = await prisma.lote.findMany({
      include: { tanque: true }
    });
    res.json(lotes);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar lotes.' });
  }
});

// GET /lotes/:id — busca um lote por ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const lote = await prisma.lote.findUnique({
      where: { id },
      include: { tanque: true }
    });
    if (!lote) return res.status(404).json({ error: 'Lote não encontrado.' });
    res.json(lote);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar lote.' });
  }
});

// POST /lotes — cria um novo lote
router.post('/', async (req, res) => {
  const { nome, tanqueId, dataInicio } = req.body;
  try {
    const novo = await prisma.lote.create({
      data: {
        nome,
        tanque:     { connect: { id: Number(tanqueId) } },
        dataInicio: new Date(dataInicio)
      }
    });
    res.status(201).json(novo);
  } catch {
    res.status(400).json({ error: 'Dados inválidos para criar lote.' });
  }
});

// PUT /lotes/:id — atualiza um lote existente
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nome, tanqueId, dataInicio } = req.body;
  try {
    await prisma.lote.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.lote.update({
      where: { id },
      data: {
        nome,
        tanque:     { connect: { id: Number(tanqueId) } },
        dataInicio: new Date(dataInicio)
      }
    });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025'
      ? 'Lote não encontrado.'
      : 'Erro ao atualizar lote.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /lotes/:id — deleta um lote
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.lote.findUniqueOrThrow({ where: { id } });
    await prisma.lote.delete({ where: { id } });
    res.json({ message: 'Lote deletado com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025'
      ? 'Lote não encontrado.'
      : 'Erro ao deletar lote.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
