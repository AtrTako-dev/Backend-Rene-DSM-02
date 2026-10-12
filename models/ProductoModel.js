class ProductoModel {
    constructor(database) {
        this.database = database;
    }

    async findAll() {
        const [rows] = await this.database.query("SELECT * FROM producto");
        return rows;
    }

    async findById(id) {
        const [rows] = await this.database.query(
            "SELECT * FROM producto WHERE id_P = ?", [id]
        );
        return rows[0] || null;
    }

    async findByCategory(categoryId) {
        const [rows] = await this.database.query(
            "SELECT * FROM producto WHERE id_cat1 = ?", [categoryId]
        );
        return rows;
    }

    async create(producto) {
        const [result] = await this.database.query(
            "INSERT INTO producto (Nombre, Precio, id_cat1) VALUES (?, ?, ?)",
            [producto.Nombre.trim(), producto.Precio, producto.id_cat1]
        );
        return result.insertId;
    }

    async update(id, producto) {
        const [result] = await this.database.query(
            "UPDATE producto SET Nombre = ?, Precio = ?, id_cat1 = ? WHERE id_P = ?",
            [producto.Nombre.trim(), producto.Precio, producto.id_cat1, id]
        );
        if (result.affectedRows > 0) return true;
        return (await this.findById(id)) !== null;
    }

    async delete(id) {
        const [result] = await this.database.query(
            "DELETE FROM producto WHERE id_P = ?", [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ProductoModel;
