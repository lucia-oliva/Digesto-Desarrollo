// db/index.js
import mysql from "mysql2/promise";
import config from "../config.js";

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: config.db?.connectionLimit ?? 10,
  queueLimit: 0,
});

/**
 * Detecta el tipo de sentencia SQL por el primer token.
 */
function getStatementType(sql) {
  const first = String(sql).trim().split(/\s+/)[0]?.toUpperCase();
  return first; // "SELECT" | "INSERT" | "UPDATE" | "DELETE" | etc.
}

/**
 * Normaliza el resultado para SELECT.
 * - SELECT => rows (array)
 * - INSERT/UPDATE/DELETE => objeto { affectedRows, insertId, warningStatus }
 */
function normalizeResult(sql, rowsOrResult) {
  const kind = getStatementType(sql);
  if (kind === "SELECT" || kind === "SHOW" || kind === "DESCRIBE") {
    // mysql2 devuelve [rows, fields];
    // si no hay filas, devolvemos [];
    return rowsOrResult;
  }
  // DML Data Manipulation Language
  const r = rowsOrResult || {};
  return {
    affectedRows: r.affectedRows ?? 0,
    insertId: r.insertId ?? undefined,
    warningStatus: r.warningStatus ?? 0,
  };
}

/**
 * Mapea errores comunes
 */
function mapMysqlError(err) {
  // Algunos códigos y errno típicos
  // ER_ACCESS_DENIED_ERROR (1045), ER_PARSE_ERROR (1064), ER_LOCK_DEADLOCK (1213)
  switch (err?.errno) {
    case 1045:
      err.message =
        "Credenciales de base de datos inválidas (ER_ACCESS_DENIED_ERROR).";
      break;
    case 1064:
      err.message = "Error de sintaxis SQL (ER_PARSE_ERROR).";
      break;
    case 1213:
      err.message =
        "Deadlock detectado (ER_LOCK_DEADLOCK). Intente nuevamente.";
      break;
    default:
      // Prefiere ‘code’ cuando exista
      if (err?.code === "PROTOCOL_CONNECTION_LOST") {
        err.message =
          "Conexión a la base de datos perdida (PROTOCOL_CONNECTION_LOST).";
      } else if (err?.code === "ECONNREFUSED") {
        err.message = "No se pudo conectar a la base de datos (ECONNREFUSED).";
      } else if (err?.code === "ETIMEDOUT") {
        err.message = "Timeout conectando a la base de datos (ETIMEDOUT).";
      }
  }
  return err;
}

/**
 * Ejecuta una consulta:
 * - SELECT: devuelve array de filas
 * - DML: devuelve { affectedRows, insertId, warningStatus }
 */
export async function query(sql, params = []) {
  try {
    const [rowsOrResult] = await pool.execute(sql, params);
    return normalizeResult(sql, rowsOrResult);
  } catch (error) {
    throw mapMysqlError(error);
  }
}

/**
 * Devuelve la primera fila o `null` si no hay resultados.
 */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  if (Array.isArray(rows)) {
    return rows[0] ?? null;
  }
  return null;
}

/**
 * Alias semántico para DML (INSERT/UPDATE/DELETE).
 * Siempre retorna { affectedRows, insertId, warningStatus }.
 */
export async function execute(sql, params = []) {
  const kind = getStatementType(sql);
  if (kind === "SELECT") {
    throw new Error("Use query() para SELECT.");
  }
  return query(sql, params);
}

/**
 * Transacción con callback.
 * El callback recibe un helper `tx` para ejecutar sentencias sobre la misma conexión.
 * Si el callback lanza, se hace rollback y se relanza el error.
 * Util cuando creas una normativa y le asignas los tags
 * Ejemplo:
 * await transaction(async (tx) => {
 *   await tx("INSERT INTO a ...", [..]);
 *   await tx("UPDATE b ...", [..]);
 * });
 */

export async function transaction(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Helper para ejecutar usando la misma conexión
    const tx = async (sql, params = []) => {
      const [rowsOrResult] = await conn.execute(sql, params);
      return normalizeResult(sql, rowsOrResult);
    };

    const result = await fn(tx);

    await conn.commit();
    return result;
  } catch (error) {
    try {
      await conn.rollback();
    } catch {}
    throw mapMysqlError(error);
  } finally {
    conn.release();
  }
}

/**
 * Cierra el pool (útil en testeos o al apagar el proceso limpiamente).
 */
export async function closePool() {
  await pool.end();
}

export default {
  pool,
  query,
  queryOne,
  execute,
  transaction,
  closePool,
};
