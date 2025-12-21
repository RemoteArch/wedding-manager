const { useEffect, useMemo, useState } = React;

const FirstImage = () => {
    return (
        <div className="relative w-full overflow-hidden">
                <img
                    src="./assets/images/site/poster.png"
                    alt="Poster"
                    className="w-full h-[420px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35" />

                <img
                    src="./assets/images/site/fluer1.png"
                    alt="Décor fleur"
                    className="absolute -bottom-35 left-0 w-[150px] pointer-events-none select-none"
                />
                <img
                    src="./assets/images/site/fleur2.png"
                    alt="Décor fleur"
                    className="absolute -bottom-20 right-0 w-[150px] pointer-events-none select-none"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-b from-black/0 via-transparent to-white h-[400px]"></div>
        </div>
    );
}

const Section1 = () => {
    const targetDate = useMemo(() => new Date("2026-02-27T00:00:00"), []);
    const [remaining, setRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
    });

    useEffect(() => {
        const compute = () => {
            const now = new Date();
            const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
            const totalMinutes = Math.floor(diffMs / (1000 * 60));
            const days = Math.floor(totalMinutes / (60 * 24));
            const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
            const minutes = totalMinutes % 60;

            setRemaining({ days, hours, minutes });
        };

        compute();
        const id = setInterval(compute, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return (
        <section className="w-full flex flex-col items-center justify-start px-6 pt-10 pb-10">
            <div className="w-full flex flex-col items-center">
                <p className="wedding-script text-back/30 text-[28px] fonct-bold leading-none">
                    Nous nous disons oui
                </p>

                <h1 className="wedding-serif text-[#B45B37] text-[35px] leading-[1] font-bold mt-4 text-center">
                    Kristel &amp; Frank
                </h1>

                <div className="w-full mt-10 rounded-[20px] border-[#5B2A16] p-6 border-t-[2px] border-b-[2px] wedding-serif text-[#5B2A16] text-center text-[30px] font-semibold">
                        27–28 Fevrier 2026
                </div>

                <div className="w-full grid grid-cols-3 gap-5 mt-10">
                    {[
                        { value: remaining.days, label: 'jours' },
                        { value: remaining.hours, label: 'heures' },
                        { value: remaining.minutes, label: 'minutes' },
                    ].map((item, index) => (
                        <div key={index} className="rounded-[20px] bg-[#fef3ed] border-[2px] border-[#E2C7BC] py-3 flex flex-col items-center justify-center">
                            <p className="wedding-serif text-[#7A1F1B] text-[44px] font-semibold leading-none mb-3">
                                {item.value}
                            </p>
                            <p className="wedding-script text-[#7A1F1B] text-[28px] leading-none font-bold mb-3">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Section2 = () => {
    const items = [
        {
            img: "./assets/images/site/etat-civil.png",
            title: "MAIRIE",
            title2:"ETAT CIVIL",
            subtitle: "Centre d’état civil de Logbaba",
        },
        {
            img: "./assets/images/site/bene-nuptiale.png",
            title: "EGLISE",
            title2:"BENÉDICTION NUPTIALE",
            subtitle: "EEC Paroisse de Ndognpassi 3",
        },
        {
            img: "./assets/images/site/reception.png",
            title: "FESTIVITE",
            title2:"RECEPTION",
            subtitle: "Salle de fête de Cplan",
        },
    ];

    return (
        <section className="w-full py-5">
            <div className="w-full max-w-[520px] mx-auto px-6">
                <div className="flex flex-col items-center space-y-12">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-[150px] h-[150px] object-contain"
                            />
                            <p className="wedding-serif text-black/50 text-[24px] tracking-[0.25em] mt-4">
                                {item.title}
                            </p>
                            <p className="wedding-serif text-black/80 text-[24px] tracking-[0.25em] mt-4 font-bold">
                                {item.title2}
                            </p>
                            <p className="wedding-serif text-black/70 text-[22px] leading-tight mt-4">
                                {item.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Section3 = () => {
    return (
        <section className="w-full py-8">
            <div className="w-full max-w-[520px] mx-auto px-6">
                <div className="relative w-full flex items-center justify-center">
                    <div className="relative w-[270px] h-[420px]">
                        <div className="absolute inset-[16px] rounded-[9999px] border border-black/40" />

                        <div className="absolute inset-[34px] rounded-[9999px] overflow-hidden z-10">
                            <img
                                src="./assets/images/site/poster1.png"
                                alt="Poster"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <img
                            src="./assets/images/site/section3-fleur.png"
                            alt="Décor fleur"
                            className="absolute -top-3 -right-3 rotate-45 w-[120px] pointer-events-none select-none opacity-90"
                        />
                        <img
                            src="./assets/images/site/section3-fleur.png"
                            alt="Décor fleur"
                            className="absolute -bottom-3 -left-3 w-[120px] rotate-230 pointer-events-none select-none opacity-90"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

const Section4 = ()=>{

    return (
        <section className="w-full py-10">
            <div className="w-full max-w-[520px] mx-auto px-6">
                <div className="w-full flex flex-col items-center text-center">
                    <div className="relative w-[290px] h-[290px] flex items-center justify-center">
                        <img
                            src="./assets/images/site/section3-fleur2.png"
                            alt="Décor fleur"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                        />

                        <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border border-black/20 bg-white">
                            <img
                                src="./assets/images/site/lamarier-photo.png"
                                alt="La mariée"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <p className="wedding-serif text-black/70 text-[16px] tracking-[0.25em] mt-2">
                        LA MARIÉE
                    </p>
                    <p className="wedding-serif text-[#B45B37] text-[36px] font-bold mt-4">
                        Kristel
                    </p>

                    <p className="wedding-serif text-black/60 text-[16px] leading-relaxed mt-6 max-w-[360px]">
                        Notre rencontre n’a jamais été un hasard. Je crois profondément que Dieu a guidé
                        chacun de mes pas vers toi. Dans ton regard, j’ai trouvé la paix, la douceur et
                        l’amour que seul le Seigneur peut inspirer. Tu es pour moi une preuve vivante de
                        Sa fidélité. Merci d’être cet homme attentionné, sincère et humble qui a Dieu au
                        centre de tout.
                        <br />
                        Aujourd’hui, je suis prête à te redire ‘oui’, avec un cœur rempli de foi, de
                        reconnaissance et d’amour.
                    </p>
                </div>
            </div>
        </section>
    );
}

const Section5 = ()=>{

    return (
        <section className="w-full py-10">
            <div className="w-full max-w-[520px] mx-auto px-6">
                <div className="w-full flex flex-col items-center text-center">
                    <div className="relative w-[290px] h-[290px] flex items-center justify-center">
                        <img
                            src="./assets/images/site/section3-fleur2.png"
                            alt="Décor fleur"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                        />

                        <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border border-black/20 bg-white">
                            <img
                                src="./assets/images/site/lemarier-photo.png"
                                alt="Le marié"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <p className="wedding-serif text-black/70 text-[16px] tracking-[0.25em] mt-2">
                        LE MARIÉ
                    </p>
                    <p className="wedding-serif text-[#B45B37] text-[36px] font-bold mt-4">
                        Frank
                    </p>

                    <p className="wedding-serif text-black/60 text-[16px] leading-relaxed mt-6 max-w-[360px]">
                        Lorsque nos chemins se sont croisés, j’ai compris que Dieu venait d’écrire une
                        nouvelle page de ma vie. À travers toi, j’ai découvert une femme de foi, de grâce
                        et de lumière. Ton amour m’inspire, ta prière me porte et ta présence me rapproche
                        chaque jour un peu plus de ce que Dieu veut pour moi. Merci d’être cette femme
                        vertueuse, forte et douce que le Seigneur a placée à mes côtés.
                        <br />
                        Aujourd’hui, c’est avec gratitude, paix et conviction que je te dis ‘oui’, guidé
                        par Dieu et par l’amour.
                    </p>
                </div>
            </div>
        </section>
    );
}


const updatePageMetadata = (href, title = 'Kristel & Frank - Mariage') => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
    
    document.title = title;
};

updatePageMetadata('./assets/images/initial.png');

const playBackgroundMusic = (audioPath = './assets/audio/audiobg.mp3') => {
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.5;
    
    const playAudio = () => {
        audio.play().catch(error => {
            console.log("Audio playback error:", error);
        });
    };
    
    if (audio.readyState >= 2) {
        playAudio();
    } else {
        audio.addEventListener('canplay', playAudio, { once: true });
    }
    
    document.addEventListener('click', () => {
        if (audio.paused) {
            playAudio();
        }
    }, { once: true });
};

playBackgroundMusic();

const params = new URLSearchParams(window.location.search);
const code = params.get('code');
if (code) {
    window.location.hash = 'invitation';
}


const style = () => {
    return (
        <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Dancing+Script:wght@400..700&display=swap');
                .wedding-serif {
                    font-family: "Playfair Display", serif;
                    font-optical-sizing: auto;
                    font-style: normal;
                }
                .wedding-script {
                    font-family: "Dancing Script", cursive;
                    font-optical-sizing: auto;
                    font-style: normal;
                }
            `}
        </style>
    );
};

const Main = () => {
    return (
        <>
            {style()}
            <div className="md:hidden bg-white">
                <div className="-space-y-10">
                    <FirstImage/>
                    <Section1 />
                </div>
                <Section2 />
                <div className="relative">

                    <img src="assets/images/site/section3-fleur1.png" className="absolute rotate-180 right-0 w-[200px]" />
                    <Section3 />
                    <Section4 />
                    <Section5 />
                </div>
            </div>
            <div className="hidden md:flex items-center justify-center py-10 h-screen">
                <p className="wedding-serif text-[18px] text-gray-800 text-center max-w-md font-bold">
                    Pour une meilleure expérience, veuillez ouvrir cette page sur votre téléphone mobile.
                </p>
            </div>
        </>
    );
};

export default Main;