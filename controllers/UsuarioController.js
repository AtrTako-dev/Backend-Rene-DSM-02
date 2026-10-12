class UsuarioController {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
    }

    list = async (req, res) => {
        try {
            res.json(await this.usuarioModel.findAll());
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al consultar usuarios" });
        }
    };

    create = async (req, res) => {
        const { Nombre, Correo } = req.body || {};
        if (typeof Nombre !== "string" || !Nombre.trim() || typeof Correo !== "string" || !Correo.trim()) {
            return res.status(400).json({ mensaje: "Nombre y correo obligatorios" });
        }
        try {
            const id = await this.usuarioModel.create({ Nombre, Correo });
            res.status(201).json({ mensaje: "Usuario agregado", id });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensaje: "El correo ya esta registrado" });
            }
            console.error(error);
            res.status(500).json({ mensaje: "Error al agregar usuario" });
        }
    };
}

module.exports = UsuarioController;
