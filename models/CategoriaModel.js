class CategoriaModel {
    constructor(database) {
        this.database = database;
    }

    async findAll() {
        const [rows] = await this.database.query("SELECT * FROM Categoria");
        return rows;
    }
}

module.exports = CategoriaModel;
