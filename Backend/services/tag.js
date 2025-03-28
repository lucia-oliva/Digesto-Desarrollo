import db from "./db.js";


async function getAllTags(){
    const sql = "SELECT nombre FROM tag";
     const results = await db.query(sql,[]);
    return results;
}

export default {getAllTags};
