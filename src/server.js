const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Rota para listar todos os tanques
app.get('/tanques', async (req, res) => {
  const tanques = await prisma.tanque.findMany();
  res.json(tanques);
});

// ✅ Rota para buscar um tanque por ID
app.get('/tanques/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tanque = await prisma.tanque.findUnique({ where: { id: Number(id) } });
    if (!tanque) return res.status(404).json({ error: 'Tanque não encontrado.' });

    res.json(tanque);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tanque.' });
  }
});

// ✅ Criar novo tanque
app.post('/tanques', async (req, res) => {
  const { nome, capacidade } = req.body;

  try {
    const novoTanque = await prisma.tanque.create({
      data: {
        nome,
        capacidade,
      },
    });
    res.status(201).json(novoTanque);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tanque.' });
  }
});

// ✅ Atualizar tanque existente (PUT)
app.put('/tanques/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, capacidade } = req.body;

  try {
    const existe = await prisma.tanque.findUnique({ where: { id: Number(id) } });
    if (!existe) {
      return res.status(404).json({ error: 'Tanque não encontrado.' });
    }

    const tanqueAtualizado = await prisma.tanque.update({
      where: { id: Number(id) },
      data: { nome, capacidade },
    });

    res.json(tanqueAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tanque.' });
  }
});

// ✅ Deletar um tanque
app.delete('/tanques/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existe = await prisma.tanque.findUnique({ where: { id: Number(id) } });
    if (!existe) return res.status(404).json({ error: 'Tanque não encontrado.' });

    await prisma.tanque.delete({ where: { id: Number(id) } });
    res.json({ message: 'Tanque deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o tanque.' });
  }
});

// ✅ Iniciar o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
console.log(`Servidor rodando na porta ${PORT}`);
});