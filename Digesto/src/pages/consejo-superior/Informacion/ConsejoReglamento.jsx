
function ConsejoReglamento() {
    const pdfUrl = "../../../../public/REGLAMENTO_CS.pdf"; 

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pt-25">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">Reglamento</h1>

            {/* Visor del PDF */}
            <div
            className="w-full h-[600px] border rounded-lg overflow-hidden"
            style={{
                boxShadow: "4px 4px 19px 5px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)"
            }}
            >

                <iframe
                    src={pdfUrl}
                    title="Reglamento PDF"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

export default ConsejoReglamento;
