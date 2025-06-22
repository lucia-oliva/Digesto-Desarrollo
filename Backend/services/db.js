import mysql from "mysql2/promise";
import config from "../config.js";

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(sql, params);

      if (result.affectedRows === 0) {
        return null;
      }

      if (result.length === 0) {
        return null;
      }
      return result;
    } catch (error) {
      if (error.errno === 1045) {
        throw new Error("Invalid credentials");
      }

      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    const { code } = error;
    console.log(error);

    return `Error al realizar la consulta: ${code}`;
  }
}

export default { query };
