import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

function renderApp(container: HTMLElement) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

if (rootElement) {
  renderApp(rootElement);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('root');
    if (el) {
      renderApp(el);
    } else {
      console.error("Failed to find '#root' container element.");
    }
  });
}

