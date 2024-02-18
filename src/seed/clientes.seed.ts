import { PrismaClient } from "@prisma/client"
import { logger } from "../config/logger"

const prisma = new PrismaClient()

async function seed(n: number) {
  await prisma.cliente.deleteMany()
  for (let i = 0; i < n; i++) {                      
    await prisma.cliente.create({ data: { nombre: `Cliente ${i}` }})  
    let progreso = Math.ceil((i/n)*100) + '%'
    process.stdout.write('Progreso: ' + progreso + '\r')
  }      
}

const n = +process.argv[2]

seed(n)
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    logger.error(e.message)
    await prisma.$disconnect()
    process.exit(1)
  })