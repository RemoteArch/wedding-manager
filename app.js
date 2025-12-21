const {
  useState,
  useEffect
} = React;
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };
  render() {
    if (this.state.hasError) {
      return /*#__PURE__*/React.createElement(ErrorComponent, {
        handleRetry: this.handleRetry,
        error: this.state.error
      });
    }
    return this.props.children;
  }
}
const loadModule = async url => {
  const finalUrl = /^http?:\/\//i.test(url) ? url : url;
  const response = await fetch(finalUrl);
  const source = await response.text();
  let code = source;
  if (/\.jsx$/i.test(url)) {
    if (!window.Babel) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'assets/js/babel.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Babel'));
        document.head.appendChild(script);
      });
    }
    const result = Babel.transform(source, {
      presets: ["react"],
      sourceType: "module"
    });
    code = result.code;
  }
  const blob = new Blob([code], {
    type: "text/javascript"
  });
  const blobUrl = URL.createObjectURL(blob);
  try {
    const module = await import(blobUrl);
    return module;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};
window.loadModule = loadModule;
const ErrorComponent = ({
  handleRetry,
  error
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen w-full flex items-center justify-center bg-bg-dark px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative max-w-lg w-full bg-bg-dark/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-primary/40 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-8 sm:p-10 pt-10 sm:pt-12 text-center text-text-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6 flex justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-bg-dark border border-primary/40 shadow-[0_0_0_1px_rgba(59,130,246,0.45)]"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-14 h-14 text-primary"
  }, /*#__PURE__*/React.createElement("path", {
    className: "fill-none stroke-current stroke-[1.8]",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 18h4l2-10 3 14 2-8h5"
  }), /*#__PURE__*/React.createElement("path", {
    className: "fill-none stroke-current stroke-[1.8]",
    strokeLinecap: "round",
    d: "M12 4h.01M18 4h.01M6 4h.01"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-xl"
  }))), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block text-primary"
  }, "404"), /*#__PURE__*/React.createElement("span", {
    className: "block text-primary/80 text-lg sm:text-xl mt-1"
  }, "Page introuvable")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm sm:text-base text-text-light/80 leading-relaxed max-w-md mx-auto"
  }, "La page que vous cherchez n\u2019existe pas ou n\u2019a pas pu \xEAtre charg\xE9e. V\xE9rifiez l\u2019adresse ou revenez \xE0 l\u2019accueil pour continuer votre navigation."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      window.location.hash = '#Home';
      if (typeof handleRetry === 'function') handleRetry();
    },
    className: "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium bg-secondary text-white shadow-md shadow-primary/30 hover:shadow-xl hover:bg-secondary/90 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    className: "shrink-0"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m4 12 8-8 8 8M6 10v10h12V10"
  })), /*#__PURE__*/React.createElement("span", null, "Retour \xE0 l\u2019accueil")), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.location.reload(),
    className: "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium bg-transparent border border-primary/60 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    className: "shrink-0"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.024 7.043A8.374 8.374 0 0 0 3.74 12.955"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m17.35 2.75.832 3.372a1.123 1.123 0 0 1-.854 1.382l-3.372.843"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.976 16.957a8.374 8.374 0 0 0 14.285-5.912"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6.65 21.25-.832-3.372a1.124 1.124 0 0 1 .855-1.382l3.371-.843"
  }))), /*#__PURE__*/React.createElement("span", null, "Recharger la page"))), /*#__PURE__*/React.createElement("div", {
    className: "hidden mt-6 text-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs uppercase tracking-wide text-text-light/60 mb-1"
  }, "D\xE9tails techniques"), /*#__PURE__*/React.createElement("div", {
    className: "bg-bg-dark/80 rounded-lg p-3 text-xs font-mono text-primary/90 break-all border border-primary/40 max-h-32 overflow-auto shadow-inner shadow-primary/30"
  }, String(error))))));
};
const RenderComponent = ({
  url,
  props = {},
  children
}) => {
  if (!url) return null;
  const lazyJsxEsm = () => {
    return React.lazy(async () => {
      const mod = await loadModule(url);
      const Comp = mod?.default;
      if (!Comp) throw new Error(`Aucun export par défaut après chargement de ${globalName}`);
      return {
        default: Comp
      };
    });
  };
  const Comp = React.useMemo(() => lazyJsxEsm(), [url]);
  return /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null, children)
  }, /*#__PURE__*/React.createElement(Comp, props)));
};
function App() {
  const [name, setName] = useState(getComponentNameFromHash());
  const [url, setUrl] = React.useState(null);
  useEffect(() => {
    if (!name) return;
    setUrl(`./components/${name.toLowerCase()}.jsx`);
  }, [name]);
  function getComponentNameFromHash() {
    let hash = window.location.hash.replace('#', '') || 'Home';
    return hash;
  }
  useEffect(() => {
    const handleHashChange = () => {
      setName(getComponentNameFromHash());
    };

    // Add event listener
    window.addEventListener('hashchange', handleHashChange);

    // Set initial hash if empty
    if (!window.location.hash) {
      window.location.hash = '#Home';
    }
    handleHashChange();
    // Clean up event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  return /*#__PURE__*/React.createElement(RenderComponent, {
    key: url,
    url: url
  });
}
ReactDOM.render(/*#__PURE__*/React.createElement(App, null), document.getElementById('root'));