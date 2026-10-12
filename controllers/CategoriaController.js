class CategoriaController {
    constructor(categoriaModel, productoModel) {
        this.categoriaModel = categoriaModel;
        this.productoModel = productoModel;
    }

    list = async (req, res) => {
        try {
            res.json(await this.categoriaModel.findAll());
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al consultar categorias" });
        }
    };

    listProducts = async (req, res) => {
        try {
            res.json(await this.productoModel.findByCategory(req.params.id));
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al consultar categoria" });
        }
    };
}

module.exports = CategoriaController;
