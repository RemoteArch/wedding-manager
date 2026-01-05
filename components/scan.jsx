
const { useEffect, useRef, useState } = React;

const  { detectQr, ensureJsQr } =  await loadModule("./modules/jjsqr.js");

const WelcomePanel = () => {
    const imageSrc = "./assets/images/scan/wedding-welcome.png";
    const imageAlt = "Bienvenue au mariage";
    return (
        <section className="relative w-full md:w-1/2 h-screen flex flex-col  items-center justify-center">
            <img
                src="./assets/images/scan/top-left-1.png"
                alt=""
                className="absolute left-0 top-0 w-[200px] max-w-none pointer-events-none select-none z-10"
                aria-hidden="true"
            />
            <img
                src="./assets/images/scan/top-left-2.png"
                alt=""
                className="absolute left-0 top-0 w-[300px] max-w-none pointer-events-none select-none z-10"
                aria-hidden="true"
            />
            <img
                src="./assets/images/scan/top-right-1.png"
                alt=""
                className="absolute right-0 top-0 w-[220px] max-w-none pointer-events-none select-none z-10"
                aria-hidden="true"
            />
            <img
                src="./assets/images/scan/bottom-left-1.png"
                alt=""
                className="absolute left-0 bottom-0 w-[260px] max-w-none pointer-events-none select-none z-10"
                aria-hidden="true"
            />

            <div className="w-full h-auto text-center relative z-20 mb-4">
                <p className="playfair-display text-[28px] text-gray-700 italic">
                    Bienvenue au mariage de
                </p>
                <p className="playfair-display text-[42px] text-[#8B4513] font-bold">
                    Kristel & Frank
                </p>
            </div>

            <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-auto object-contain relative z-0"
            />
            <div className="absolute w-full h-[741px] -bottom-100 bg-white blur-[75px] pointer-events-none z-0"></div>

        </section>
    );
};

const updatePageMetadata = (href, title = 'Kristel & Frank - Mariage') => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
    
    document.title = title;
};

updatePageMetadata('./assets/images/initial.png');

const API_URL = "https://kris-frank2025.free.nf/api/index.php/index/all_invitations";

const fetchGuestList = async () => {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            return result.data.map(item => ({
                nom: item.invite,
                table: item.table,
                code: item.invite_code
            }));
        }
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des invités:", error);
        return [];
    }
};


