import db from "./db.js";

export async function getAuditoriasPaginado(page = 1, limite = 10) {
  const offset = (page - 1) * limite;
  const sql = `
    SELECT 
      a.*, DATE_FORMAT(a.fecha,'%Y-%m-%d') AS fecha, n.numero AS numero_normativa, n.titulo AS titulo_normativa, u.nombre AS nombre_usuario, u.email, d.nombre AS nombre_dependencia
    FROM auditoria_normativa a
    INNER JOIN normativa n ON n.id = a.id_normativa
    INNER JOIN usuario u ON u.id = a.id_usuario
    LEFT JOIN dependencia d ON d.id = u.id_dependencia
    ORDER BY a.fecha DESC
    LIMIT ? OFFSET ?;
  `;
  const auditorias = await db.query(sql, [limite, offset]);
  const totalSql = `SELECT COUNT(*) as total FROM auditoria_normativa;`;
  const totalResult = await db.query(totalSql);
  const totalResults = totalResult[0].total;
  return { data: auditorias, totalResults };
}

async function searchAuditoriaByParameters(
  titulo,
  usuario,
  accion,
  dependencia,
  limite = null,
  offset = null
) {
  try {
    let sql =
      "SELECT a.*, DATE_FORMAT(a.fecha,'%Y-%m-%d') AS fecha, n.numero AS numero_normativa, n.titulo AS titulo_normativa, u.nombre AS nombre_usuario, u.email, d.nombre AS nombre_dependencia,COUNT(*) OVER() as total FROM auditoria_normativa a INNER JOIN normativa n ON n.id = a.id_normativa INNER JOIN usuario u ON u.id = a.id_usuario    LEFT JOIN dependencia d ON d.id = u.id_dependencia  WHERE 1=1";
    const params = [];
    if (titulo) {
      sql += " AND n.titulo LIKE ?";
      params.push(`%${titulo}%`);
    }
    if (usuario) {
      sql += " AND u.nombre LIKE ?";
      params.push(`%${usuario}%`);
    }
    if (accion) {
      sql += " AND a.tipo = ?";
      params.push(accion);
    }
    if (dependencia) {
      sql += " AND d.id = ?";
      params.push(dependencia);
    }
    sql += " ORDER BY a.fecha DESC";

    if (limite !== null && offset !== null) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limite) || 10, Number(offset) || 0);
    }
    const results = await db.query(sql, params);
    const totalResults = results?.length > 0 ? results[0].total : 0;
    console.log(params, sql);
    if (!results) {
      console.log(
        "No se encontró las auditorias con los parámetros especificados"
      );
      return { data: [], totalResults };
    }
    return { data: results, totalResults };
  } catch (error) {
    console.error("Error al buscar dependencias por parámetros:", error);
  }
}

export default { getAuditoriasPaginado, searchAuditoriaByParameters };
