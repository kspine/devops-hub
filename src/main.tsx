import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './components/ToastContext.tsx';
import { LanguageProvider } from './LanguageContext.tsx';
import { WorkspaceProvider } from './WorkspaceContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { UserProvider } from './UserContext.tsx';
import './i18n.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <ToastProvider>
            <WorkspaceProvider>
              <App />
            </WorkspaceProvider>
          </ToastProvider>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
