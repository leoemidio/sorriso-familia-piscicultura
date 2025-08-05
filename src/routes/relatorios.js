const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

/** Estoque de peixes */
router.get('/estoque', async (req, res) => {
  const { por } = req.query;
  if (!['tanque','lote'].includes(por)) {
    return res.status(400).json({ error: 'Use ?por=tanque ou lote' });
  }
  try {
    const peixes = await prisma.peixe.findMany({
      include: { lote: { include: { tanque:true } } }
    });
    const mapa = {};
    peixes.forEach(p => {
      if (por==='tanque') {
        const t = p.lote.tanque;
        mapa[t.id] = mapa[t.id]||{ tanqueId:t.id,tanqueNome:t.nome,quantidade:0,pesoTotal:0 };
        mapa[t.id].quantidade++;
        mapa[t.id].pesoTotal += p.peso;
      } else {
        const l = p.lote;
        mapa[l.id] = mapa[l.id]||{ loteId:l.id,loteNome:l.nome,tanqueId:l.tanqueId,quantidade:0,pesoTotal:0 };
        mapa[l.id].quantidade++;
        mapa[l.id].pesoTotal += p.peso;
      }
    });
    res.json(Object.values(mapa));
  } catch {
    res.status(500).json({ error:'Erro no relatório de estoque.' });
  }
});

/** Consumo de ração */
router.get('/consumo-racao', async (req, res) => {
  const { inicio, fim } = req.query;
  if (!inicio||!fim) {
    return res.status(400).json({ error:'Use ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD' });
  }
  try {
    const regs = await prisma.alimentacao.findMany({
      where:{ data:{ gte:new Date(inicio), lte:new Date(fim) } },
      select:{ data:true, quantidade:true }
    });
    const mapa={};
    regs.forEach(a=>{
      const d=a.data.toISOString().slice(0,10);
      mapa[d]=(mapa[d]||0)+a.quantidade;
    });
    res.json(Object.entries(mapa).map(([data,quant])=>({ data, quantidade:quant })));
  } catch {
    res.status(500).json({ error:'Erro no relatório consumo de ração.' });
  }
});

/** Taxa de mortalidade */
router.get('/taxa-mortalidade', async (req, res) => {
  const { inicio, fim } = req.query;
  if (!inicio||!fim) {
    return res.status(400).json({ error:'Use ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD' });
  }
  try {
    const mSum = await prisma.mortalidade.aggregate({
      _sum:{ quantidade:true },
      where:{ data:{ gte:new Date(inicio), lte:new Date(fim) } }
    });
    const eSum = await prisma.lote.aggregate({
      _sum:{ quantidade:true },
      where:{ dataEntrada:{ gte:new Date(inicio), lte:new Date(fim) } }
    });
    const mortos = mSum._sum.quantidade||0;
    const entr = eSum._sum.quantidade||0;
    const taxa = entr>0 ? +(mortos/entr*100).toFixed(2) : 0;
    res.json({ inicio, fim, totalMortos:mortos, totalEntradas:entr, taxa });
  } catch {
    res.status(500).json({ error:'Erro no relatório taxa de mortalidade.' });
  }
});

/** Produção de abate */
router.get('/producao-abate', async (req, res) => {
  const { inicio, fim } = req.query;
  if (!inicio||!fim) {
    return res.status(400).json({ error:'Use ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD' });
  }
  try {
    const grupos = await prisma.abate.groupBy({
      by:['tipo'],
      where:{ data:{ gte:new Date(inicio), lte:new Date(fim) } },
      _sum:{ quantidade:true }
    });
    res.json(grupos.map(g=>({ tipo:g.tipo, total:g._sum.quantidade||0 })));
  } catch {
    res.status(500).json({ error:'Erro no relatório produção de abate.' });
  }
});

/** Faturamento de vendas */
router.get('/faturamento', async (req, res) => {
  const { inicio, fim } = req.query;
  if (!inicio||!fim) {
    return res.status(400).json({ error:'Use ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD' });
  }
  try {
    const vendas = await prisma.venda.findMany({
      where:{ data:{ gte:new Date(inicio), lte:new Date(fim) } },
      select:{ data:true, quantidade:true, precoUnit:true }
    });
    const mapa={};
    vendas.forEach(v=>{
      const d=v.data.toISOString().slice(0,10);
      mapa[d] = (mapa[d]||0) + v.quantidade*v.precoUnit;
    });
    res.json(Object.entries(mapa).map(([data,total])=>({ data,total:+total.toFixed(2) })));
  } catch {
    res.status(500).json({ error:'Erro no relatório de faturamento.' });
  }
});

module.exports = router;
