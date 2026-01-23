const {
  useState,
  useEffect
} = React;
function App() {
  const [name, setName] = useState(getComponentNameFromHash());
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  function getComponentNameFromHash() {
    let hash = window.location.hash.replace('#', '') || 'Home';
    return hash;
  }
  useEffect(() => {
    if (!name) return;
    const url = `./components/${name.toLowerCase()}.js`;
    setLoading(true);
    setError(null);
    loadModule(url).then(module => {
      setComponent(() => module.default);
      setLoading(false);
    }).catch(err => {
      console.error('Erreur de chargement du composant:', err);
      setError(`Impossible de charger le composant "${name}"`);
      setLoading(false);
    });
  }, [name]);
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
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "loading"
    }, "Chargement...");
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, error);
  }
  return Component ? /*#__PURE__*/React.createElement(Component, null) : null;
}
export default App;