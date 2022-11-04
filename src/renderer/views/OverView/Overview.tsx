import { useWalletStore } from '@/store/wallet';
import { AssetOverView } from './AssetOverView';
import { ImportKey } from '../wallet/ImportKey';
import Box from '@mui/material/Box';
import { StrategyOverview } from './StrategyOverview';
import { StrategyRunner } from './StrategyRunner';
import { useStrategyStore } from '@/store/strategy';
import { AnimateView } from '@/components/AnimateView';
import { LoopsView } from './LoopsView';
import { RunnerStatus, useRunnerStore } from '@/store/runner';
import { MineBonusView } from './MineBonusView';
import { Divider } from '@mui/material';

export function Overview() {
  const wallet = useWalletStore((s) => s.wallet);
  const strategy = useStrategyStore((s) => s.strategy);
  const status = useRunnerStore((s) => s.status);

  if (!wallet) return <ImportKey />;
  const readonly = status !== RunnerStatus.pending;
  return (
    <Box
      component={AnimateView}
      sx={{
        '& h6': { fontSize: 16, fontWeight: 600 },
      }}
    >
      <AssetOverView wallet={wallet} readonly={readonly} />
      <MineBonusView wallet={wallet} />
      <Divider sx={{ mx: 4 }} />
      <StrategyOverview strategy={strategy} readonly={readonly} />
      <StrategyRunner strategy={strategy} />
      <LoopsView status={status} />
    </Box>
  );
}
