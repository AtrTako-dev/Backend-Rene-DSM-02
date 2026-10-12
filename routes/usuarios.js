const express = require("express");

function createUsuarioRouter(controller) {
    const router = express.Router();
    router.get("/", controller.list);
    router.post("/", controller.create);
    return router;
}

module.exports = createUsuarioRouter;
