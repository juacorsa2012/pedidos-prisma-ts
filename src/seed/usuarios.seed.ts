import bcrypt  from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"

const prisma = new PrismaClient()

async function seed(n: number) {
  await prisma.usuario.deleteMany()
  for (let i = 0; i < n; i++) {                      
    const salt = await bcrypt.genSalt(Constant.SALT)
    const hashPassword = await bcrypt.hash("123456789", salt)     
    await prisma.usuario.create({ 
      data: { 
        nombre: `Usuario ${i}`,
        password: hashPassword,
        email: `usuario${i}@test.com`,
        rol: "ADMIN"
      }})  

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