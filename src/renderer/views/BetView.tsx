import { Box, Button, Typography } from '@mui/material';
import { Link, useLocation, useParams } from 'react-router-dom';
import { constants } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import LinearProgress from '@mui/material/LinearProgress';

import { useWalletStore } from '@/store/wallet';
import { useRunnerStore } from '@/store/runner';
import { createPricef, mask, range } from '@/utils';
import config from '@/config';
import { GameType, useStrategyStore } from '@/store/strategy';
import contract from '@/contract';
import * as msgs from '@/messages';
import { catchable } from '@/utils/catchable';

function getBetContent(type: GameType, option: number[] = []) {
  switch (type) {
    case GameType.bigSmall:
      return option[0] > 7 ? 'Big' : 'Small';
    case GameType.oddEven:
      return option[0] % 2 ? 'Odd' : 'Even';
    default:
      return Array.isArray(option)
        ? option.map((i) => Number(i).toString(16).toUpperCase()).join(', ')
        : option;
  }
}

const pricef = createPricef(2);

export function BetView() {
  const { loop, round } = useParams() as any;
  const radios = useRunnerStore((s) => s.radios);
  const wallet = useWalletStore((s) => s.wallet);
  const strategy = useStrategyStore((s) => s.strategy);
  const [blocknumber, setBlockNumber] = useState(constants.Zero);
  const [odds, setOdds] = useState(0);
  const [loading, setLoading] = useState(false);
  const { $t } = useIntl();

  const bet = useRunnerStore((s) => s.bets[loop]?.[round]);

  if (!bet.result) return null;

  const overviews = [
    {
      key: 'amount',
      label: $t(msgs.strategy.betAmount),
      desc: pricef(formatUnits(bet.result.amount || 0, 6)) + ' USDT',
    },
    {
      key: 'val',
      label: $t(msgs.strategy.betContent),
      desc: getBetContent(strategy?.type || GameType.bigSmall, bet.option),
    },
    {
      key: 'odds',
      label: $t(msgs.strategy.odds),
      desc: (odds || radios[bet.round - 1]) / 10000,
    },
  ] as Array<{ key: string; label: any; desc: any }>;

  const infos: any[] = [
    {
      key: 'bln',
      label: $t(msgs.strategy.blockNumber),
      desc: loading ? '...' : blocknumber.toNumber(),
    },
    {
      key: 'txh',
      label: $t(msgs.strategy.blockHash),
      desc: (
        <Box component="span">
          {mask(bet.result.hash, 6, -6)}
          <Typography
            component="a"
            href={`${config.network.explorer}/tx/${bet.tx}`}
            target="_blank"
            sx={{
              color: 'success.main',
              textDecoration: 'none',
              ml: 1,
              '&:hover': { color: 'primary.main' },
            }}
          >
            {$t(msgs.strategy.link)}
          </Typography>
        </Box>
      ),
    },
    bet.result
      ? {
          key: 'result',
          label: $t(msgs.strategy.betResult),
          desc: (
            <Typography sx={{ color: 'primary.main' }}>
              {getBetContent(bet.result.typeGame || GameType.bigSmall, [
                bet.result?.winNum,
              ])}
            </Typography>
          ),
        }
      : null,
    {
      key: 'bouns',
      label: $t(msgs.strategy.bouns),
      desc: (
        <Typography
          sx={{ color: bet.result.isWin ? 'primary.main' : 'error.main' }}
        >
          {bet.result.isWin
            ? '+' + pricef(formatUnits(bet.result.paid, 6))
            : '-' + pricef(formatUnits(bet.result.amount, 6))}
          {' USDT'}
        </Typography>
      ),
    },
    {
      key: 'pool',
      label: $t(msgs.strategy.miningIncome),
      desc: (
        <Typography sx={{ color: 'primary.main' }}>
          {[
            pricef(formatEther(bet.result.lAmount)) + ' BOOM',
            pricef(formatEther(bet.result.bAmount)) + ' BET',
          ].join(', ')}
        </Typography>
      ),
    },
  ].filter((i) => i);

  useEffect(() => {
    loadRoundInfo();
  }, [loop, round]);

  const loadRoundInfo = catchable(async () => {
    if (wallet && bet) {
      try {
        setLoading(true);
        const ri = await contract.luckyGame
          .connect(wallet.address)
          .getRoundInfo(bet.result!.oNum, Number(round) + 1);
        setBlockNumber(ri.quser.blockNum);
        setOdds(ri.quser.rateF.toNumber());
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Box sx={{ p: 2 }}>
      <Button component={Link} to="/">
        {$t(msgs.common.back)}
      </Button>
      {bet ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {$t(msgs.strategy.betInformation)}
          </Typography>
          <Box
            className="infor"
            sx={{
              borderRadius: 3,
              background: '#000',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box sx={{ p: 2 }}>
              {overviews.map((item) => (
                <InfoItem key={item.key} item={item} />
              ))}
            </Box>
            {loading && (
              <LinearProgress
                sx={{
                  zIndex: 3,
                  position: 'absolute',
                  width: '100%',
                  maxHeight: 2,
                }}
              />
            )}
            <Box sx={{ p: 2, bgcolor: '#212121' }}>
              {infos.map((item) => (
                <InfoItem key={item.key} item={item} />
              ))}
            </Box>
          </Box>

          {/* <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Debug information
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: '#000',
              overflow: 'hidden',
            }}
          >
            {debugs.map((item) => (
              <InfoItem key={item.key} item={item} />
            ))}
          </Box> */}
        </Box>
      ) : (
        <Box>Empty</Box>
      )}
    </Box>
  );
}

function InfoItem({ item }: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 1,
      }}
    >
      <Typography sx={{ color: '#959595' }}>{item.label}</Typography>
      <Box sx={{ color: '#fff' }}>{item.desc}</Box>
    </Box>
  );
}
