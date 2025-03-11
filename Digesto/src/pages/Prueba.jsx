import Table from "../components/layout/Table";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
function Prueba(){
    const [normativas, setNormativas] = useState([]);
    const [{ data, loading, error }] = useAxios(
        //"http://localhost:3000/api/normativa/normativasMasBuscadas"
        "http://localhost:3000/api/normativa/normativas"
      );
    
      useEffect(() => {
          if (data && data.length > 0) {
            setNormativas(data);
            console.log(data);
          }
          if (error) {
            console.error("Error al obtener las normativas mas buscadas", error);
          }
        }, [data, error]);
    
    return(
        
        <Table normativas={normativas}/>
    )
}

export default Prueba;