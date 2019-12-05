import React from 'react';
import ReactDOM from 'react-dom';

const themes = {
  old: 'static/styles-old.css',
  new: 'static/styles-new.css'
}

const defaultContext = false;
export const HibanaContext = React.createContext(defaultContext);

// A context provider to manage switching between two Matchbox versions 
// Provides a button toggle
// Any account feature flag check would be present in this component
 
export function Hibana(props) {
  const [enabled, setEnabled] = React.useState(defaultContext);

  return (
    <HibanaContext.Provider value={enabled}>

    {ReactDOM.createPortal(
      <link
        rel='stylesheet'
        type='text/css'
        href={enabled ? themes.new : themes.old}
      />,
      document.head
    )}

      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: '1000' }}>
        <button onClick={() => setEnabled(!enabled)}>
          {enabled ? 'Turn off Hibana' : 'Turn on Hibana'}
        </button>
      </div>

      {props.children}
    </HibanaContext.Provider>
  )
}

// A resuable hook
export function useHibana() {
  return React.useContext(HibanaContext);
}