const ScanPanel = () => {
  const qrSrc = "./assets/images/scan/qr.png";
  const title = "Instants du mariage";
  const subtitle = "Scannez pour découvrir tous les\ninstants capturés de l'évènement";
  const scanTitle = "Scannez votre QR Code ici";
  const adviceTitle = "Conseil";
  const adviceText = "Présentez votre QR Code sur\nla camera de l'écran pour le\nvérifier.";
  const adviceImageSrc = "./assets/images/scan/scan-advice.png";
  const guestList = useRef([]);
  
  
  const [scanResult, setScanResult] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  
  useEffect(() => {
      fetchGuestList().then(guests => {
          guestList.current = guests;
      });
  }, []);

  const handleQrDetected = (qrValue) => {
    const guest = guestList.current.find(g => g.code == qrValue);
    // console.log("QR Value:", qrValue, "Guest:", guest, "All guests:", guestList.current);
    
    if (guest) {
      setScanResult(guest);
      setAccessDenied(false);
      setTimeout(() => {
        setScanResult(null);
      }, 5000);
    } else {
      setAccessDenied(true);
      setScanResult(null);
      setTimeout(() => {
        setAccessDenied(false);
      }, 5000);
    }
  };

  return (
    <section className="w-full md:w-1/2 min-h-screen">
      <div className="w-full min-h-screen bg-[#7A3B24] px-6 py-10 relative overflow-hidden">
        <img
          src="./assets/images/scan/left-top.png"
          alt=""
          className="absolute left-0 top-0 w-[220px] max-w-none pointer-events-none select-none"
          aria-hidden="true"
        />
        <img
          src="./assets/images/scan/left-bottom.png"
          alt=""
          className="absolute left-0 bottom-0 w-[260px] max-w-none pointer-events-none select-none"
          aria-hidden="true"
        />

        <div className="w-full max-w-[520px] mx-auto relative z-10 min-h-[calc(100vh-5rem)] flex flex-col justify-between">
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="">
              <img
                src={qrSrc}
                alt="QR"
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="text-white text-center">
              <p className="text-[22px] font-semibold leading-tight playfair-display">
                {title}
              </p>
              <p className="text-[16px] whitespace-pre-line opacity-95 leading-snug mt-1 eb-garamond">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="bg-black rounded-[22px] px-6 pt-10 pb-8 shadow-2xl flex flex-col">
            <p className="text-white text-center text-[30px] font-semibold leading-tight">
              {scanTitle}
            </p>

            <div className="flex-1 flex items-center justify-center">
              {scanResult ? (
                <div className="bg-white rounded-[22px] px-8 py-12 shadow-2xl text-center max-w-md w-full">
                  <p className="text-[32px] font-bold mb-8 playfair-display italic underline">
                    ACCÈS AUTORISÉ !!
                  </p>
                  <p className="text-[#8B0000] text-[36px] font-semibold mb-6 playfair-display">
                    {scanResult.nom}
                  </p>
                  <p className="text-[#B8A07A] text-[24px] font-semibold playfair-display uppercase">
                    TABLE {scanResult.table}
                  </p>
                </div>
              ) : accessDenied ? (
                <div className="bg-white rounded-[22px] px-8 py-12 shadow-2xl text-center max-w-md w-full">
                  <p className="text-[#8B0000] text-[32px] font-bold playfair-display italic underline">
                    ACCÈS NON AUTORISÉ
                  </p>
                </div>
              ) : (
                <QrScannerBox onQrDetected={handleQrDetected} />
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-5 text-white">
            <div className="">
              <img
                src={adviceImageSrc}
                alt="Conseil"
                className="w-[80px] h-[80px] object-contain"
              />
            </div>
            <div>
              <p className="text-[22px] font-semibold leading-tight playfair-display">
                {adviceTitle}
              </p>
              <p className="text-[16px] whitespace-pre-line opacity-95 leading-snug mt-1 eb-garamond">
                {adviceText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const QrScannerBox = ({ onQrDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const streamRef = useRef(null);
  const lastScanAtRef = useRef(0);
  const lastValueRef = useRef(null);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    let stopped = false;

    const stopAll = () => {
      try {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      } catch {
        // ignore
      }
      rafRef.current = 0;

      const s = streamRef.current;
      streamRef.current = null;
      if (s) {
        try {
          for (const track of s.getTracks()) {
            track.stop();
          }
        } catch {
          // ignore
        }
      }
    };

    const decodeValue = (raw) => {
      if (typeof raw !== "string") return raw;
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    };

    const start = async () => {
      try {
        setError(null);
        setVideoReady(false);

        await ensureJsQr();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (stopped) {
          try {
            for (const track of stream.getTracks()) {
              track.stop();
            }
          } catch {
            // ignore
          }
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        // iOS Safari
        try {
          video.setAttribute("playsinline", "true");
        } catch {}
        try {
          video.setAttribute("webkit-playsinline", "true");
        } catch {}

        const markReady = () => {
          if (stopped) return;
          setVideoReady(true);
        };

        try {
          video.addEventListener("playing", markReady, { once: true });
        } catch {}
        try {
          video.addEventListener("loadeddata", markReady, { once: true });
        } catch {}
        try {
          video.addEventListener("canplay", markReady, { once: true });
        } catch {}

        video.srcObject = stream;

        await new Promise((resolve) => {
          const onReady = () => resolve();
          if (video.readyState >= 1) return resolve();
          video.addEventListener("loadedmetadata", onReady, { once: true });
        });

        try {
          await video.play();
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            markReady();
          }
        } catch (e) {
          setVideoReady(false);
          throw new Error(
            "Lecture vidéo bloquée. Autorise la caméra et vérifie que la page est en HTTPS (ou localhost)."
          );
        }

        const loop = async () => {
          if (stopped) return;

          const now = performance.now();
          if (now - lastScanAtRef.current < 250) {
            rafRef.current = requestAnimationFrame(loop);
            return;
          }
          lastScanAtRef.current = now;

          const canvas = canvasRef.current;
          if (!canvas || !video.videoWidth || !video.videoHeight) {
            if (!videoReady && video.videoWidth > 0 && video.videoHeight > 0) {
              setVideoReady(true);
            }

            rafRef.current = requestAnimationFrame(loop);
            return;
          }

          const ctx = canvas.getContext("2d", {
            willReadFrequently: true,
          });
          if (!ctx) {
            rafRef.current = requestAnimationFrame(loop);
            return;
          }

          if (canvas.width !== video.videoWidth) {
            canvas.width = video.videoWidth;
          }
          if (canvas.height !== video.videoHeight) {
            canvas.height = video.videoHeight;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (!videoReady) setVideoReady(true);

          try {
            const code = await detectQr(imageData);
            if (code?.data) {
              const decoded = decodeValue(code.data);
              // setResult((prev) => (prev === decoded ? prev : decoded));

              if (lastValueRef.current !== decoded) {
                lastValueRef.current = decoded;
                if (typeof onQrDetected === "function") {
                  onQrDetected(decoded);
                }
              }
            }
          } catch {
            // ignore une erreur de frame
          }

          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
      } catch (e) {
        if (stopped) return;

        let message = "Une erreur est survenue lors de l'accès à la caméra.";

        if (e?.name === "NotAllowedError" || e?.name === "PermissionDeniedError") {
          message =
            "Accès à la caméra refusé. Veuillez autoriser la caméra dans votre navigateur.";
        } else if (e?.name === "NotFoundError") {
          message = "Aucune caméra détectée sur cet appareil.";
        } else if (e?.message) {
          message = e.message;
        }

        setError(message);
        stopAll();
      }
    };

    start();

    return () => {
      stopped = true;
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-8 w-full aspect-square bg-[#6b6b6b] rounded-[14px] border border-white/70 overflow-hidden relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {!videoReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-white/90 text-[14px] px-6 text-center">
          Autorise l’accès à la caméra pour afficher le flux.
        </div>
      )}

      {!!result && (
        <div
          className="absolute left-3 right-3 bottom-3 bg-black/70 text-white text-[14px] rounded px-3 py-2 break-words"
          aria-live="polite"
        >
          {result}
        </div>
      )}

      {!!error && (
        <div className="absolute left-3 right-3 bottom-3 bg-red-600/80 text-white text-[14px] rounded px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
};

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

 const Main = () => {
     return (
      <>
        {style()}
         <div className="w-full h-screen bg-white overflow-hidden">
             <div className="w-full h-full flex flex-col md:flex-row">
                 <ScanPanel />
                 <WelcomePanel />
             </div>
         </div>
      </>
     );
 };
 
 export default Main;
