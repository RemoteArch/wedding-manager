const {
  useState,
  useEffect,
  useRef
} = React;

function getComponentName() {
  let hash = window.location.hash.replace('#', '') || 'home';
  return hash.toLowerCase();
}

const initModule = await loadModule(`./components/${getComponentName()}.jsx`);

function App() {
  const [name, setName] = useState(null);
  const [Component, setComponent] = useState(() => initModule.default);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;

    const url = `./components/${name}.jsx`;
    setError(null);

    loadModule(url)
      .then((module) => {
        setComponent(() => module.default);
      })
      .catch((err) => {
        console.error('Erreur de chargement du composant:', err);
        setError(`Impossible de charger le composant "${name}"`);
      });
  }, [name]);

  useEffect(() => {
    const handleHashChange = () => {
      setName(getComponentName());
    };
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = '#home';
    }
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (error) {
    return /*#__PURE__*/React.createElement("div", { className: "error" }, error);
  }

  return Component ? /*#__PURE__*/React.createElement(Component, null) : null;
}
export default App;