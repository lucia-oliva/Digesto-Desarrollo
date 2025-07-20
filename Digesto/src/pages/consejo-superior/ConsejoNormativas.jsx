import NormativaTable from "../../components/Table/NormativasTable";
function ConsejoNormativas(){
    return(
        <div className="m-5">
        <NormativaTable type={"ListadoNormativa"} filtros={{dependencia: "20"}} modo="ver" />
        </div>
    )
}

export default ConsejoNormativas;