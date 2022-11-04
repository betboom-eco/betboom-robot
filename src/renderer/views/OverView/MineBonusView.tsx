import * as msgs from '@/messages';
import { useIntl } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { useWalletStore } from '@/store/wallet';

import icoBet from './bet_ico.png';
import icoBoom from './boom_ico.png';
import { createPricef } from '@/utils';
import { formatEther, formatUnits } from 'ethers/lib/utils';

const pricef = createPricef(2);

export function MineBonusView(props: any) {
  const { $t } = useIntl();
  const assets = useWalletStore((s) => s.assets);
  const betPrice = useWalletStore((s) => s.betPrice);
  const boomPrice = useWalletStore((s) => s.boomPrice);

  const list = [
    {
      symbol: 'BET',
      icon: icoBet,
      balance: assets.bet,
      price: betPrice,
      color: '#FF7300',
    },
    {
      symbol: 'BOOM',
      icon: icoBoom,
      balance: assets.boom,
      price: boomPrice,
      color: 'primary.main',
    },
  ];

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h6">{$t(msgs.strategy.miningIncome)}</Typography>
      <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
        {list.map((item) => (
          <Box key={item.symbol} sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={item.icon} style={{ width: 24 }} />
            <Box sx={{ ml: 1.5 }}>
              <Typography sx={{ color: item.color, fontSize: 14 }}>
                {pricef(formatEther(item.balance)) + ' ' + item.symbol}
              </Typography>
              <Typography
                sx={{
                  textTransform: 'capitalize',
                  color: '#959595',
                  fontSize: 10,
                }}
              >
                {$t(msgs.common.price)} {pricef(item.price)} USDT
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
