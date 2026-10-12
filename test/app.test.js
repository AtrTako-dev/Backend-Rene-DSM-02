const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../app");

function createFakeDatabase() {
    const calls = [];
    return {
        calls,
        async query(sql, params = []) {
            calls.push({ sql, params });
            if (sql === "SELECT * FROM producto") return [[{ id_P: 1, Nombre: "Teclado", Precio: "250.00", id_cat1: 1 }]];
            if (sql === "SELECT * FROM Usuarios") return [[{ id_C: 1, Nombre: "Ana", Correo: "ana@example.com" }]];
            if (sql === "SELECT * FROM Categoria") return [[{ id_cat: 1, Categoria: "Accesorios" }]];
            if (sql.startsWith("SELECT * FROM producto WHERE id_P")) {
                return params[0] === "404" ? [[]] : [[{ id_P: 1, Nombre: "Teclado" }]];
            }
            if (sql.startsWith("SELECT * FROM producto WHERE id_cat1")) return [[{ id_P: 1, Nombre: "Teclado" }]];
            if (sql.startsWith("INSERT INTO producto")) {
                if (Number(params[2]) === 999) {
                    const error = new Error("Referenced category does not exist");
                    error.code = "ER_NO_REFERENCED_ROW_2";
                    error.errno = 1452;
                    throw error;
                }
                return [{ insertId: 12 }];
            }
            if (sql.startsWith("UPDATE producto")) {
                if (Number(params[2]) === 999) {
                    const error = new Error("Referenced category does not exist");
                    error.code = "ER_NO_REFERENCED_ROW_2";
                    error.errno = 1452;
                    throw error;
                }
                const unchanged = params[0] === "Teclado";
                return [{ affectedRows: params.at(-1) === "404" || unchanged ? 0 : 1 }];
            }
            if (sql.startsWith("DELETE FROM producto")) {
                if (params[0] === "referenced") {
                    const error = new Error("Referenced row");
                    error.code = "ER_ROW_IS_REFERENCED_2";
                    throw error;
                }
                return [{ affectedRows: params[0] === "404" ? 0 : 1 }];
            }
            if (sql.startsWith("INSERT INTO Usuarios")) {
                if (params[1] === "taken@example.com") {
                    const error = new Error("Duplicate entry");
                    error.code = "ER_DUP_ENTRY";
                    throw error;
                }
                return [{ insertId: 7 }];
            }
            throw new Error(`Consulta no esperada: ${sql}`);
        }
    };
}

test("rutas HTTP, validaciones y respuestas del backend", async (t) => {
    const database = createFakeDatabase();
    const server = createApp(database).listen(0);
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const request = (path, options) => fetch(`${baseUrl}${path}`, options);
    const json = (method, body) => ({
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
    });

    assert.equal((await request("/")).status, 200);
    assert.equal((await request("/productos")).status, 200);
    assert.equal((await request("/productos/1")).status, 200);
    assert.equal((await request("/productos/404")).status, 404);
    assert.equal((await request("/categorias")).status, 200);
    assert.equal((await request("/categorias/1/productos")).status, 200);
    assert.equal((await request("/usuarios")).status, 200);

    const createdProduct = await request("/productos", json("POST", { Nombre: "Mouse", Precio: 120, id_cat1: 1 }));
    assert.equal(createdProduct.status, 201);
    assert.deepEqual(await createdProduct.json(), { mensaje: "Producto agregado", id: 12 });
    assert.equal((await request("/productos", json("POST", { Nombre: "", Precio: -1, id_cat1: 0 }))).status, 400);
    assert.equal((await request("/productos", { method: "POST" })).status, 400);
    const missingCategoryPost = await request("/productos", json("POST", { Nombre: "Mouse", Precio: 120, id_cat1: 999 }));
    assert.equal(missingCategoryPost.status, 400);
    assert.deepEqual(await missingCategoryPost.json(), { mensaje: "La categoría indicada no existe" });
    assert.equal((await request("/productos/1", json("PUT", { Nombre: "Mouse", Precio: 130, id_cat1: 1 }))).status, 200);
    assert.equal((await request("/productos/1", json("PUT", { Nombre: "Mouse", Precio: 130, id_cat1: 999 }))).status, 400);
    assert.equal((await request("/productos/1", json("PUT", { Nombre: "Teclado", Precio: 250, id_cat1: 1 }))).status, 200);
    assert.equal((await request("/productos", { method: "POST" })).status, 400);
    assert.equal((await request("/productos/404", json("PUT", { Nombre: "Mouse", Precio: 130, id_cat1: 1 }))).status, 404);
    assert.equal((await request("/productos/1", { method: "DELETE" })).status, 200);
    assert.equal((await request("/productos/404", { method: "DELETE" })).status, 404);
    assert.equal((await request("/productos/referenced", { method: "DELETE" })).status, 409);

    assert.equal((await request("/usuarios", json("POST", { Nombre: "Luis", Correo: "luis@example.com" }))).status, 201);
    assert.equal((await request("/usuarios", json("POST", { Nombre: "", Correo: "" }))).status, 400);
    assert.equal((await request("/usuarios", json("POST", { Nombre: "Ana", Correo: "taken@example.com" }))).status, 409);

    const productQuery = database.calls.find(({ sql }) => sql.includes("WHERE id_P = ?"));
    assert.deepEqual(productQuery.params, ["1"]);
    assert.ok(database.calls.every(({ sql }) => !/WHERE id_P = ['"]/.test(sql)));
});
