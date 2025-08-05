const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /tanques
router.get('/', async (req, res) => {
  try {
    const tanques = await prisma.tanque.findMany();
    res.json(tanques);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar tanques.' });
  }
});

// GET /tanques/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const tanque = await prisma.tanque.findUnique({ where: { id } });
    if (!tanque) return res.status(404).json({ error: 'Tanque não encontrado.' });
    res.json(tanque);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar tanque.' });
  }
});

// POST /tanques
router.post('/', async (req, res) => {
  const { nome, capacidade } = req.body;
  try {
    const novo = await prisma.tanque.create({ data: { nome, capacidade } });
    res.status(201).json(novo);
  } catch {
    res.status(500).json({ error: 'Erro ao criar tanque.' });
  }
});

// PUT /tanques/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nome, capacidade } = req.body;
  try {
    await prisma.tanque.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.tanque.update({ where: { id }, data: { nome, capacidade } });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Tanque não encontrado.' : 'Erro ao atualizar tanque.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /tanques/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.tanque.findUniqueOrThrow({ where: { id } });
    await prisma.tanque.delete({ where: { id } });
    res.json({ message: 'Tanque deletado com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Tanque não encontrado.' : 'Erro ao deletar tanque.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
