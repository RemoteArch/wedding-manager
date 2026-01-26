const { useState, useEffect, useRef } = React;

const API_BASE_URL = "/api/index.php/index";

// --- COMPOSANT : LIGHTBOX (Visualisation plein écran) ---
const Lightbox = ({ item, onClose }) => {
    if (!item) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                {item.file_type === 'video' ? (
                    <video src={item.path} controls autoPlay className="max-h-[80vh] rounded-lg shadow-2xl" />
                ) : (
                    <img src={item.path} alt="" className="max-h-[80vh] object-contain rounded-lg shadow-2xl" />
                )}
                <div className="mt-6 text-center">
                    <p className="gallery-serif text-white text-2xl">{item.invite_name}</p>
                    <p className="gallery-body text-white/50 text-sm mt-1">Partagé avec amour</p>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANT : UPLOAD MODAL (Multi-fichiers) ---
const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const resetForm = () => {
        setInviteName('');
        setSelectedFiles([]);
        setPreviewUrls([]);
        setUploadProgress({});
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type,
                name: file.name
            }));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const uploadSingleFile = async (file, index) => {
        const formData = new FormData();
        formData.append('invite_name', inviteName.trim());
        formData.append('files', file);

        setUploadProgress(prev => ({ ...prev, [index]: 'uploading' }));

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            if (result.success) {
                setUploadProgress(prev => ({ ...prev, [index]: 'success' }));
                return { success: true };
            } else {
                setUploadProgress(prev => ({ ...prev, [index]: 'error' }));
                return { success: false, error: result.message };
            }
        } catch (err) {
            setUploadProgress(prev => ({ ...prev, [index]: 'error' }));
            return { success: false, error: 'Erreur de connexion' };
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!inviteName.trim() || selectedFiles.length === 0) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setUploading(true);
        setError('');

        const uploadPromises = selectedFiles.map((file, index) => uploadSingleFile(file, index));
        const results = await Promise.all(uploadPromises);

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        if (failCount > 0) {
            setError(`${failCount} fichier(s) n'ont pas pu être envoyés`);
        }

        if (successCount > 0) {
            onUploadSuccess();
            if (failCount === 0) {
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 1000);
            }
        }

        setUploading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                <div className="bg-[#5B2A16] px-8 py-6 text-center flex-shrink-0">
                    <h2 className="gallery-serif text-white text-2xl">Immortalisez vos instants</h2>
                    <p className="gallery-body text-[#FFD365]/80 text-sm">Vos souvenirs seront ajoutés à l'album des mariés</p>
                </div>

                <form onSubmit={handleUpload} className="p-8 space-y-6 overflow-y-auto flex-1">
                    <div className="space-y-2">
                        <label className="gallery-serif text-[#5B2A16] text-sm font-semibold ml-1">Votre Nom</label>
                        <input
                            type="text"
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                            placeholder="Ex: Famille Dupont"
                            className="w-full h-12 rounded-full bg-white border border-[#E2C7BC] px-6 gallery-body outline-none focus:ring-2 focus:ring-[#5B2A16]/10 transition-all"
                        />
                    </div>

                    <div 
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className="group relative w-full min-h-[120px] rounded-[1.5rem] border-2 border-dashed border-[#E2C7BC] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#5B2A16] transition-all"
                    >
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-[#fef3ed] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-[#B45B37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <p className="gallery-serif text-[#5B2A16] text-sm">Ajouter des photos ou vidéos</p>
                            <p className="gallery-body text-[#5B2A16]/50 text-xs mt-1">Sélection multiple possible</p>
                        </div>
                    </div>

                    {previewUrls.length > 0 && (
                        <div className="space-y-3">
                            <p className="gallery-serif text-[#5B2A16] text-sm font-semibold">{selectedFiles.length} fichier(s) sélectionné(s)</p>
                            <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-1">
                                {previewUrls.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-[#fef3ed] group">
                                        {preview.type.startsWith('video/') ? (
                                            <video src={preview.url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={preview.url} alt="" className="w-full h-full object-cover" />
                                        )}
                                        
                                        {uploadProgress[index] === 'uploading' && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                        {uploadProgress[index] === 'success' && (
                                            <div className="absolute inset-0 bg-green-500/70 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        {uploadProgress[index] === 'error' && (
                                            <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        )}
                                        
                                        {!uploading && !uploadProgress[index] && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm text-center gallery-body italic">{error}</p>}

                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => { onClose(); resetForm(); }} className="flex-1 h-12 rounded-full text-[#5B2A16] gallery-serif hover:bg-black/5 transition-colors">Annuler</button>
                        <button
                            type="submit"
                            disabled={uploading || selectedFiles.length === 0}
                            className="flex-[2] h-12 rounded-full bg-[#5B2A16] text-white gallery-serif shadow-lg shadow-[#5B2A16]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {uploading ? "Envoi en cours..." : `Partager ${selectedFiles.length > 1 ? `${selectedFiles.length} souvenirs` : 'mon souvenir'}`}
                        </button>
                    </div>
                </form>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
            </div>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL : GALLERY ---
const Gallery = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    useEffect(() => { fetchMedia(); }, []);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/media`);
            const result = await response.json();
            if (result.success) setMedia(result.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMedia = media.filter(item => filter === 'all' || item.file_type === filter);

    return (
        <div className="bg-[#FDFBF7] text-[#3E2723]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=EB+Garamond:wght@400..700&family=Dancing+Script:wght@400..700&display=swap');
                .gallery-serif { font-family: "Playfair Display", serif; }
                .gallery-script { font-family: "Dancing Script", cursive; }
                .gallery-body { font-family: "EB Garamond", serif; }
                
                /* Smooth scroll pour la page */
                html { scroll-behavior: smooth; }
            `}</style>

            {/* --- HEADER COMPACT & STICKY --- */}
            <header className="sticky top-0 z-40 bg-[#5B2A16]/95 backdrop-blur-md border-b border-[#FFD365]/10 px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                        <h1 className="gallery-serif text-white text-xl md:text-2xl tracking-wide">Kristel & Frank</h1>
                        <span className="gallery-script text-[#FFD365] text-md hidden md:block">Album de Mariage</span>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Filtres discrets dans le header sur desktop */}
                        <nav className="hidden lg:flex gap-6">
                            {['all', 'image', 'video'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`gallery-serif text-[10px] uppercase tracking-[0.2em] transition-all ${
                                        filter === type ? 'text-[#FFD365]' : 'text-white/50 hover:text-white'
                                    }`}
                                >
                                    {type === 'all' ? 'Tous' : type === 'image' ? 'Photos' : 'Vidéos'}
                                </button>
                            ))}
                        </nav>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD365] text-[#5B2A16] hover:bg-white transition-all transform active:scale-95 shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            <span className="gallery-serif text-sm font-bold uppercase tracking-wider">Ajouter</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-140px)] px-4 py-8">
                {/* --- FILTRES (Version Mobile ou secondaire) --- */}
                <div className="flex lg:hidden justify-center gap-6 mb-8 border-b border-[#E2C7BC]/30 pb-4">
                    {['all', 'image', 'video'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`gallery-serif text-xs uppercase tracking-[0.2em] transition-all relative ${
                                filter === type ? 'text-[#5B2A16] font-bold' : 'text-[#5B2A16]/40'
                            }`}
                        >
                            {type === 'all' ? 'Tous' : type === 'image' ? 'Photos' : 'Vidéos'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[#5B2A16] border-t-transparent rounded-full mx-auto" />
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-[#E2C7BC]">
                        <p className="gallery-body text-[#5B2A16]/40 italic">Aucun souvenir partagé pour le moment...</p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {filteredMedia.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSelectedMedia(item)}
                                className="break-inside-avoid group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-zoom-in border border-[#E2C7BC]/20"
                            >
                                <div className="relative overflow-hidden">
                                    {item.file_type === 'video' ? (
                                        <div className="relative">
                                            <video src={item.path} className="w-full h-auto" />
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <img 
                                            src={item.path} 
                                            alt="" 
                                            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            loading="lazy"
                                        />
                                    )}
                                    {/* Overlay plus discret */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="gallery-serif text-white text-sm">{item.invite_name}</p>
                                            <a 
                                                href={item.path} 
                                                download 
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                                                title="Télécharger"
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- FOOTER TRÈS DISCRET --- */}
            <footer className="py-6 bg-[#5B2A16] border-t border-[#FFD365]/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50">
                    <p className="gallery-body text-[10px] tracking-[0.2em] uppercase"> 2026 • Kristel & Frank</p>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-[#FFD365]/30" />
                        <p className="gallery-script text-[#FFD365] text-lg">Merci d'être là</p>
                        <div className="w-8 h-px bg-[#FFD365]/30" />
                    </div>
                </div>
            </footer>

            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={fetchMedia} />
            <Lightbox item={selectedMedia} onClose={() => setSelectedMedia(null)} />
        </div>
    );
};

export default Gallery;