CREATE SCHEMA IF NOT EXISTS tienda_backend;

USE tienda_backend;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id_C INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS Categoria (
    id_cat INT AUTO_INCREMENT PRIMARY KEY,
    Categoria VARCHAR(100) NOT NULL
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS producto (
    id_P INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    id_cat1 INT NOT NULL,

    FOREIGN KEY (id_cat1)
        REFERENCES Categoria(id_cat)
);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS Compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_C INT NOT NULL,
    id_P INT NOT NULL,
    Cantidad INT NOT NULL,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_C)
        REFERENCES Usuarios(id_C),

    FOREIGN KEY (id_P)
        REFERENCES producto(id_P)
);
