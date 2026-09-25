import db from "./db.js";

function httpError(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  error.publicMessage = publicMessage;
  return error;
}

async function getById(id) {
  const result = await db.queryOne(
    "SELECT id, nombre AS Tag FROM tag WHERE id = ?",
    [id],
  );

  if (!result) {
    throw httpError(404, "Tag no encontrado.");
  }

  return result;
}

async function edit(data) {
  const { id, nombre } = data;

  const existing = await db.queryOne(
    "SELECT id FROM tag WHERE nombre = ? AND id != ?",
    [nombre, id],
  );

  if (existing) {
    throw httpError(409, "Ya existe un tag con ese nombre.");
  }

  const result = await db.execute(
    "UPDATE tag SET nombre = ? WHERE id = ?",
    [nombre, id],
  );

  if (result.affectedRows === 0) {
    throw httpError(404, "Tag no encontrado o sin cambios.");
  }

  return {
    success: true,
    message: `Tag '${nombre}' actualizado correctamente`,
  };
}

async function getAllTags() {
  const sql = "SELECT nombre FROM tag";
  const results = await db.query(sql, []);

  return results;
}

async function create(data) {
  const { Tag } = data;

  const existing = await db.queryOne(
    "SELECT id FROM tag WHERE nombre = ?",
    [Tag],
  );

  if (existing) {
    return {
      success: false,
      message: `Tag '${Tag}' ya existe`,
    };
  }

  const result = await db.execute(
    "INSERT INTO tag (nombre) VALUES (?)",
    [Tag],
  );

  return {
    success: true,
    id: result.insertId,
    message: `Tag '${Tag}' creado correctamente`,
  };
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [
    ...new Set(
      tags
        .map((tag) => String(tag ?? "").trim())
        .filter(Boolean),
    ),
  ];
}

function assertAtLeastOneTag(tags) {
  const normalizedTags = normalizeTags(tags);

  if (normalizedTags.length === 0) {
    throw httpError(400, "Debe ingresar al menos un tag.");
  }

  return normalizedTags;
}

async function getOrCreateTagId(nombre) {
  const existingTagRow = await db.queryOne(
    "SELECT id FROM tag WHERE nombre = ?",
    [nombre],
  );

  if (existingTagRow) {
    return existingTagRow.id;
  }

  const result = await db.execute(
    "INSERT INTO tag (nombre) VALUES (?)",
    [nombre],
  );

  return result.insertId;
}

async function setTagsForNormativa(normativaId, tags) {
  const normalizedTags = assertAtLeastOneTag(tags);
  const desiredTagIds = [];

  for (const tag of normalizedTags) {
    const tagId = await getOrCreateTagId(tag);
    desiredTagIds.push(tagId);

    const existingLink = await db.queryOne(
      "SELECT 1 FROM tag_normativa WHERE id_normativa = ? AND id_tag = ?",
      [normativaId, tagId],
    );

    if (!existingLink) {
      await db.execute(
        "INSERT INTO tag_normativa (id_normativa, id_tag) VALUES (?, ?)",
        [normativaId, tagId],
      );
    }
  }

  const currentLinks = await db.query(
    "SELECT id_tag FROM tag_normativa WHERE id_normativa = ?",
    [normativaId],
  );

  const desiredTagIdsSet = new Set(desiredTagIds);

  for (const link of currentLinks) {
    if (!desiredTagIdsSet.has(link.id_tag)) {
      await db.execute(
        "DELETE FROM tag_normativa WHERE id_normativa = ? AND id_tag = ?",
        [normativaId, link.id_tag],
      );
    }
  }

  return {
    success: true,
    tags: normalizedTags,
  };
}

async function getTagsByNormativaId(id) {
  const sql = `
    SELECT t.nombre AS tag
    FROM tag_normativa tn
    JOIN tag t ON tn.id_tag = t.id
    WHERE tn.id_normativa = ?
  `;

  const results = await db.query(sql, [id]);

  return results.map((row) => row.tag);
}

async function searchTagsByParameters(
  nombre,
  letra,
  limite = null,
  offset = null,
) {
  const where = [];
  const params = [];

  if (letra) {
    if (letra === "#") {
      where.push("t.nombre REGEXP '^[^A-Za-z]'");
    } else {
      where.push("t.nombre LIKE ?");
      params.push(`${letra}%`);
    }
  }

  if (nombre) {
    where.push("t.nombre LIKE ?");
    params.push(`%${nombre}%`);
  }

  const whereSql = where.length
    ? `WHERE ${where.join(" AND ")}`
    : "";

  let sql = `
    SELECT
      t.id,
      t.nombre,
      COALESCE(uses.cantidad_usos, 0) AS cantidad_usos
    FROM tag t
    LEFT JOIN (
      SELECT id_tag, COUNT(*) AS cantidad_usos
      FROM tag_normativa
      GROUP BY id_tag
    ) AS uses ON uses.id_tag = t.id
    ${whereSql}
    ORDER BY t.nombre ASC
  `;

  const listParams = [...params];

  if (limite !== null && offset !== null) {
    sql += " LIMIT ? OFFSET ?";
    listParams.push(Number(limite) || 10, Number(offset) || 0);
  }

  const rows = await db.query(sql, listParams);

  const totalSql = `
    SELECT COUNT(*) AS total
    FROM tag t
    ${whereSql}
  `;

  const [totalRow] = await db.query(totalSql, params);
  const totalResults = totalRow?.total ?? 0;

  return {
    data: rows,
    totalResults,
  };
}

async function eliminar(id) {
  await db.execute(
    "DELETE FROM tag_normativa WHERE id_tag = ?",
    [id],
  );

  const result = await db.execute(
    "DELETE FROM tag WHERE id = ?",
    [id],
  );

  if (!result || result.affectedRows === 0) {
    throw httpError(404, "Tag no encontrado o ya eliminado.");
  }

  return {
    success: true,
  };
}

export default {
  getAllTags,
  eliminar,
  getTagsByNormativaId,
  setTagsForNormativa,
  searchTagsByParameters,
  create,
  edit,
  getById,
};