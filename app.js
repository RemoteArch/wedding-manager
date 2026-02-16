const { useState, useEffect } = React;

function getComponentName() {
  return (window.location.hash.replace('#', '') || 'home').toLowerCase();
}

// Préload lancé tout de suite (sans await)
let initialName = getComponentName();
const {default:initialComponent} = await loadModule('components/'+initialName+'.jsx');


function App() {
  const [name, setName] = useState(getComponentName());     // pas null
  const [Component, setComponent] = useState(() => initialComponent); // composant direct

  useEffect(() => {
    const handleHashChange = () => setName(getComponentName());
    window.addEventListener('hashchange', handleHashChange);

    if (!window.location.hash) window.location.hash = '#home';

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!name) return;
    // console.log(name , initialName)
    if(name == initialName) return;
    initialName = name;

    loadModule(`components/${name}.jsx`)
      .then((module) => {
        if (module?.default) setComponent(() => module.default);
        else console.error("Module chargé mais pas de default export:", module);
      })
      .catch((err) => {
        console.error('Erreur de chargement du composant:', err);
        // IMPORTANT: on ne met pas Component à null → pas de flash blanc
      });
  }, [name]);

  // Ici Component n'est jamais null si initialComponent est OK
  return React.createElement(Component, null);
}


export default App;
