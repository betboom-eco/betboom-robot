import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
const { Scrollbars } = require('react-custom-scrollbars');
import CssBaseline from '@mui/material/CssBaseline';

import ViewRoutes from './views';
import { ConfirmProvider } from '@/components/ConfirmDialog';
import { useI18nStore } from './store/i18n';
import theme from '@/styles/theme';
import './App.css';

export default function App() {
  const locale = useI18nStore((s) => s.locale);
  const messages = useI18nStore((s) => s.messages[s.locale] || s.messages.en);
  return (
    <React.StrictMode>
      <IntlProvider messages={messages} locale={locale} defaultLocale="en">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <ConfirmProvider />
            <Scrollbars
              autoHide
              renderView={(props: any) => <div {...props} className="view" />}
            >
              <MemoryRouter>
                <ViewRoutes />
              </MemoryRouter>
            </Scrollbars>
          </SnackbarProvider>
        </ThemeProvider>
      </IntlProvider>
    </React.StrictMode>
  );
}
