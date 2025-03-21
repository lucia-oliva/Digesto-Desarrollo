import db from "./db.js";

//BASIC CRUD

//ENDPOINTS ESPECIFICOS
async function getAllYears() {
  const sql = "SELECT DISTINCT anio FROM normativa";
  const results = await db.query(sql,[]);
  return results;
}

async function getAllNormativas(){
    const sql = "SELECT n.titulo, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia, COUNT(*) AS total_busqueda FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas  DESC LIMIT 10";
    const results = await db.query(sql,[]);
    return results;
}

async function searchByNumber(number){
    try{
    const sql = "SELECT * FROM normativa WHERE numero =?";
    const results = await db.query(sql, [number]);
    if(results.length===0){
        console.log("No se encontró la normativa con el número", number);
        return null;
    }
    return results;
}catch(err){
    console.error("Error al buscar normativa por número: ", err);
    throw err;
}
}




async function searchNormativaByParameters(numero,dependencia,emisor,documento,anio, limite = null, offset = null, tags){
    try{

    let sql = "SELECT t.nombre, n.archivo ,n.titulo, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa,  d.nombre AS dependencia FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa LEFT JOIN tag_normativa tn2 ON n.id = tn2.id_normativa LEFT JOIN tag t ON tn2.id_tag = t.id WHERE 1 = 1 AND n.estado = 'publicado'";
    
    let countSql = "SELECT COUNT(*) AS total FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa LEFT JOIN tag_normativa tn2 ON n.id = tn2.id_normativa LEFT JOIN tag t ON tn2.id_tag = t.id WHERE 1 = 1 AND n.estado = 'publicado' ";
    let params = [];
    let countParams = []; 

    console.log("Tags recibidos:", tags);
    console.log("Tipo de tags:", typeof tags);
    

    if (numero) {
        sql += " AND numero = ?";
        countSql += " AND numero = ?";
        params.push(numero);
        countParams.push(numero);
    }
    if (dependencia) {
        sql += " AND id_dependencia = ?";
        countSql += " AND id_dependencia = ?";
        params.push(dependencia);
        countParams.push(dependencia);
    }
    if (emisor) {
        sql += " AND id_emisor = ?";
        countSql += " AND id_emisor = ?";
        params.push(emisor);
        countParams.push(emisor);
    }
    if (documento) {
        sql += " AND id_tipo_normativa = ?";
        countSql += " AND id_tipo_normativa = ?";
        params.push(documento);
        countParams.push(documento);
    }
    if (anio) {
        sql += " AND anio = ?";
        countSql += " AND anio = ?";
        params.push(anio);
        countParams.push(anio);
    }
    console.log("Tags recibidos al inicio:", tags);
        if (tags) {
            
            sql += ` AND t.nombre = (?)`;
            countSql += ` AND t.nombre = (?)`;
            params.push(tags);
            countParams.push(tags);
        }
  
    sql += " GROUP BY n.id ";
    
    if (limite !== null && offset !== null) {
        sql += " LIMIT ? OFFSET ?";
        params.push(Number(limite) || 10, Number(offset) || 0);
    }

   

    console.log("Consulta SQL: " + sql);
    console.log(params); 
    
    const results = await db.query(sql,params);
    const countResults = await db.query(countSql,countParams);

    if(results.length===0){
        console.log("No se encontró la normativa con los parámetros especificados");
        return null;
    }
    return {normativas: results, totalResults: countResults[0].total};
}catch(err){
    console.error("Error al buscar normativa por parámetros: ", err);
    throw err;
}};

//Buscador mediante Tags...
async function searchNormativasByTags(dependencia, tags) {
    console.log(tags);
    const placeholders = tags.map(()=> "?").join(",");
    
    const sql = `
        SELECT n.id, n.titulo, n.numero, n.id_dependencia,
        n.id_tipo_normativa,n.resumen,n.anio, n.estado,
        GROUP_CONCAT(t.nombre SEPARATOR ',') AS tags
        FROM normativa n
        JOIN tag_normativa tn ON n.id = tn.id_normativa
        JOIN tag t ON tn.id_tag = t.id
        WHERE n.id_dependencia = ? AND LOWER(t.nombre) IN (${placeholders})
        GROUP BY n.id
    `;
    try {
        const params = [dependencia, ...tags];
        const results = await db.query(sql, params);
        return results;  
    } catch (error) {
        console.log("Error en la consulta de normativas:", error);
        throw error; 
    }
}

// 10 Normativas mas buscadas
 async function getMostPopularNormatives() {
    const sql = "SELECT n.titulo, e.nombre AS emisor, n.numero, DATE_FORMAT(n.fecha_normativa, '%Y-%m-%d') AS fecha, tn.nombre AS tipo_normativa, n.visitas, d.nombre AS dependencia, COUNT(*) AS total_busqueda FROM normativa n JOIN emisor e ON n.id_emisor = e.id JOIN dependencia d ON d.id = n.id_dependencia JOIN tipo_normativa tn ON tn.id = n.id_tipo_normativa GROUP BY n.id, n.titulo, e.nombre, n.numero, n.fecha_normativa, tn.nombre, n.visitas ORDER BY n.visitas DESC LIMIT 10";
    const results = await db.query(sql, []);
    return results;
}


export default {getAllYears, searchByNumber, searchNormativaByParameters,getAllNormativas,searchNormativasByTags, getMostPopularNormatives}; 