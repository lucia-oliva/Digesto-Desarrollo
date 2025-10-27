
import mysql from "mysql2/promise";
import config from "../config.js";

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: config.db?.connectionLimit ?? 10,
  queueLimit: 0,
});


function getStatementType(sql) {
  const first = String(sql).trim().split(/\s+/)[0]?.toUpperCase();
  return first; 
}


function normalizeResult(sql, rowsOrResult) {
  const kind = getStatementType(sql);
  if (kind === "SELECT" || kind === "SHOW" || kind === "DESCRIBE") {
   
    return rowsOrResult;
  }
 
  const r = rowsOrResult || {};
  return {
    affectedRows: r.affectedRows ?? 0,
    insertId: r.insertId ?? undefined,
    warningStatus: r.warningStatus ?? 0,
  };
}


function mapMysqlError(err) {
  
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


export async function query(sql, params = []) {
  try {
    const [rowsOrResult] = await pool.execute(sql, params);
    return normalizeResult(sql, rowsOrResult);
  } catch (error) {
    throw mapMysqlError(error);
  }
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  if (Array.isArray(rows)) {
    return rows[0] ?? null;
  }
  return null;
}


export async function execute(sql, params = []) {
  const kind = getStatementType(sql);
  if (kind === "SELECT") {
    throw new Error("Use query() para SELECT.");
  }
  return query(sql, params);
}


export async function transaction(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

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
