import mysql from "mysql2/promise";
import config from "../config.js";

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(sql, params);

    if (results.length === 0) {
      throw new Error("No se encontraron resultados");
    }

    return results;
  } catch (error) {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      throw new Error("Invalid credentials");
    } else {
      throw error;
    }
  } finally {
    connection.release();
  }
  // return pool.query(sql, params);
}

export default { query };
