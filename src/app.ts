import express from "express"
import { Constant } from "./config/constants"
import { clienteRouter, productoRouter, proveedorRouter } from "./routes"

export const app = express()

app.disable("x-powered-by")
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(Constant.URL_V1_CLIENTES, clienteRouter)
app.use(Constant.URL_V1_PRODUCTOS, productoRouter)
app.use(Constant.URL_V1_PROVEEDORES, proveedorRouter)

/*
app.use(Constant.URL_V1_PEDIDOS, pedidoRouter)
app.use(Constant.URL_V1_USUARIOS, usuarioRouter)
*/