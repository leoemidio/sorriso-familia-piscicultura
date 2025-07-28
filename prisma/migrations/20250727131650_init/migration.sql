-- CreateTable
CREATE TABLE "Tanque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "tanqueId" INTEGER NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    CONSTRAINT "Lote_tanqueId_fkey" FOREIGN KEY ("tanqueId") REFERENCES "Tanque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Peixe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "loteId" INTEGER NOT NULL,
    "peso" REAL NOT NULL,
    "dataPesagem" DATETIME NOT NULL,
    CONSTRAINT "Peixe_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alimentacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "loteId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "racaoTipo" TEXT NOT NULL,
    "quantidade" REAL NOT NULL,
    CONSTRAINT "Alimentacao_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mortalidade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "loteId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    CONSTRAINT "Mortalidade_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Abate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "loteId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    CONSTRAINT "Abate_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnit" REAL NOT NULL,
    "cliente" TEXT NOT NULL
);
