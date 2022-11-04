import { Routes, Route } from 'react-router-dom';
import { StrategyEditor } from './StrategyEditor';
import { Overview } from './OverView/Overview';
import {
  OptionsObject,
  SnackbarKey,
  SnackbarMessage,
  useSnackbar,
} from 'notistack';
import { useEffect } from 'react';
import { BetView } from './BetView';

declare global {
  interface Window {
    notify: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
    hideToast: (id: any) => void;
  }
}

export default function ViewRoutes() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    window.notify = enqueueSnackbar;
    window.hideToast = closeSnackbar;
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/strategy" element={<StrategyEditor />} />
      <Route path="/bets/:loop/:round" element={<BetView />} />
    </Routes>
  );
}
