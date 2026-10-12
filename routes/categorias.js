const express = require("express");

function createCategoriaRouter(controller) {
    const router = express.Router();
    router.get("/", controller.list);
    router.get("/:id/productos", controller.listProducts);
    return router;
}

module.exports = createCategoriaRouter;
