import Header from  "../components/Header";

function About(){
return (
<>
    <body className="bg-[#1B5B98]">
        <Header/>
        <div className="px-8">
            <h1 className="text-cyan-400 text-3xl text-center font-bold font-[Montserrat] mt-8">Sobre Digesto UNLaR</h1>
            <h3 className="text-white text-center font-medium text-lg font-[Montserrat] mt-2" >Los objetivos de desarrollo de esta pagina son:</h3>
            <br />
            <ul>
                <li>
                    <p className="text-white text-center font-[Raleway] font-sm bg-blue-900 p-4 rounded-md">
                    Disponer de un espacio digital a través del cual poner en conocimiento de la comunidad: los actos normativos (Ordenanzas y Resoluciones) emitidos por la Institución, las Actas y Resoluciones del Concejo Directivo y Decano como también los Convenios que la misma celebre con otras instituciones.
                    </p>
                    <br/>
                </li>
                <li>
                    <p className="text-white text-center font-[Raleway] bg-blue-800 p-4 rounded-md">
                    Crear un resguardo en formato digital de la documentación emitida; y a futuro, disponer los recursos necesarios para la digitalización de los escritos emitidos hasta la actualidad.
                    </p>
                    <br />
                </li>
                <li>
                    <p className="text-white text-center font-[Raleway] bg-blue-700 p-4 rounded-md">
                    Mantener un índice electrónico de consulta que permita efectuar búsquedas de documentos por diferentes criterios, estando disponible a toda persona que desee efectuar una consulta sobre la base de documentos.
                    </p>
                    <br />
                </li>
                <li>
                    <p className="text-white text-center font-[Raleway]
                    bg-blue-600 p-4 rounded-md">
                    Los documentos publicados en el Digesto Digital <strong className="text-blue-950">carecerán de validez para su presentación ante terceros y para realizar tramitaciones de cualquier índole</strong>, salvo que fueren autenticados por autoridad competente de la universidad o de la unidad académica que corresponda.
                    </p>
                    <br />
                </li>
                
            </ul>
            <h3 className="text-white text-center font-[Raleway] mb-6">Para aprovechar al máximo este servicio, recomendamos consultar la ayuda del sistema disponible 
                <a href="#blank" className="underline decoration-sky-500 text-cyan-400"><strong> aquí.</strong></a>
            </h3>
        </div> 
    </body>
</>
)
}

export default About;