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


async function searchNormativaByParameters(numero,dependencia,emisor,documento,anio, limite = null){
    console.log("Buscando normativa con los siguientes parámetros:");
    console.log("Numero:", numero);
    console.log("Dependencia:", dependencia);
    console.log("Emisor:", emisor);
    console.log("Documento:", documento);
    console.log("Anio:", anio);
    console.log("Limite:", limite);
    
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
        let limiteInt = parseInt(limite);
        if(!isNaN(limiteInt)){
        sql += " LIMIT ?";
        params.push(limiteInt);
        }
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


export default {getAllYears, searchByNumber, searchNormativaByParameters,getAllNormativas}; 