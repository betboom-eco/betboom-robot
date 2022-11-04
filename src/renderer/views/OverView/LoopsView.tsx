import { RunnerStatus, useRunnerStore } from '@/store/runner';
import { range } from '@/utils';
import { Box, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';
import * as msgs from '@/messages';

import dotfail from './dot-fail.png';
import dotpending from './dot-pending.png';
import dotwin from './dot-win.png';

const dots: any = {
  lost: dotfail,
  win: dotwin,
  pending: dotpending,
};

export function LoopsView({ status }: { status: RunnerStatus }) {
  const loops = useRunnerStore((s) => s.loops);
  const loopIndex = useRunnerStore((s) => s.loopIndex);
  const roundIndex = useRunnerStore((s) => s.roundIndex);
  const bets = useRunnerStore((s) => s.bets);

  const { $t } = useIntl();
  const isFinished = loopIndex >= loops.length;

  return (
    <Box sx={{ p: 4, pt: 3 }}>
      {status == RunnerStatus.pending && loopIndex == 0 ? null : (
        <Typography variant="h6">{$t(msgs.strategy.strategyLogs)}</Typography>
      )}
      <AnimatePresence>
        {range(loopIndex + 1).map((loop, idx) => {
          if (isFinished && idx === 0) return null;
          const i: number = loopIndex - idx;
          if (
            status === RunnerStatus.pending &&
            i === loopIndex &&
            roundIndex == 0
          )
            return null;
          return i > loopIndex ? null : (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
              }}
            >
              <Box
                className="bets"
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  className="order"
                  sx={{
                    width: 32,
                    minHeight: 32,
                    border: '1px solid',
                    borderColor: i === loopIndex ? 'primary.mian' : '#414141',
                    color: i === loopIndex ? 'primary.main' : 'inherit',
                    fontSize: 14,
                    borderRadius: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2,
                    p: 0.5,
                  }}
                >
                  {i + 1}
                  {i === loopIndex && (
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        bgcolor: 'primary.main',
                        my: 0.3,
                        borderRadius: 4,
                      }}
                    />
                  )}
                </Box>
                {range(5).map((k) => {
                  const bet = bets[i]?.[k] as any;
                  let stat = 'default';
                  if (bet != null) {
                    stat = 'pendding';
                  } else {
                    return null;
                  }
                  const result = bet?.result;

                  if (result) {
                    stat = result.isWin ? 'win' : 'lost';
                  } else if (status === 0) {
                    return null;
                  }
                  return (
                    <Box
                      component={result ? Link : motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={[i, k].join(':')}
                      to={`/bets/${i}/${k}`}
                      sx={{
                        width: 44,
                        height: 44,
                        color: '#959595',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        mx: 1.5,
                        my: 2,
                        '&:hover': {
                          color: 'priamry.main',
                        },
                      }}
                    >
                      <img
                        src={dots[stat] || dots.pending}
                        style={{ width: '100%', height: '100%' }}
                      />
                      <Typography
                        sx={{
                          color: 'inherit',
                          fontSize: 12,
                          p: '3px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {bet.round}
                        <ArrowRightIcon sx={{ fontSize: 12, p: 0, m: 0 }} />
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </AnimatePresence>
    </Box>
  );
}
