const Producto = require("../models/Producto");

class ProductoController {
    constructor(productoModel) {
        this.productoModel = productoModel;
    }

    list = async (req, res) => {
        try {
            res.json(await this.productoModel.findAll());
        } catch (error) {
            this.handleError(res, error, "Error al consultar productos");
        }
    };

    getById = async (req, res) => {
        try {
            const producto = await this.productoModel.findById(req.params.id);
            if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
            res.json(producto);
        } catch (error) {
            this.handleError(res, error, "Error al buscar producto");
        }
    };

    create = async (req, res) => {
        const producto = Producto.fromRequest(req.body);
        if (!producto.isValid()) return res.status(400).json({ mensaje: "Datos del producto invalidos" });
        try {
            const id = await this.productoModel.create(producto);
            res.status(201).json({ mensaje: "Producto agregado", id });
        } catch (error) {
            if (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452) {
                return res.status(400).json({ mensaje: "La categoría indicada no existe" });
            }
            this.handleError(res, error, "Error al agregar producto");
        }
    };

    update = async (req, res) => {
        const producto = Producto.fromRequest(req.body);
        if (!producto.isValid()) return res.status(400).json({ mensaje: "Datos del producto invalidos" });
        try {
            const updated = await this.productoModel.update(req.params.id, producto);
            if (!updated) return res.status(404).json({ mensaje: "Producto no encontrado" });
            res.json({ mensaje: "Producto actualizado" });
        } catch (error) {
            if (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452) {
                return res.status(400).json({ mensaje: "La categoría indicada no existe" });
            }
            this.handleError(res, error, "Error al actualizar producto");
        }
    };

    remove = async (req, res) => {
        try {
            const deleted = await this.productoModel.delete(req.params.id);
            if (!deleted) return res.status(404).json({ mensaje: "Producto no encontrado" });
            res.json({ mensaje: "Producto eliminado" });
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({ mensaje: "No se puede eliminar: el producto tiene compras registradas" });
            }
            this.handleError(res, error, "Error al eliminar producto");
        }
    };

    handleError(res, error, message) {
        console.error(error);
        res.status(500).json({ mensaje: message });
    }
}

module.exports = ProductoController;
