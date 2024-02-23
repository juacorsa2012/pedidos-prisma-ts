# REST API de pedidos con NodeJS, Prisma ORM y PostgreSQL

A continuación se detallan las características principales de la aplicación.

* Stack tecnológico usado: NodeJs + Express + Prisma ORM. Se ha usado typescript.
* La aplicación se estructura en capas (models, routes, controllers, config, utils, interfaces, schemas, services).
* La configuración de la aplicación está definida en la carpeta src/config.
* El servidor está definido en src/server.ts y la aplicación en src/app.ts.
* Las rutas se pueden proteger por autentificación y por roles (auth.ts).
* En la carpeta schemas están los modelos de validación de Zod.
* En la carpeta seed existen distintos ficheros para rellenar la base de datos.
* Se ha usado los paquetes helmet, xss-clean, y hpp para la seguridad.
* Se ha limitado el número de peticiones que pueden atenderse usando express-rate-limit.
* Los tests están implementados en Jest (carpeta tests).
* TODO: FALTA DOCUMENTAR LA APLICACION USANDO SWAGGER O POSTMAN