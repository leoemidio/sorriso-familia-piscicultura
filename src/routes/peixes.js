const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /peixes
router.get('/', async (req, res) => {
  try {
    const peixes = await prisma.peixe.findMany({
      include: { lote: { include: { tanque: true } } }
    });
    res.json(peixes);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar peixes.' });
  }
});

// GET /peixes/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const peixe = await prisma.peixe.findUnique({
      where: { id },
      include: { lote: { include: { tanque: true } } }
    });
    if (!peixe) return res.status(404).json({ error: 'Peixe não encontrado.' });
    res.json(peixe);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar peixe.' });
  }
});

// POST /peixes
router.post('/', async (req, res) => {
  const { loteId, peso, dataPesagem } = req.body;
  try {
    const novo = await prisma.peixe.create({
      data: {
        lote:        { connect: { id: Number(loteId) } },
        peso:        Number(peso),
        dataPesagem: new Date(dataPesagem)
      }
    });
    res.status(201).json(novo);
  } catch {
    res.status(400).json({ error: 'Dados inválidos para criar pesagem.' });
  }
});

// PUT /peixes/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { loteId, peso, dataPesagem } = req.body;
  try {
    await prisma.peixe.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.peixe.update({
      where: { id },
      data: {
        lote:        { connect: { id: Number(loteId) } },
        peso:        Number(peso),
        dataPesagem: new Date(dataPesagem)
      }
    });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Peixe não encontrado.' : 'Erro ao atualizar pesagem.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /peixes/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.peixe.findUniqueOrThrow({ where: { id } });
    await prisma.peixe.delete({ where: { id } });
    res.json({ message: 'Registro de pesagem deletado com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Peixe não encontrado.' : 'Erro ao deletar pesagem.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
