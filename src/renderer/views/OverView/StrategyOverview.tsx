import { Box, Button, Typography } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { Link } from 'react-router-dom';
import {
  getMessageForGemeType,
  getMessageForTxSpeed,
  PlayStrategy,
} from 'renderer/store/strategy';
import * as msgs from '@/messages';
import { useIntl } from 'react-intl';
import { useOrdinal } from 'renderer/hooks/useOrdinal';

type PropsType = {
  strategy?: PlayStrategy;
  readonly?: boolean;
};

export function StrategyOverview({ strategy, readonly = false }: PropsType) {
  const { $t } = useIntl();
  const getOrdinal = useOrdinal();

  const infos = strategy
    ? [
        {
          title: $t(msgs.strategy.gameType),
          desc: getMessageForGemeType($t, strategy.type),
        },
        {
          title: $t(msgs.strategy.betAmount),
          desc: (
            <Typography sx={{ color: 'primary.main', fontSize: 'inherit' }}>
              {formatUnits(strategy.amount, 6)} USDT
            </Typography>
          ),
        },
        { title: $t(msgs.strategy.betTimes), desc: strategy.loops },
        {
          title: $t(msgs.strategy.transactionSpeed),
          desc: getMessageForTxSpeed($t, strategy.speed),
        },
        {
          title: $t(msgs.strategy.claimOnRoundHint),
          desc: $t(msgs.strategy.claimOnRound, {
            round: (
              <Typography component="span" sx={{ color: 'primary.main' }}>
                {getOrdinal(strategy.claimRound)}{' '}
              </Typography>
            ),
          }),
        },
      ]
    : [];

  return (
    <Box sx={{ p: 4, position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">{$t(msgs.strategy.myStrategy)}</Typography>

        {strategy ? (
          <Button
            component={Link}
            size="small"
            variant="text"
            to="/strategy"
            disabled={readonly}
          >
            {$t(msgs.common.edit)}
          </Button>
        ) : null}
      </Box>
      {strategy ? (
        <Box sx={{ px: 2.5, py: 1, my: 2, borderRadius: 2, bgcolor: '#000' }}>
          {infos.map((info) => (
            <Box
              key={info.title}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                my: 1.5,
                fontSize: 14,
                '& .title': { color: '#c1c1c1' },
              }}
            >
              <div className="title">{info.title}</div>
              <div className="val" style={{ textAlign: 'right' }}>
                {info.desc}
              </div>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          <Typography
            variant="body1"
            sx={{ my: 2, fontSize: 12, color: '#c1c1c1' }}
          >
            {$t(msgs.strategy.createStrategyHint)}
          </Typography>
          <Button
            component={Link}
            to="/strategy"
            variant="contained"
            sx={{ width: '100%', height: 50, my: 2 }}
          >
            {$t(msgs.strategy.createStrategy)}
          </Button>
        </Box>
      )}
    </Box>
  );
}
