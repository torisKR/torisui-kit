import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// In a real consumer project this is `import '@toris-dev/ui/styles.css';`.
// The playground imports the source stylesheets directly for hot reload.
import '../../../packages/ui/src/styles/tokens.css';
import '../../../packages/ui/src/styles/base.css';
import '../../../packages/ui/src/styles/components.css';
import '../../../packages/ui/src/styles/extra-input.css';
import '../../../packages/ui/src/styles/extra-display.css';
import './playground.css';
import './demo-input-extra.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
