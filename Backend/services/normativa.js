import db from "./db.js";

//BASIC CRUD

//ENDPOINTS ESPECIFICOS
async function getAllYears() {
  const sql = "SELECT DISTINCT anio FROM normativa";
  const results = await db.query(sql,[]);
  return results;
}

async function getAllNormativas(){
    const sql = "SELECT * FROM normativa";
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


async function searchNormativaByParameters(numero,dependencia,emisor,documento,anio, limite = null, offset = null){
    try{

    let sql = "SELECT * FROM normativa where 1 = 1";
    let params = [];

    if (numero) {
        sql += " AND numero = ?";
        params.push(numero);
    }
    if (dependencia) {
        sql += " AND id_dependencia = ?";
        params.push(dependencia);
    }
    if (emisor) {
        sql += " AND id_emisor = ?";
        params.push(emisor);
    }
    if (documento) {
        sql += " AND id_tipo_normativa = ?";
        params.push(documento);
    }
    if (anio) {
        sql += " AND anio = ?";
        params.push(anio);
    }
    //En esta parte se define cuantos registros queremos mostrar a la hora de buscar registros
    if (limite) {
        sql += " LIMIT ?";
        params.push(limite); 
    }
    if(offset){
        sql += " OFFSET ?";
        params.push(offset);
    }

    console.log("Consulta SQL: " + sql);
    console.log(params); 
    
    const results = await db.query(sql,params);

    if(results.length===0){
        console.log("No se encontró la normativa con los parámetros especificados");
        return null;
    }
    return results;
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



export default {getAllYears, searchByNumber, searchNormativaByParameters,getAllNormativas,searchNormativasByTags}; 