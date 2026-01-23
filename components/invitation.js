const getQrCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
};
const code = getQrCodeFromUrl();
let inviteData = null;
if (code) {
  try {
    const response = await fetch(`/api/index.php/index/find_invite_by_code?code=${code}`);
    const data = await response.json();
    inviteData = data.data;
    console.log(inviteData);
  } catch {
    //  window.location.hash = '#home';
  }
} else {
  window.location.hash = '#home';
}
const Section1 = () => {
  return /*#__PURE__*/React.createElement("section", {
    className: "relative w-full h-full max-h-[650px] bg-gradient-to-b from-[#9C370B] to-[#BF5F35] p-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0  left-1/2 transform -translate-x-1/2"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/corde.png",
    className: "w-40"
  })), /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/kristelle.png",
    className: "absolute bottom-0 left-0 max-h-[500px]"
  }), /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/franck.png",
    className: "absolute bottom-0 right-0 max-h-[500px]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-0 left-0 w-full h-[82px] bg-gradient-to-t from-[#E68A66] to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-100 flex flex-col items-center space-y-3 z-[1] pt-10 space-y-4 h-full"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond text-[35px] text-[#FFD365] font-bold underline decoration-white decoration-1 underline-offset-10 decoration-dashed"
  }, inviteData?.invite), /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond text-[20px] text-white"
  }, "Vous \xEAtes convi\xE9s au mariage de"), /*#__PURE__*/React.createElement("p", {
    className: "playfair-display font-bold text-[30px] text-white"
  }, "Kristel & Frank"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center space-y-3 bg-gradient-to-b from-[#ad4a21] to-[#d07c5b] p-2 mt-auto pb-10 rounded-t-xl"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond max-w-30 text-white text-center"
  }, "Cliquez  pour d\xE9couvrir notre histoire d\u2019amour et d\u2019autres d\xE9tails "), /*#__PURE__*/React.createElement("a", {
    href: "/"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/ici.png",
    className: "w-30"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pt-4 text-white eb-garamond text-center "
  }, "TABLE ", /*#__PURE__*/React.createElement("br", null), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-black font-bold"
  }, inviteData?.table)))));
};
const Section2 = () => {
  const qrData = getQrCodeFromUrl();
  const handleQrDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      canvas.width = qrImg.width;
      canvas.height = qrImg.height;
      ctx.drawImage(qrImg, 0, 0);
      const link = document.createElement('a');
      link.download = 'qr-code-invitation.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrData)}`;
  };
  if (!qrData) {
    return null;
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "w-full bg-[#5C2A16] p-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2 mt-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond text-[26px] text-[#FFD365] font-bold"
  }, "Important :"), /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond text-[18px] text-white font-bold"
  }, "\xC0 l'entr\xE9e de la salle de r\xE9ception, ", /*#__PURE__*/React.createElement("br", null), "Veuillez afficher votre QR Code pour y acc\xE9der")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-md shadow-md"
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(qrData)}`,
    alt: "QR Code K&F",
    className: "w-full object-contain mx-auto"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleQrDownload,
    className: "bg-black text-white eb-garamond text-[18px] px-10 py-3 rounded-md shadow-lg w-full font-bold"
  }, "T\xE9l\xE9charger mon QR Code"));
};
const Section3 = () => {
  return /*#__PURE__*/React.createElement("section", {
    className: "relative w-full bg-white py-12 px-6 md:px-16 overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/polygone.png",
    alt: "D\xE9cor polygone",
    className: "absolute top-0 left-0 w-64 h-64"
  }), /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/polygone1.png",
    alt: "D\xE9cor polygone",
    className: "absolute bottom-10 left-0 w-30 h-30 rotate-90"
  }), /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("p", {
    className: "dancing-script text-[32px] md:text-[40px] text-black font-bold leading-tight"
  }, "Id\xE9es de"), /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond text-[40px] md:text-[48px] text-[#5C2A16] font-bold leading-tight"
  }, "Dress Code")), /*#__PURE__*/React.createElement("img", {
    src: "./assets/images/home/img-grid.png",
    alt: "Id\xE9es de dress code"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-10 flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond font-bold text-[20px] md:text-[24px] text-black max-w-xl leading-snug"
  }, "D\xE9couvrez notre filtre snap et accompagnez nous dans cette aventure"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=628fbacc44394620a5cc0164b05624fb&metadata=01",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/images/home/snapchat-filter.png",
    alt: "Filtre Snapchat du mariage",
    className: "w-32 h-32 md:w-40 md:h-40 object-contain my-[-7px]"
  })))));
};
const style = () => {
  return /*#__PURE__*/React.createElement("style", null, `
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
            `);
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
const Wedding = () => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, style(), /*#__PURE__*/React.createElement("div", {
    className: "md:hidden"
  }, inviteData === undefined ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center min-h-screen bg-white px-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eb-garamond text-[28px] text-[#B45B37] font-bold mb-6 text-center"
  }, "Le lien d'invitation n'est pas correct ou a expir\xE9."), /*#__PURE__*/React.createElement("button", {
    className: "bg-[#B45B37] text-white eb-garamond text-[18px] px-8 py-3 rounded-md shadow-lg font-bold",
    onClick: () => window.location.href = '/'
  }, "Revenir \xE0 l'accueil")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section1, null), /*#__PURE__*/React.createElement(Section2, null), /*#__PURE__*/React.createElement(Section3, null))), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center justify-center py-10 h-screen"
  }, /*#__PURE__*/React.createElement("p", {
    className: "playfair-display text-[18px] text-gray-800 text-center max-w-md font-bold"
  }, "Pour une meilleure exp\xE9rience, veuillez ouvrir cette page sur votre t\xE9l\xE9phone mobile.")));
};
export default Wedding;