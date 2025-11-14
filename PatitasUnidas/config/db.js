import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "patitas_unidas",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
  console.log("✅ Conectado correctamente a MySQL. Resultado:", rows[0].resultado);
} catch (err) {
  console.error("❌ Error al conectar a MySQL:", err);
}

