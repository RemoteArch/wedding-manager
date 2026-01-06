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
        seconds: 0,
    });

    useEffect(() => {
        const compute = () => {
            const now = new Date();
            const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
            const totalSeconds = Math.floor(diffMs / 1000);
            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;

            setRemaining({ days, hours, minutes, seconds });
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

                <div className="w-full grid grid-cols-4 gap-2 mt-10">
                    {[
                        { value: remaining.days, label: 'jours' },
                        { value: remaining.hours, label: 'heures' },
                        { value: remaining.minutes, label: 'minutes' },
                        { value: remaining.seconds, label: 'secondes' },
                    ].map((item, index) => (
                        <div key={index} className="rounded-[20px] bg-[#fef3ed] border-[2px] border-[#E2C7BC] py-3 flex flex-col items-center justify-center">
                            <p className="wedding-serif text-[#7A1F1B] text-[36px] font-semibold leading-none mb-2">
                                {item.value}
                            </p>
                            <p className="wedding-script text-[#7A1F1B] text-[22px] leading-none font-bold mb-2">
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
            img: "./assets/images/site/dot.png",
            title: "DOT",
            title2:"CÉRÉMONIE TRADITIONNELLE",
            subtitle: "Domicile de la Mariée",
        },
        {
            img: "./assets/images/site/etat-civil.png",
            title: "MAIRIE",
            title2:"ETAT CIVIL",
            subtitle: "Centre d'état civil de Logbaba",
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

const Section4 = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const fullText = "En août 2023, quand il m’a écrit pour la première fois, mon instinct de femme m’a dit qu’il serait mon mari. J’en ai ri et j’ai rejeté sa première demande par la suite. Mais je veux avouer que le Seigneur m’a piégée, et d’une façon qui me dépasse encore jusqu’à ce jour. Nos regards n’ont pas connu de croisades spéciales (en mode coup de foudre), non, mais je continue d’être convaincue que Dieu fait toute chose belle en son temps. Et l’heure est venue pour nous de matérialiser cette union par une alliance visible à vos yeux. Il s’agit de deux ans de cheminement, d’accompagnement, d’encadrement, de prières, de sacrifices, de pauses, de pardon, mais surtout d’une décision de s’aimer d’un amour renouvelé par le Saint-Esprit chaque jour. Frank, c’est ma Promesse. En toi, chéri, je réalise encore combien la fidélité de Dieu est grande. Je prie pour être chaque jour ton plus beau miracle, et mieux encore, ton aide précieuse que tu ne trouveras chez personne d’autre. Je me rappelle de cette époque où je priais pour mon futur mari, alors que je n’envisageais même pas une relation à cette époque-là… Let us trust the process, my love. Certainement, le Seigneur n’a pas fini de nous surprendre ✨";
    const shortText = fullText.substring(0, 200) + "...";

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
                        {isExpanded ? fullText : shortText}
                    </p>
                    
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="wedding-serif text-[#B45B37] text-[14px] mt-4 underline hover:text-[#8B4513] transition-colors"
                    >
                        {isExpanded ? "Voir moins" : "Voir plus"}
                    </button>
                </div>
            </div>
        </section>
    );
}

const Section5 = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const fullText = "Il y a des histoires d’amour qui naissent d’un regard, et d’autres qui prennent vie à travers une voix. La nôtre a commencé ainsi, au bout du fil, entre deux villes, portée par des mots sincères et des silences remplis d’émotion. Ce qui n’était, au départ, qu’un simple échange s’est transformé, jour après jour, en une douce habitude. Les appels se sont allongés, les rires ont traversé la distance, et sans même nous être encore rencontrés, nos cœurs s’étaient déjà reconnus. Kristel est devenue mon refuge, mon éclat de rire, mon aujourd’hui et mon demain. À ses côtés, l’amour a pris la forme de la confiance, du respect et de ce bonheur simple qui réchauffe l’âme.";
    const shortText = fullText.substring(0, 200) + "...";

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
                        {isExpanded ? fullText : shortText}
                    </p>
                    
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="wedding-serif text-[#B45B37] text-[14px] mt-4 underline hover:text-[#8B4513] transition-colors"
                    >
                        {isExpanded ? "Voir moins" : "Voir plus"}
                    </button>
                </div>
            </div>
        </section>
    );
}

const Section6 = ()=>{
    const items = [
        {
            day: '27',
            month: 'Février',
            imageSrc: './assets/images/site/hotel-ville.png',
            time: '19h00',
            title: 'CÉRÉMONIE',
            subtitle: 'TRADITIONNELLE',
            locationLabel: 'Domicile de la Mariée',
            mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d295.0607693793312!2d9.75601808278012!3d4.037035756705238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610dbf176dc78d%3A0x97c77b35fdbc5772!2sMairie%20de%20Douala%203%C3%A8me!5e1!3m2!1sfr!2scm!4v1767631405203!5m2!1sfr!2scm',
        },
        {
            day: '28',
            month: 'Février',
            imageSrc: './assets/images/site/hotel-ville.png',
            time: 'A 10H00',
            title: 'ETAT CIVIL',
            subtitle: '',
            locationLabel: 'Centre d\u2019état civil de Logbaba',
            mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d295.0607693793312!2d9.75601808278012!3d4.037035756705238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610dbf176dc78d%3A0x97c77b35fdbc5772!2sMairie%20de%20Douala%203%C3%A8me!5e1!3m2!1sfr!2scm!4v1767631405203!5m2!1sfr!2scm',
        },
        {
            day: '28',
            month: 'Février',
            imageSrc: './assets/images/site/recpetion.png',
            time: 'A 14H00',
            title: 'BÉNÉDICTION',
            subtitle: 'NUPTIALE',
            locationLabel: 'EEC Paroisse de Ndogpassi 3',
            mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d371.7665445521341!2d9.757244322023276!3d4.007738001234047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106173f2947ad993%3A0xc47a5c949a9f61be!2sEEC%20NDOG-PASSI%203!5e1!3m2!1sfr!2scm!4v1767632185377!5m2!1sfr!2scm',
        },
        {
            day: '28',
            month: 'Février',
            imageSrc: './assets/images/site/recpetion.png',
            time: 'A 20H00',
            title: 'RÉCEPTION',
            subtitle: '',
            locationLabel: 'Salle de fête de Cplan',
            mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d350.895570372076!2d9.769305685565083!3d4.020214778152877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sfr!2scm!4v1767632328116!5m2!1sfr!2scm',
        },
    ];

    const CalendarItem = ({
        day,
        month,
        imageSrc,
        time,
        title,
        subtitle,
        locationLabel,
        mapEmbedSrc,
    }) => {
        return (
            <div className="w-full rounded-xl bg-white overflow-hidden px-6 pt-7 pb-5 space-y-5">
                <div className="flex flex-col items-center text-center">
                    <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-black/30" />
                        <div className="flex flex-col items-center justify-center">
                            <p className="wedding-serif text-[#5B2A16] text-[30px] leading-none font-semibold">
                                {day}
                            </p>
                            <p className="wedding-serif text-[#5B2A16] text-[16px] tracking-[0.22em]">
                                {month}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 w-full">
                        <div className="relative w-full h-[180px]">
                            <div className="absolute inset-[10px] rounded-[9999px] border border-black/25" />
                            <div className="absolute inset-[22px] rounded-[9999px] overflow-hidden">
                                <img
                                    src={imageSrc}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-70"
                        >
                            <path
                                d="M12 8V12L14.5 13.5"
                                stroke="#5B2A16"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                stroke="#5B2A16"
                                strokeWidth="1.8"
                            />
                        </svg>
                        <p className="wedding-serif text-[#5B2A16] text-[14px] tracking-[0.25em]">
                            {time}
                        </p>
                    </div>

                    <p className="wedding-serif text-[#5B2A16] text-[24px] tracking-[0.22em] mt-4">
                        {title}
                    </p>
                    {subtitle ? (
                        <p className="wedding-serif text-[#5B2A16] text-[24px] tracking-[0.22em] font-semibold mt-1">
                            {subtitle}
                        </p>
                    ) : null}

                    <div className="mt-5 w-full flex items-center justify-center gap-2">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="opacity-70"
                        >
                            <path
                                d="M12 21s7-4.438 7-11a7 7 0 10-14 0c0 6.562 7 11 7 11z"
                                stroke="#5B2A16"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                stroke="#5B2A16"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="wedding-serif text-[#5B2A16] text-[16px]">
                            {locationLabel}
                        </p>
                    </div>
                </div>

                {mapEmbedSrc && (
                    <div className="w-full rounded-xl overflow-hidden">
                        <iframe
                            src={mapEmbedSrc}
                            width="100%"
                            height="140"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Map"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="w-full bg-[#efefef]">
            <div className="w-full flex flex-col items-center px-6  py-12">
                <div className="w-full relative overflow-hidden px-5">
                    <p className="wedding-serif text-black text-[14px] mb-5 tracking-[0.24em] text-center">
                        MARIAGE VENDREDI & SAMEDI
                    </p>
                    <p className="wedding-serif text-[#7A1F1B] text-[20px] tracking-[0.22em] font-semibold text-center mt-1">
                        CALENDRIER DE LA CÉRÉMONIE
                    </p>
                </div>

                <div className="w-full mt-10 flex flex-col gap-10">
                    {items.map((item, idx) => (
                        <CalendarItem key={idx} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const Section7 = ()=>{
    const images = [
        { src: './assets/images/site/poster2.png', alt: 'Souvenir 1' },
        { src: './assets/images/site/poster3.png', alt: 'Souvenir 2' },
        { src: './assets/images/site/poster4.png', alt: 'Souvenir 3' },
        { src: './assets/images/site/poster5.png', alt: 'Souvenir 4' },
        { src: './assets/images/site/poster6.png', alt: 'Souvenir 5' },
    ];

    return (
        <section className="w-full bg-white py-12">
            <div className="w-full max-w-[520px] mx-auto px-6">
                <div className="w-full flex flex-col items-center">
                    <p className="wedding-serif text-black/60 text-[12px] tracking-[0.35em] text-center">
                        DOUX SOUVENIRS
                    </p>
                    <h2 className="wedding-serif text-[#7A1F1B] text-[22px] tracking-[0.22em] text-center font-semibold mt-3">
                        NOS INSTANTS
                        <br />
                        CAPTURÉS
                    </h2>

                    <div className="w-full mt-10 flex flex-col gap-10">
                        <div className="w-full overflow-hidden bg-white">
                            <img
                                src={images[0].src}
                                alt={images[0].alt}
                                className="w-full h-[320px] object-cover"
                            />
                        </div>

                        <div className="w-full overflow-hidden bg-white">
                            <img
                                src={images[1].src}
                                alt={images[1].alt}
                                className="w-full h-[260px] object-cover"
                            />
                        </div>

                        <div className="w-full text-center py-2">
                            <p className="wedding-serif w-full text-black text-[18px] tracking-[0.08em] font-semibold leading-snug">
                                " CHAQUE HISTOIRE D'AMOUR COMMENCE PAR UN REGARD ET SE TISSE DANS LES SILENCES PARTAGÉS "
                            </p>
                        </div>
                        <div className="w-full overflow-hidden bg-white">
                            <img
                                src={images[2].src}
                                alt={images[2].alt}
                                className="w-full h-[320px] object-cover"
                            />
                        </div>

                        <div className="w-full  overflow-hidden bg-white">
                            <img
                                src={images[3].src}
                                alt={images[3].alt}
                                className="w-full h-[320px] object-cover"
                            />
                        </div>

                        <div className="w-full overflow-hidden bg-white">
                            <img
                                src={images[4].src}
                                alt={images[4].alt}
                                className="w-full h-[320px] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Section8 = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/index.php/index/read_voueux');
            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setMessages(result.data);
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedMessage = message.trim();
        if (!trimmedName || !trimmedMessage) return;

        setLoading(true);
        try {
            const response = await fetch('/api/index.php/index/save_voueux', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: trimmedName,
                    message: trimmedMessage,
                }),
            });

            if (response.ok) {
                setName('');
                setMessage('');
                await fetchMessages();
            }
        } catch (error) {
            console.error('Error submitting message:', error);
        } finally {
            setLoading(false);
        }
    };

    const MessageCard = ({ name: author, message: body, date }) => {
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const d = new Date(dateString);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} à ${hours}:${minutes}`;
        };

        return (
            <div className="relative w-full rounded-[14px] bg-white border border-black/10 px-4 py-4 overflow-hidden">
                <img
                    src="./assets/images/site/section3-fleur2.png"
                    alt="Décor"
                    className="absolute -top-10 -right-10 w-[120px] opacity-20 pointer-events-none select-none"
                />
                <div className="relative flex items-start gap-3">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#7A1F1B]/10 flex items-center justify-center flex-shrink-0">
                        <span className="wedding-serif text-[#7A1F1B] text-[12px] font-semibold">
                            {author.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="wedding-serif text-[#7A1F1B] text-[14px] font-semibold">
                                {author}
                            </p>
                        </div>
                        
                        <p className="wedding-serif text-black/80 text-[14px] mt-1 truncate">
                            {body}
                        </p>

                        {date && (
                            <p className="wedding-serif text-black/50 text-[12px] whitespace-nowrap text-right">
                                {formatDate(date)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const duplicatedMessages = [...messages, ...messages];

    return (
        <section className="w-full bg-[#efefef] py-12">
            <div className="w-full max-w-[520px]">
                <div className="w-full flex flex-col items-center">
                    <h2 className="wedding-serif text-black text-[16px] tracking-[0.25em] text-center font-semibold">
                        LAISSER NOUS UN
                        <br />
                        MESSAGE
                    </h2>

                    <form
                        onSubmit={onSubmit}
                        className="w-full mt-8 p-5"
                    >
                        <div className="w-full space-y-3">
                            <div className="w-full">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="* Votre nom"
                                    disabled={loading}
                                    className="w-full h-[44px] rounded-[10px] bg-white border border-black/10 px-4 wedding-serif text-[14px] outline-none focus:border-[#5B2A16]/40 transition-colors disabled:opacity-50"
                                />
                            </div>

                            <div className="w-full">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="* Tapez le message"
                                    rows={3}
                                    disabled={loading}
                                    className="w-full h-[150px] rounded-[10px] bg-white border border-black/10 px-4 py-3 wedding-serif text-[14px] outline-none resize-none focus:border-[#5B2A16]/40 transition-colors disabled:opacity-50"
                                />
                            </div>

                            <div className="w-full flex justify-center -mt-9">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-[70%] py-3 rounded-[10px] bg-[#5B2A16] text-white wedding-serif text-[14px] tracking-[0.06em] hover:bg-[#4a2312] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Envoi...' : 'Envoyez le message'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {messages.length > 0 && (
                        <div className="w-full mt-8 overflow-x-hidden overflow-y-hidden relative">
                            <div className="flex gap-4 px-2 py-2 animate-scroll">
                                {duplicatedMessages.map((m, index) => (
                                    <div key={`${m.nom}-${m.date}-${index}`} className="w-[260px] flex-shrink-0">
                                        <MessageCard name={m.nom} message={m.message} date={m.date} />
                                    </div>
                                ))}
                            </div>
                            <style jsx>{`
                                @keyframes scroll {
                                    0% {
                                        transform: translateX(0);
                                    }
                                    100% {
                                        transform: translateX(-50%);
                                    }
                                }
                                .animate-scroll {
                                    animation: scroll 5s linear infinite;
                                }
                                .animate-scroll:hover {
                                    animation-play-state: paused;
                                }
                            `}</style>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

const Footer = ()=>{
    const ContactRow = ({ icon, text }) => {
        return (
            <div className="flex items-start gap-3">
                <div className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center">
                    {icon}
                </div>
                <p className="wedding-serif text-white/80 text-[14px] leading-tight mt-[6px]">
                    {text}
                </p>
            </div>
        );
    };

    return (
        <footer className="w-full bg-[#4a2312]">
            <div className="w-full max-w-[520px] mx-auto px-6 py-12">
                <div className="w-full">
                    <div className="flex items-center gap-3">
                        <img 
                            src="./assets/images/site/logo-danma.png" 
                            alt="Danma Logo" 
                            className="h-[36px] w-auto"
                        />
                    </div>

                    <div className="mt-6 space-y-2">
                        <p className="wedding-serif text-white/90 text-[14px] leading-relaxed">
                            🌸 Vous préparez un mariage ou un événement spécial ?
                        </p>
                        <p className="wedding-serif text-white/80 text-[14px] leading-relaxed">
                            Offrez à vos invités une expérience unique grâce à un site vitrine personnalisé, un
                            système d'invitation moderne avec billet digital, QR code, galerie photo…
                        </p>
                        <p className="wedding-serif text-white/80 text-[14px] leading-relaxed">
                            ✨ Élégant, pratique et mémorable.
                        </p>
                        <p className="wedding-serif text-white/80 text-[14px] leading-relaxed">
                            💌 Contactez-nous pour créer le vôtre sur mesure.
                        </p>
                    </div>

                    <div className="mt-10">
                        <p className="wedding-serif text-white text-[16px] font-semibold">
                            Contact Informations
                        </p>

                        <div className="mt-5 space-y-4">
                            <ContactRow
                                text="kabojohna@gmail.com"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 6h16v12H4V6z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
                                        <path d="M4 7l8 6 8-6" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
                                    </svg>
                                }
                            />

                            <ContactRow
                                text="+ (237) 674 - 671 - 243"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M7 2h4l2 5-3 2c1.2 2.7 3.3 4.8 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C10.3 22 2 13.7 2 3c0-1.1.9-2 2-2h3z"
                                            stroke="white"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                }
                            />

                            <ContactRow
                                text="Douala Cameroun"
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 21s7-4.438 7-11a7 7 0 10-14 0c0 6.562 7 11 7 11z"
                                            stroke="white"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                            stroke="white"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10">
                        <p className="wedding-serif text-white/70 text-[12px]">
                            Copyright © Danma. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
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
                    <Section6 />
                    <Section7 />
                    <Section8 />
                </div>
                <Footer />
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