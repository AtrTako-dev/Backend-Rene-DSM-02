const fs = require("node:fs");
const path = require("node:path");

const envPath = path.join(__dirname, "..", ".env");
if (typeof process.loadEnvFile === "function" && fs.existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

const mysql = require("mysql2/promise");

function createDatabasePool() {
    return mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "tienda_backend",
        port: Number(process.env.DB_PORT || 3306),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

module.exports = { createDatabasePool };
