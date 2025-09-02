import db from "./db.js";

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

async function crearRegistroAuditoria({ id_normativa, id_usuario, tipo }) {
  try {
    const fecha = new Date().toISOString().split("T")[0];
    const sql = `
      INSERT INTO auditoria_normativa (id_normativa, id_usuario, fecha, tipo)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(sql, [id_normativa, id_usuario, fecha, tipo]);
    return { ok: true, message: "Registro de auditoría creado" };
  } catch (error) {
    console.error("Error al crear registro de auditoría:", error);
    return { ok: false, message: "Error al crear registro de auditoría" };
  }
}

export default { searchAuditoriaByParameters, crearRegistroAuditoria };
