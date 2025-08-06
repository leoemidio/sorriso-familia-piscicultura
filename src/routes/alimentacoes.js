const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /alimentacoes
router.get('/', async (req, res) => {
  try {
    const alimentacoes = await prisma.alimentacao.findMany({
      include: { lote: { include: { tanque: true } } }
    });
    res.json(alimentacoes);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar alimentações.' });
  }
});

// GET /alimentacoes/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const ali = await prisma.alimentacao.findUnique({
      where: { id },
      include: { lote: { include: { tanque: true } } }
    });
    if (!ali) return res.status(404).json({ error: 'Alimentação não encontrada.' });
    res.json(ali);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar alimentação.' });
  }
});

// POST /alimentacoes
router.post('/', async (req, res) => {
  const { loteId, data, racaoTipo, quantidade } = req.body;
  try {
    const nova = await prisma.alimentacao.create({
      data: {
        lote:       { connect: { id: Number(loteId) } },
        data:       new Date(data),
        racaoTipo,
        quantidade: Number(quantidade)
      }
    });
    res.status(201).json(nova);
  } catch {
    res.status(400).json({ error: 'Dados inválidos para criação.' });
  }
});

// PUT /alimentacoes/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { loteId, data, racaoTipo, quantidade } = req.body;
  try {
    await prisma.alimentacao.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.alimentacao.update({
      where: { id },
      data: {
        lote:       { connect: { id: Number(loteId) } },
        data:       new Date(data),  
        racaoTipo,  
        quantidade: Number(quantidade)
      }
    });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Alimentação não encontrada.' : 'Erro ao atualizar.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /alimentacoes/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.alimentacao.findUniqueOrThrow({ where: { id } });
    await prisma.alimentacao.delete({ where: { id } });
    res.json({ message: 'Alimentação deletada com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Alimentação não encontrada.' : 'Erro ao deletar.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
