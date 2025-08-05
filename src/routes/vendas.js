const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /vendas
router.get('/', async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany();
    res.json(vendas);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar vendas.' });
  }
});

// GET /vendas/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const venda = await prisma.venda.findUnique({ where: { id } });
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada.' });
    res.json(venda);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar venda.' });
  }
});

// POST /vendas
router.post('/', async (req, res) => {
  const { data, tipo, quantidade, precoUnit, cliente } = req.body;
  try {
    const nova = await prisma.venda.create({
      data: {
        data:       new Date(data),
        tipo,
        quantidade: Number(quantidade),
        precoUnit:  Number(precoUnit),
        cliente
      }
    });
    res.status(201).json(nova);
  } catch {
    res.status(400).json({ error: 'Dados inválidos para criar venda.' });
  }
});

// PUT /vendas/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { data, tipo, quantidade, precoUnit, cliente } = req.body;
  try {
    await prisma.venda.findUniqueOrThrow({ where: { id } });
    const updated = await prisma.venda.update({
      where: { id },
      data: {
        data:       new Date(data),
        tipo,
        quantidade: Number(quantidade),
        precoUnit:  Number(precoUnit),
        cliente
      }
    });
    res.json(updated);
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Venda não encontrada.' : 'Erro ao atualizar venda.';
    res.status(404).json({ error: msg });
  }
});

// DELETE /vendas/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.venda.findUniqueOrThrow({ where: { id } });
    await prisma.venda.delete({ where: { id } });
    res.json({ message: 'Venda deletada com sucesso.' });
  } catch (e) {
    const msg = e.code === 'P2025' ? 'Venda não encontrada.' : 'Erro ao deletar venda.';
    res.status(404).json({ error: msg });
  }
});

module.exports = router;
