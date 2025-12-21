const Section1 = () => {
    return (
        <section className="relative w-full h-full max-h-[650px] bg-gradient-to-b from-[#9C370B] to-[#BF5F35] p-10">
            <div className="absolute top-0  left-1/2 transform -translate-x-1/2">
                <img src="./assets/images/home/corde.png" className="w-40" />
            </div>
            <img src="./assets/images/home/kristelle.png" className="absolute bottom-0 left-0 max-h-[500px]" />
            <img src="./assets/images/home/franck.png" className="absolute bottom-0 right-0 max-h-[500px]" />
            <div className="absolute bottom-0 left-0 w-full h-[82px] bg-gradient-to-t from-[#E68A66] to-transparent"></div>
            
            <div className="absolute inset-0 z-100 flex flex-col items-center space-y-3 z-[1] pt-10 space-y-4 h-full">
                <p className="eb-garamond text-[35px] text-[#FFD365] font-bold underline decoration-white decoration-1 underline-offset-10 decoration-dashed">M.Jores</p>
                <p className="eb-garamond text-[20px] text-white">Vous êtes conviés au mariage de</p>
                <p className="playfair-display font-bold text-[30px] text-white">Kristel & Frank</p>
                <div className="flex flex-col items-center space-y-3 bg-gradient-to-b from-[#ad4a21] to-[#d07c5b] p-2 mt-auto pb-10">
                    <p className="eb-garamond max-w-30 text-white text-center">Cliquez  pour découvrir notre histoire d’amour et d’autres détails </p>
                    <img src="./assets/images/home/ici.png" className="w-30" />
                    <p className="pt-4 text-white eb-garamond">TABLE <br/> <span className="text-black font-bold">ROME</span></p>
                </div>
            </div>            
        </section>
    );
}

const Section2 = () => {
    const qrData = "https://mon-site.com/invitation?guestId=123";

    const handleQrDownload = () => {

    }
    
    return (
        <section className="w-full bg-[#5C2A16] p-6 space-y-6">
                {/* Title */}
                <div className="text-center space-y-2 mt-4">
                    <p className="eb-garamond text-[26px] text-[#FFD365] font-bold">
                        Important :
                    </p>
                    <p className="eb-garamond text-[18px] text-white font-bold">
                        À l&apos;entrée de la salle de réception, <br/>
                        Veuillez afficher votre QR Code pour y accéder
                    </p>
                </div>

                {/* QR card */}
                <div className="bg-white p-6 rounded-md shadow-md">
                    {/* Replace src with your real QR image path */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrData)}`}
                        alt="QR Code K&F"
                        className="w-full object-contain mx-auto"
                    />
                </div>

                {/* Download button */}
                <button
                    className="bg-black text-white eb-garamond text-[18px] px-10 py-3 rounded-md shadow-lg w-full font-bold"
                >
                    Télécharger mon QR Code
                </button>
        </section>
    );
};

const Section3 = () => {
    return (
        <section className="relative w-full bg-white py-12 px-6 md:px-16 overflow-hidden">
            <img src="./assets/images/home/polygone.png" alt="Décor polygone" className="absolute top-0 left-0 w-64 h-64" />
            <img src="./assets/images/home/polygone1.png" alt="Décor polygone" className="absolute bottom-10 left-0 w-30 h-30 rotate-90" />
            <div className="">

                <div className="mb-8">
                    <p className="dancing-script text-[32px] md:text-[40px] text-black font-bold leading-tight">
                        Idées de
                    </p>
                    <p className="eb-garamond text-[40px] md:text-[48px] text-[#5C2A16] font-bold leading-tight">
                        Dress Code
                    </p>
                </div>

                <img src="./assets/images/home/img-grid.png" alt="Idées de dress code" />

                {/* <div className="grid grid-cols-3 gap-6">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl shadow-md bg-white"
                        >
                            <img
                                src={src}
                                alt={`Idée de dress code ${index + 1}`}
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    ))}
                </div> */}

                <div className="mt-10 flex items-start justify-between">
                    <p className="eb-garamond font-bold text-[20px] md:text-[24px] text-black max-w-xl leading-snug">
                        Découvrez notre filtre snap et accompagnez nous dans cette aventure
                    </p>
                    <img
                        src="./assets/images/home/snapchat-filter.png"
                        alt="Filtre Snapchat du mariage"
                        className="w-32 h-32 md:w-40 md:h-40 object-contain my-[-7px]"
                    />
                </div>
            </div>
        </section>
    );
}

const style = () => {
    return (
        <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Dancing+Script:wght@400..700&display=swap');
                
                .playfair-display {
                    font-family: "Playfair Display", serif;
                    font-optical-sizing: auto;
                    font-style: normal;
                }
                
                .eb-garamond {
                    font-family: "EB Garamond", serif;
                    font-optical-sizing: auto;
                    font-style: normal;
                }
                
                .dancing-script {
                    font-family: "Dancing Script", cursive;
                    font-optical-sizing: auto;
                    font-style: normal;
                }
            `}
        </style>
    );
}


const Wedding = ()=>{
    return (
        <>
            {style()}
            <div className="md:hidden">
                <Section1 />
                <Section2 />
                <Section3 />
            </div>
            <div className="hidden md:flex items-center justify-center py-10 h-screen">
                <p className="playfair-display text-[18px] text-gray-800 text-center max-w-md font-bold">
                    Pour une meilleure expérience, veuillez ouvrir cette page sur votre téléphone mobile.
                </p>
            </div>
        </>
    );
}

export default Wedding;