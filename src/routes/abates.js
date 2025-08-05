const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /abates
router.get('/', async (req, res) => {
  try {
    const abates = await prisma.abate.findMany({
      include: { lote: { include: { tanque: true } } }
    });
    res.json(abates);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar abates.' });
  }
});

// GET /abates/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const abate = await prisma.abate.findUnique({
      where: { id },
      include: { lote: { include: { tanque: true } } }
    });
    if (!abate) return res.status(404).json({ error: 'Abate não encontrado.' });
    res.json(abate);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar abate.' });
  }
});

// POST /abates
router.post('/', async (req, res) => {
  const { loteId, data, quantidade, tipo } = req.body;
  try {
    const novo = await prisma.abate.create({
      data: {
        lote:       { connect: { id: Number(loteId) } },
        data:       new Date(data),
        quantidade: Number(quantidade),
        tipo
      }
    });
    res.status(201).json(novo);
  } catch {
    res.status(400).json({ error: 'Dados inválidos para criação de abate.' });
  }
});

// PUT /abates/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { loteId, data, quantidade, tipo } = req.body;
  try {
    await prisma.abate.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.abate.update({
      where: { id },
      data: {
        lote:       { connect: { id: Number(loteId) } },
        data:       new Date(data),
        quantidade: Number(quantidade),
        tipo
      }
    });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Abate não encontrado.' : 'Erro ao atualizar abate.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /abates/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.abate.findUniqueOrThrow({ where: { id } });
    await prisma.abate.delete({ where: { id } });
    res.json({ message: 'Abate deletado com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Abate não encontrado.' : 'Erro ao deletar abate.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
