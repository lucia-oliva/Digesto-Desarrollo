import mysql from "mysql2/promise";
import config from "../config.js";

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.query(sql, params);

      if (results.length === 0) {
        throw new Error("No se encontraron resultados");
      }
      return results;
    } catch (error) {
      if (error.errno === 1045) {
        throw new Error("Invalid credentials");
      } else {
        throw error;
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    const { code } = error;
    console.log(error);
    
    return `Error al realizar la consulta: ${code}`;
  }
  // return pool.query(sql, params);
}

export default { query };
