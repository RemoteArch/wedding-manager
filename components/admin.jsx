const { useEffect, useState, useMemo } = React;

const {excelFileToAoa} = await loadModule("modules/xlsx.js");

function extractInvitesFromAoA(aoa) {
  const out = [];
  let currentLeftTable = null;
  let currentRightTable = null;

  const asStr = (v) =>
    v === null || v === undefined ? "" : String(v).trim();

  const isTableCell = (v) => asStr(v).toUpperCase().includes("TABLE");

  const looksLikeRealTableTitle = (s) =>
    /TABLE\s*N/i.test(s); // ex: "TABLE N°01 ..."

  const shouldSkipName = (name) => {
    const n = name.toUpperCase();
    // évite les entêtes du style "NOMS ET PRENOMS"
    return n.includes("NOMS") && n.includes("PRENOMS");
  };

  for (let r = 0; r < aoa.length; r++) {
    const row = aoa[r] || [];

    // Colonnes (0-index)
    const A = asStr(row[0]);
    const B = asStr(row[1]);
    const C = asStr(row[2]);
    const G = asStr(row[6]);
    const H = asStr(row[7]);
    const I = asStr(row[8]);

    // Detect table header (left block: A+B)
    if (isTableCell(A)) {
      const t = [A, B].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      if (t && looksLikeRealTableTitle(t)) currentLeftTable = t;
    }

    // Detect table header (right block: G+H)
    if (isTableCell(G)) {
      const t = [G, H].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      if (t && looksLikeRealTableTitle(t)) currentRightTable = t;
    }

    // Invite left: name in B, code in C
    if (currentLeftTable && B && C && !shouldSkipName(B)) {
      out.push({ invite: B, table: currentLeftTable, code: C });
    }

    // Invite right: name in H, code in I
    if (currentRightTable && H && I && !shouldSkipName(H)) {
      out.push({ invite: H, table: currentRightTable, code: I });
    }
  }

  // Dédup (au cas où)
  const seen = new Set();
  return out.filter((x) => {
    const k = `${x.invite}||${x.table}||${x.code}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const API_BASE_URL = "/api/index.php/index";

// Simple credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "kris&frank2026"
};

const Invites = ({ onClose })=>{
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [invites, setInvites] = useState([]);
  const [search, setSearch] = useState("");

  const genInviteCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 5; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  };

  const filteredInvites = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invites;
    return invites.filter((x) => {
      return (
        String(x.invite ?? "").toLowerCase().includes(q) ||
        String(x.table ?? "").toLowerCase().includes(q) ||
        String(x.code ?? "").toLowerCase().includes(q)
      );
    });
  }, [invites, search]);

  const onPickFile = async (e) => {
    const f = e.target.files?.[0];
    setError("");
    setInvites([]);
    setSearch("");

    if (!f) {
      setFileName("");
      return;
    }

    setFileName(f.name);
    setLoading(true);
    try {
      const { firstSheet } = await excelFileToAoa(f, { defval: null });
      const extracted = extractInvitesFromAoA(firstSheet || []);
      const used = new Set();
      const withCodes = (extracted || []).map((x) => {
        let invite_code = x?.invite_code ? String(x.invite_code).trim() : "";
        if (!invite_code || used.has(invite_code)) {
          do {
            invite_code = genInviteCode();
          } while (used.has(invite_code));
        }
        used.add(invite_code);
        return { ...x, invite_code };
      });
      setInvites(withCodes);
    } catch (err) {
      setError(err?.message ? String(err.message) : String(err));
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFileName("");
    setLoading(false);
    setSaving(false);
    setError("");
    setInvites([]);
    setSearch("");
    const input = document.getElementById("invites-file-input");
    if (input) input.value = "";
  };

  const onSave = async () => {
    setError("");
    if (!Array.isArray(invites) || invites.length === 0) {
      setError("Aucun invité à enregistrer");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invites)
      });
      const result = await response.json();
      if (!result?.success) {
        throw new Error(result?.message || 'Erreur lors de l\'enregistrement');
      }
      onClose?.();
    } catch (err) {
      setError(err?.message ? String(err.message) : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white rounded-[20px] shadow-2xl border border-black/10 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="px-6 py-5 bg-[#5B2A16] flex items-start justify-between gap-4">
            <div>
              <h1 className="text-white text-[22px] font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
                Import des invités
              </h1>
              <p className="text-white/70 text-[13px] mt-1" style={{ fontFamily: '"EB Garamond", serif' }}>
                Importez un fichier Excel puis enregistrez la liste.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
              aria-label="Fermer"
              title="Fermer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-[#5B2A16] text-[14px] font-medium mb-2" style={{ fontFamily: '"EB Garamond", serif' }}>
                  Fichier Excel (.xlsx / .xls)
                </label>
                <input
                  id="invites-file-input"
                  type="file"
                  accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  onChange={onPickFile}
                  className="block w-full text-[14px] file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:bg-[#5B2A16] file:text-white hover:file:bg-[#4a2312]"
                  disabled={loading}
                />
                {fileName && (
                  <p className="text-[12px] text-black/60 mt-2">Fichier: {fileName}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onSave}
                  className="h-[42px] px-4 rounded-[10px] bg-[#5B2A16] text-white hover:bg-[#4a2312] transition-colors text-[14px] font-medium disabled:opacity-50"
                  disabled={loading || saving || invites.length === 0}
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button
                  onClick={onReset}
                  className="h-[42px] px-4 rounded-[10px] bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-[14px] font-medium"
                  disabled={(loading || saving) && !fileName}
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 rounded-[12px] px-4 py-3">
                <p className="text-red-700 text-[13px]">{error}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (nom, table, code)"
                  className="w-full h-[44px] rounded-[12px] bg-gray-50 border border-gray-200 px-4 text-[14px] outline-none focus:border-[#5B2A16] focus:ring-2 focus:ring-[#5B2A16]/20 transition-all"
                  disabled={loading || invites.length === 0}
                />
              </div>
              <div className="text-[13px] text-black/60">
                {loading ? "Lecture du fichier…" : `Résultats: ${filteredInvites.length}`}
              </div>
            </div>

            <div className="mt-5 overflow-x-auto border border-black/10 rounded-[16px]">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-black/10">
                    <th className="px-5 py-3 text-left text-[12px] font-semibold text-black/60 uppercase tracking-wider">Invité</th>
                    <th className="px-5 py-3 text-left text-[12px] font-semibold text-black/60 uppercase tracking-wider">Code invité</th>
                    <th className="px-5 py-3 text-left text-[12px] font-semibold text-black/60 uppercase tracking-wider">Table</th>
                    <th className="px-5 py-3 text-center text-[12px] font-semibold text-black/60 uppercase tracking-wider">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvites.map((inv, idx) => (
                    <tr key={`${inv.invite}-${inv.table}-${inv.code}-${idx}`} className="border-b border-black/5 last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-[14px] text-black/80">{inv.invite}</td>
                      <td className="px-5 py-3 text-[14px] text-black/70">
                        <code className="bg-gray-100 px-2 py-1 rounded text-[13px] text-gray-700 font-mono">
                          {inv.invite_code ?? "-"}
                        </code>
                      </td>
                      <td className="px-5 py-3 text-[14px] text-black/70">{inv.table}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[12px] font-medium">
                          {inv.code ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && fileName && filteredInvites.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-[14px]">Aucun invité trouvé dans ce fichier (ou filtre trop strict).</p>
                </div>
              )}

              {!loading && !fileName && (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-[14px]">Sélectionnez un fichier Excel pour afficher les invités.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddInvite = ({ onClose, onRefresh }) => {
    const [invite, setInvite] = useState('');
    const [table, setTable] = useState('');
    const [code, setCode] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateInviteCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setInviteCode(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!invite.trim() || !table.trim()) return;
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(API_BASE_URL+'/invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invite: invite.trim(),
                    table: table.trim(),
                    code: code || null,
                    invite_code: inviteCode || null
                }),
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur lors de l\'ajout');
            }
            
            if (onRefresh) onRefresh();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Ajouter un invité</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'invité *</label>
                        <input
                            type="text"
                            value={invite}
                            onChange={(e) => setInvite(e.target.value)}
                            placeholder="Ex: M Alphonse DAMFEU"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Table *</label>
                        <input
                            type="text"
                            value={table}
                            onChange={(e) => setTable(e.target.value)}
                            placeholder="Ex: TABLE N°01 JERUSALEM (Frank - famille)"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <select
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300"
                        >
                            <option value="">Aucun</option>
                            <option value="C">C</option>
                            <option value="S">S</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code d'invitation</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                placeholder="Ex: L8W2T"
                                maxLength={5}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 font-mono uppercase"
                            />
                            <button
                                type="button"
                                onClick={generateInviteCode}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                            >
                                Générer
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !invite.trim() || !table.trim()}
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Ajout...' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('admin_logged_in', 'true');
                onLogin(true);
            } else {
                setError('Identifiants incorrects');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#5B2A16] via-[#7A3B24] to-[#4a2312] flex items-center justify-center p-6">
            <div className="w-full max-w-[400px]">
                <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden">
                    <div className="bg-[#5B2A16] px-8 py-6 text-center">
                        <h1 className="text-white text-[28px] font-bold tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
                            Administration
                        </h1>
                        <p className="text-white/70 text-[14px] mt-1" style={{ fontFamily: '"EB Garamond", serif' }}>
                            Kristel & Frank - Gestion des invités
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div>
                            <label className="block text-[#5B2A16] text-[14px] font-medium mb-2" style={{ fontFamily: '"EB Garamond", serif' }}>
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-[48px] rounded-[10px] bg-gray-50 border border-gray-200 px-4 text-[15px] outline-none focus:border-[#5B2A16] focus:ring-2 focus:ring-[#5B2A16]/20 transition-all"
                                placeholder="Entrez votre nom d'utilisateur"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-[#5B2A16] text-[14px] font-medium mb-2" style={{ fontFamily: '"EB Garamond", serif' }}>
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[48px] rounded-[10px] bg-gray-50 border border-gray-200 px-4 text-[15px] outline-none focus:border-[#5B2A16] focus:ring-2 focus:ring-[#5B2A16]/20 transition-all"
                                placeholder="Entrez votre mot de passe"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
                                <p className="text-red-600 text-[14px] text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[50px] rounded-[10px] bg-[#5B2A16] text-white text-[16px] font-medium hover:bg-[#4a2312] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-white/50 text-[12px] text-center mt-6" style={{ fontFamily: '"EB Garamond", serif' }}>
                    © 2026 Kristel & Frank Wedding
                </p>
            </div>
        </div>
    );
};

const Dashboard = ({ onLogout }) => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTable, setFilterTable] = useState('all');
    const [updatingCode, setUpdatingCode] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);
    const [isInvitesModalOpen, setIsInvitesModalOpen] = useState(false);
    const [isAddInviteModalOpen, setIsAddInviteModalOpen] = useState(false);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/invitations`);
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                setInvitations(result.data);
            }
        } catch (error) {
            console.error('Error fetching invitations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (code, newStatus) => {
        setUpdatingCode(code);
        try {
            const response = await fetch(`${API_BASE_URL}/invitation_status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, status: newStatus })
            });
            const result = await response.json();
            if (result.success) {
                await fetchInvitations();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingCode(null);
        }
    };

    const tables = useMemo(() => {
        const tableSet = new Set(invitations.map(inv => inv.table).filter(Boolean));
        return Array.from(tableSet).sort((a, b) => String(a).localeCompare(String(b), 'fr'));
    }, [invitations]);


    const filteredInvitations = useMemo(() => {
        return invitations.filter(inv => {
            const matchesSearch = inv.invite.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  inv.invite_code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || 
                                  (filterStatus === 'scanned' && inv.status === 'scanned') ||
                                  (filterStatus === 'pending' && inv.status !== 'scanned');
            const matchesTable = filterTable === 'all' || String(inv.table) === String(filterTable);
            return matchesSearch && matchesStatus && matchesTable;
        });
    }, [invitations, searchTerm, filterStatus, filterTable]);

    const stats = useMemo(() => {
        const total = invitations.length;
        const scanned = invitations.filter(inv => inv.status === 'scanned').length;
        const pending = total - scanned;
        return { total, scanned, pending };
    }, [invitations]);

    const handleLogout = () => {
        localStorage.removeItem('admin_logged_in');
        onLogout();
    };

    const shortTableLabel = (table) => {
        const s = String(table || '');
        const m = s.match(/TABLE\s*N[°º]?\s*\d+\s+(.+)/i);
        return m ? m[1].trim() : s;
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-[#5B2A16] shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-white text-[22px] font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
                            Gestion des Invités
                        </h1>
                        <span className="text-white/60 text-[14px] hidden sm:inline" style={{ fontFamily: '"EB Garamond", serif' }}>
                            Kristel & Frank
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddInviteModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-white/10 text-white hover:bg-white/20 transition-colors text-[14px]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M19 8v6M22 11h-6" />
                            </svg>
                            Ajouter invité
                        </button>

                        <button
                            onClick={() => setIsInvitesModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-white/10 text-white hover:bg-white/20 transition-colors text-[14px]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14" />
                                <path d="M5 12h14" />
                            </svg>
                            Importer Excel
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-white/10 text-white hover:bg-white/20 transition-colors text-[14px]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-[14px] p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-[50px] h-[50px] rounded-full bg-[#5B2A16]/10 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B2A16" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                                    <path d="M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-[13px]" style={{ fontFamily: '"EB Garamond", serif' }}>Total Invités</p>
                                <p className="text-[28px] font-bold text-[#5B2A16]">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[14px] p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-[50px] h-[50px] rounded-full bg-green-100 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-[13px]" style={{ fontFamily: '"EB Garamond", serif' }}>Scannés</p>
                                <p className="text-[28px] font-bold text-green-600">{stats.scanned}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[14px] p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-[50px] h-[50px] rounded-full bg-amber-100 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-[13px]" style={{ fontFamily: '"EB Garamond", serif' }}>En attente</p>
                                <p className="text-[28px] font-bold text-amber-600">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[14px] p-5 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-[44px] rounded-[10px] bg-gray-50 border border-gray-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#5B2A16] focus:ring-2 focus:ring-[#5B2A16]/20 transition-all"
                                />
                            </div>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-[44px] rounded-[10px] bg-gray-50 border border-gray-200 px-4 text-[14px] outline-none focus:border-[#5B2A16] min-w-[150px]"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="scanned">Scannés</option>
                            <option value="pending">En attente</option>
                        </select>

                        <select
                            value={filterTable}
                            onChange={(e) => setFilterTable(e.target.value)}
                            className="h-[44px] rounded-[10px] bg-gray-50 border border-gray-200 px-4 text-[14px] outline-none focus:border-[#5B2A16] min-w-[130px]"
                        >
                            <option value="all">Toutes les tables</option>
                            {tables.map(table => (
                                <option key={table} value={table}>Table {table}</option>
                            ))}
                        </select>

                        <button
                            onClick={fetchInvitations}
                            disabled={loading}
                            className="h-[44px] px-5 rounded-[10px] bg-[#5B2A16] text-white hover:bg-[#4a2312] transition-colors flex items-center gap-2 text-[14px] disabled:opacity-50"
                        >
                            <svg className={loading ? 'animate-spin' : ''} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6" />
                                <path d="M1 20v-6h6" />
                                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                            </svg>
                            Actualiser
                        </button>
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-600 text-[14px]" style={{ fontFamily: '"EB Garamond", serif' }}>
                        {filteredInvitations.length} invité(s) trouvé(s)
                    </p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <svg className="animate-spin h-8 w-8 text-[#5B2A16]" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left px-5 py-4 text-[13px] font-semibold text-gray-600 uppercase tracking-wider">Invité</th>
                                        <th className="text-left px-5 py-4 text-[13px] font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                                        <th className="text-center px-5 py-4 text-[13px] font-semibold text-gray-600 uppercase tracking-wider">Table</th>
                                        <th className="text-center px-5 py-4 text-[13px] font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                                        <th className="text-center px-5 py-4 text-[13px] font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                        <th className="text-center px-5 py-4 text-[13px] font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredInvitations.map((inv, index) => (
                                        <tr key={inv.invite_code} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-[36px] h-[36px] rounded-full bg-[#5B2A16]/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-[#5B2A16] text-[14px] font-semibold">
                                                            {inv.invite.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-[14px] text-gray-800 font-medium">{inv.invite}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-[13px] text-gray-700 font-mono">
                                                    {inv.invite_code}
                                                </code>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span
                                                    title={inv.table}
                                                    className="inline-flex items-center px-3 py-1 rounded-full bg-[#5B2A16]/10 text-[#5B2A16] text-[12px] font-semibold"
                                                >
                                                    {shortTableLabel(inv.table)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium ${
                                                    inv.code === 'C' 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : inv.code === 'S' 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {inv.code === 'C' ? 'Couple' : inv.code === 'S' ? 'Solo' : '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {inv.status === 'scanned' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[12px] font-medium">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="20,6 9,17 4,12" />
                                                        </svg>
                                                        Scanné
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[12px] font-medium">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12,6 12,12 16,14" />
                                                        </svg>
                                                        En attente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`https://kris-frank2026.free.nf/?code=${inv.invite_code}#invitation`);
                                                            setCopiedCode(inv.invite_code);
                                                            setTimeout(() => setCopiedCode(null), 2000);
                                                        }}
                                                        className="px-3 py-2 rounded-[8px] bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-[13px] font-medium"
                                                        title="Copier le lien"
                                                    >
                                                        {copiedCode === inv.invite_code ? (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="20,6 9,17 4,12" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    {inv.status === 'scanned' ? (
                                                        <button
                                                            onClick={() => updateStatus(inv.invite_code, '')}
                                                            disabled={updatingCode === inv.invite_code}
                                                            className="px-4 py-2 rounded-[8px] bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-[13px] font-medium disabled:opacity-50"
                                                        >
                                                            {updatingCode === inv.invite_code ? 'Mise à jour...' : 'Réinitialiser'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => updateStatus(inv.invite_code, 'scanned')}
                                                            disabled={updatingCode === inv.invite_code}
                                                            className="px-4 py-2 rounded-[8px] bg-[#5B2A16] text-white hover:bg-[#4a2312] transition-colors text-[13px] font-medium disabled:opacity-50"
                                                        >
                                                            {updatingCode === inv.invite_code ? 'Mise à jour...' : 'Marquer scanné'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredInvitations.length === 0 && (
                                <div className="text-center py-16">
                                    <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <p className="text-gray-500 text-[15px]">Aucun invité trouvé</p>
                                    <p className="text-gray-400 text-[13px] mt-1">Essayez de modifier vos filtres</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-10">
                <div className="max-w-7xl mx-auto px-4 py-4 text-center">
                    <p className="text-gray-500 text-[12px]" style={{ fontFamily: '"EB Garamond", serif' }}>
                        © 2026 Kristel & Frank Wedding - Interface d'administration
                    </p>
                </div>
            </footer>

            {isInvitesModalOpen && (
                <Invites onClose={() => {
                    setIsInvitesModalOpen(false);
                    fetchInvitations();
                }} />
            )}

            {isAddInviteModalOpen && (
                <AddInvite 
                    onClose={() => setIsAddInviteModalOpen(false)} 
                    onRefresh={fetchInvitations} 
                />
            )}
        </div>
    );
};

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('admin_logged_in') === 'true';
    });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
            `}</style>
            {isLoggedIn ? (
                <Dashboard onLogout={() => setIsLoggedIn(false)} />
            ) : (
                <LoginPage onLogin={setIsLoggedIn} />
            )}
        </>
    );
};

export default Admin;
