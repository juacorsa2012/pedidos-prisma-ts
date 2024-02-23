import express from "express"
import hpp from "hpp"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"
import { Constant } from "./config/constants"
import { clienteRouter, pedidoRouter, productoRouter, proveedorRouter, usuarioRouter } from "./routes"
import { corsMiddleware } from "./middlewares/cors"


export const app = express()

app.disable("x-powered-by")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(corsMiddleware())
app.use(helmet())
app.use(hpp())

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	limit: 100
})

app.use(limiter)

app.use(Constant.URL_V1_CLIENTES, clienteRouter)
app.use(Constant.URL_V1_PRODUCTOS, productoRouter)
app.use(Constant.URL_V1_PROVEEDORES, proveedorRouter)
app.use(Constant.URL_V1_USUARIOS, usuarioRouter)
app.use(Constant.URL_V1_PEDIDOS, pedidoRouter)