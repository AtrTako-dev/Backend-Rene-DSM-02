class Producto {
    constructor({ Nombre, Precio, id_cat1 }) {
        this.Nombre = Nombre;
        this.Precio = Precio;
        this.id_cat1 = id_cat1;
    }

    static fromRequest(body = {}) {
        return new Producto({
            Nombre: body.Nombre,
            Precio: body.Precio,
            id_cat1: body.id_cat1
        });
    }

    isValid() {
        return typeof this.Nombre === "string" && this.Nombre.trim().length > 0
            && typeof this.Precio === "number" && Number.isFinite(this.Precio)
            && this.Precio >= 0
            && Number.isInteger(Number(this.id_cat1)) && Number(this.id_cat1) > 0;
    }
}

module.exports = Producto;
