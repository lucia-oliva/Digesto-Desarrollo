import NormativaTable from "../../components/Table/NormativasTable";
import { useLocation } from "react-router";

function VistaAdministrativa() {
  const location = useLocation();
  const type = location.pathname.split("/")[2];

  return (
    <div className="container ">
      <h1 className="text-2xl font-bold mb-4">Vista Administrativa</h1>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla perspiciatis velit beatae totam. Accusamus, aperiam. Impedit alias quisquam, odit nemo quas hic! Labore, dolor praesentium vitae assumenda corrupti placeat perspiciatis.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur illum accusamus, facere aliquam perspiciatis iste nulla temporibus nam numquam ipsam, asperiores voluptatum. Deserunt corrupti, possimus ea quidem expedita error facilis!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Error similique sed voluptas? Pariatur vitae error possimus mollitia minima aliquam voluptate. Suscipit beatae voluptate maiores eveniet minus dignissimos ut consequuntur nihil?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus culpa expedita nisi iste dolorum. Consequuntur tempore tenetur doloremque atque vel iusto, quod cum. Dolorum nulla iure voluptas quod natus aspernatur?
      <NormativaTable type={type} />
    </div>
  );
}

export { VistaAdministrativa };
