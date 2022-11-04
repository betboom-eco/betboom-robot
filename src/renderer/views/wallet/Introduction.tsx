import { Box, Button, Typography } from '@mui/material';
import { noop } from '@/utils';
import { Logo } from '@/components/Logo';

import bgimg from './bg@2x.png';
import { WalletLogo } from './Logo';
import { AnimateView } from '@/components/AnimateView';
import * as msgs from '@/messages';
import { useIntl } from 'react-intl';
import config from '@/config';
import { SafePromise } from '../shared/SafePromise';

export function Introduction({ onNext }: { onNext: () => void }) {
  const { $t } = useIntl();
  return (
    <Box
      component={AnimateView}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          padding: 4,
        }}
      >
        <WalletLogo />
        <Typography variant="body1" sx={{ my: 3, mt: 5 }}>
          {$t(msgs.home.proudctIntro1, {
            productName: $t(msgs.common.productName),
            highlight: (
              <Typography component="span" sx={{ color: 'primary.main' }}>
                {$t(msgs.home.safePromise)}
              </Typography>
            ),
          })}
        </Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          {$t(msgs.home.productIntro2, {
            brand: $t(msgs.common.brand),
            productName: $t(msgs.common.productName),
            symbol: config.network.symbol,
          })}
        </Typography>
        <Box sx={{ width: 340, mb: 2 }}>
          <SafePromise />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: `url(${bgimg}) no-repeat center top`,
          backgroundSize: 'cover',
        }}
      >
        <Button onClick={onNext} variant="contained">
          {$t(msgs.home.getStart)}
        </Button>
      </Box>
    </Box>
  );
}
