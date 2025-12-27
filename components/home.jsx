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
            mapImageSrc: './assets/images/site/location.png',
        },
        {
            day: '28',
            month: 'Février',
            imageSrc: './assets/images/site/hotel-ville.png',
            time: 'A 10H00',
            title: 'ETAT CIVIL',
            subtitle: '',
            locationLabel: 'Centre d\u2019état civil de Logbaba',
            mapImageSrc: './assets/images/site/location.png',
        },
        {
            day: '28',
            month: 'Février',
            imageSrc: './assets/images/site/recpetion.png',
            time: 'A 14H00',
            title: 'BÉNÉDICTION',
            subtitle: 'NUPTIALE',
            locationLabel: 'EEC Paroisse de Ndognpassi 3',
            mapImageSrc: './assets/images/site/location.png',
        },
        {
            day: '28',
            month: 'Février',
            imageSrc: './assets/images/site/recpetion.png',
            time: 'A 20H00',
            title: 'RÉCEPTION',
            subtitle: '',
            locationLabel: 'Salle de fête de Cplan',
            mapImageSrc: './assets/images/site/location.png',
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
        mapImageSrc,
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

                <div className="w-full rounded-xl overflow-hidden">
                    <img
                        src={mapImageSrc}
                        alt="Map"
                        className="w-full h-[140px] object-cover"
                    />
                </div>
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
        { src: './assets/images/site/poster1.png', alt: 'Souvenir 1' },
        { src: './assets/images/site/poster.png', alt: 'Souvenir 2' },
        { src: './assets/images/site/poster1.png', alt: 'Souvenir 3' },
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
                        <div className="w-full rounded-[14px] overflow-hidden bg-white">
                            <img
                                src={images[0].src}
                                alt={images[0].alt}
                                className="w-full h-[320px] object-cover"
                            />
                        </div>

                        <div className="w-full rounded-[14px] overflow-hidden bg-white">
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
                        <div className="w-full rounded-[14px] overflow-hidden bg-white">
                            <img
                                src={images[2].src}
                                alt={images[2].alt}
                                className="w-full h-[320px] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Section8 = ()=>{
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            name: 'Cassandra',
            message: 'Jolie couple ',
        },
        {
            id: '2',
            name: 'Jean',
            message: 'Que Dieu bénisse votre union.',
        },
        {
            id: '3',
            name: 'Marie',
            message: 'Félicitations aux mariés!',
        },
    ]);

    const onSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedMessage = message.trim();
        if (!trimmedName || !trimmedMessage) return;

        setMessages((prev) => [
            {
                id: String(Date.now()),
                name: trimmedName,
                message: trimmedMessage,
            },
            ...prev,
        ]);
        setName('');
        setMessage('');
    };

    const MessageCard = ({ name: author, message: body }) => {
        return (
            <div className="relative w-full rounded-[14px] bg-white border border-black/10 px-4 py-4 overflow-hidden">
                <img
                    src="./assets/images/site/section3-fleur2.png"
                    alt="Décor"
                    className="absolute -top-10 -right-10 w-[120px] opacity-20 pointer-events-none select-none"
                />
                <div className="relative flex items-start gap-3">
                    <div className="w-[28px] h-[28px] rounded-full bg-[#7A1F1B]/10 flex items-center justify-center">
                        <div className="w-[10px] h-[10px] rounded-full bg-[#7A1F1B]" />
                    </div>
                    <div className="flex-1">
                        <p className="wedding-serif text-[#7A1F1B] text-[14px] font-semibold">
                            {author}
                        </p>
                        <p className="wedding-serif text-black/80 text-[14px] mt-1">
                            {body}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Duplicate messages for seamless loop
    const duplicatedMessages = [...messages, ...messages];

    return (
        <section className="w-full bg-[#efefef] py-12">
            <div className="w-full max-w-[520px] mx-auto px-6">
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
                                    className="w-full h-[44px] rounded-[10px] bg-white border border-black/10 px-4 wedding-serif text-[14px] outline-none focus:border-[#5B2A16]/40 transition-colors"
                                />
                            </div>

                            <div className="w-full">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="* Tapez le message"
                                    rows={3}
                                    className="w-full h-[150px] rounded-[10px] bg-white border border-black/10 px-4 py-3 wedding-serif text-[14px] outline-none resize-none focus:border-[#5B2A16]/40 transition-colors"
                                />
                            </div>

                            <div className="w-full flex justify-center -mt-7">
                                <button
                                    type="submit"
                                    className="py-2 px-6 rounded-[10px] bg-[#5B2A16] text-white wedding-serif text-[14px] tracking-[0.06em] hover:bg-[#4a2312] transition-colors max-w-[300px]"
                                >
                                    Envoyez le message
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="w-full mt-8 overflow-hidden">
                        <style>{`
                            @keyframes marquee {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .marquee-container {
                                display: flex;
                                animation: marquee 20s linear infinite;
                            }
                            .marquee-container:hover {
                                animation-play-state: paused;
                            }
                        `}</style>
                        <div className="marquee-container">
                            {duplicatedMessages.map((m, index) => (
                                <div key={`${m.id}-${index}`} className="w-[260px] flex-shrink-0 mx-2">
                                    <MessageCard name={m.name} message={m.message} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Footer = ()=>{
    const ContactRow = ({ icon, text }) => {
        return (
            <div className="flex items-start gap-3">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-black flex items-center justify-center">
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
                        <div className="w-[36px] h-[36px] rounded-full bg-[#4c3470] flex items-center justify-center">
                            <p className="wedding-serif text-white text-[16px] font-semibold">D</p>
                        </div>
                        <p className="wedding-serif text-white text-[22px] font-bold">
                            Danma
                        </p>
                    </div>

                    <div className="mt-6 space-y-2">
                        <p className="wedding-serif text-white/90 text-[14px] leading-relaxed">
                            Vous préparez un mariage ou un événement special ?
                        </p>
                        <p className="wedding-serif text-white/80 text-[14px] leading-relaxed">
                            Offrez à vos invités une expérience unique grâce à un site vitrine personnalisée, un
                            système d’invitation moderne avec billet digital, QR code, galerie photo…
                        </p>
                        <p className="wedding-serif text-white/80 text-[14px] leading-relaxed">
                            Élégant, pratique et mémorable.
                        </p>
                        <p className="wedding-serif text-white/80 text-[14px] leading-relaxed">
                            Contactez-nous pour créer le vôtre sur mesure.
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
                            Copyright  Danma. All rights reserved.
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