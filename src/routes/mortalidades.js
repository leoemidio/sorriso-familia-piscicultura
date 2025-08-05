const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /mortalidades
router.get('/', async (req, res) => {
  try {
    const mort = await prisma.mortalidade.findMany({
      include: { lote: { include: { tanque: true } } }
    });
    res.json(mort);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar mortalidades.' });
  }
});

// GET /mortalidades/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const mort = await prisma.mortalidade.findUnique({
      where: { id },
      include: { lote: { include: { tanque: true } } }
    });
    if (!mort) return res.status(404).json({ error: 'Registro não encontrado.' });
    res.json(mort);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar registro.' });
  }
});

// POST /mortalidades
router.post('/', async (req, res) => {
  const { loteId, data, quantidade, motivo } = req.body;
  try {
    const novo = await prisma.mortalidade.create({
      data: {
        lote:       { connect: { id: Number(loteId) } },
        data:       new Date(data),
        quantidade: Number(quantidade),
        motivo
      }
    });
    res.status(201).json(novo);
  } catch {
    res.status(400).json({ error: 'Dados inválidos para criação.' });
  }
});

// PUT /mortalidades/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { loteId, data, quantidade, motivo } = req.body;
  try {
    await prisma.mortalidade.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.mortalidade.update({
      where: { id },
      data: {
        lote:       { connect: { id: Number(loteId) } },
        data:       new Date(data),
        quantidade: Number(quantidade),
        motivo
      }
    });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Registro não encontrado.' : 'Erro ao atualizar.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /mortalidades/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.mortalidade.findUniqueOrThrow({ where: { id } });
    await prisma.mortalidade.delete({ where: { id } });
    res.json({ message: 'Registro deletado com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Registro não encontrado.' : 'Erro ao deletar.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
