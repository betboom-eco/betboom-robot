import { createRoot } from 'react-dom/client';

import App from './App';
require('dotenv').config();
import * as Sentry from '@sentry/electron/renderer';

Sentry.init({
  dsn: 'https://2e30551087e6404297133bd911630393@o4504082432655360.ingest.sentry.io/4504082445828096',
});

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
