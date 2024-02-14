-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PEDIDO', 'ENTREGADO', 'PREPARADO', 'FACTURADO');

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "modelo" VARCHAR(50),
    "referencia" VARCHAR(10),
    "unidades" INTEGER NOT NULL,
    "parte" INTEGER,
    "oferta" VARCHAR(10),
    "observaciones" TEXT,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PEDIDO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pedidos_estado_idx" ON "pedidos"("estado");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
