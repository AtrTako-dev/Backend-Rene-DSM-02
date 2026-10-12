const express = require("express");
const conexion = require("./conexion");
const ProductoModel = require("./models/ProductoModel");
const UsuarioModel = require("./models/UsuarioModel");
const CategoriaModel = require("./models/CategoriaModel");
const ProductoController = require("./controllers/ProductoController");
const UsuarioController = require("./controllers/UsuarioController");
const CategoriaController = require("./controllers/CategoriaController");
const createProductoRouter = require("./routes/productos");
const createUsuarioRouter = require("./routes/usuarios");
const createCategoriaRouter = require("./routes/categorias");

function createApp(database = conexion) {
    const app = express();
    const productoModel = new ProductoModel(database);
    const usuarioModel = new UsuarioModel(database);
    const categoriaModel = new CategoriaModel(database);
    const productoController = new ProductoController(productoModel);
    const usuarioController = new UsuarioController(usuarioModel);
    const categoriaController = new CategoriaController(categoriaModel, productoModel);

    app.use(express.json());
    app.get("/", (req, res) => res.send("Backend conectado a MySQL"));
    app.use("/productos", createProductoRouter(productoController));
    app.use("/usuarios", createUsuarioRouter(usuarioController));
    app.use("/categorias", createCategoriaRouter(categoriaController));
    return app;
}

if (require.main === module) {
    const app = createApp();
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));
}

module.exports = { createApp };
