class UsuarioModel {
    constructor(database) {
        this.database = database;
    }

    async findAll() {
        const [rows] = await this.database.query("SELECT * FROM Usuarios");
        return rows;
    }

    async create({ Nombre, Correo }) {
        const [result] = await this.database.query(
            "INSERT INTO Usuarios (Nombre, Correo) VALUES (?, ?)",
            [Nombre.trim(), Correo.trim()]
        );
        return result.insertId;
    }
}

module.exports = UsuarioModel;
