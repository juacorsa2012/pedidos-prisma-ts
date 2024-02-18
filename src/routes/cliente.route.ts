import { Router } from "express"
import { CreateClienteSchema, UpdateClienteSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { ClienteController } from "../controllers"

export const clienteRouter: Router = Router()

clienteRouter.get('/', ClienteController.obtenerClientes)

clienteRouter.get('/:id', ClienteController.obtenerCliente)

clienteRouter.post('/', validateSchema(CreateClienteSchema), ClienteController.registrarCliente)

clienteRouter.put('/:id', validateSchema(UpdateClienteSchema), ClienteController.actualizarCliente)