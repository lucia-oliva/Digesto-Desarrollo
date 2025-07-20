
function ConsejoReglamento() {
    const pdfUrl = "../../../public/REGLAMENTO_CS.pdf"; // Asegúrate de tener este archivo en public/

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Reglamento</h1>

            {/* Visor del PDF */}
            <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow-md">
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
